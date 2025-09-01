import Close from "@assets/icons/close.svg"
import { Button, FormControls } from "@components/index"
import { Modal, Select } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { fetchManagers } from "@services/manager"
import { createTalent } from "@services/talents"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addTalentValidationSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useState, useRef } from "react"
import { type Error } from "../../../type/api/index"
import { initiatePayment, getPaymentStatus } from "@services/payment"

export interface AddTalentModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

type ManagerType = {
    _id: string
    fullName: string
}

type TalentFormData = {
    firstName: string
    lastName: string
    stageName: string
    emailAddress: string
    phoneNumber: string
    gender: string
    industry: string
}

const AddTalent = ({ opened, setOpened }: AddTalentModalProps) => {
    const queryClient = useQueryClient()
    const [selectedManager, setSelectedManager] = useState<ManagerType>()
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'pending' | 'success' | 'failed'>('idle')
    const [authorizationUrl, setAuthorizationUrl] = useState<string>('')
    const pendingTalentData = useRef<TalentFormData & { manager?: string }>()
    const pollIntervalRef = useRef<NodeJS.Timeout>()

    const { mutate: initiatePaymentMutation, isPending: isInitiatingPayment } = useMutation({
        mutationFn: initiatePayment,
        onSuccess: (data) => {
            const url = data?.data?.data?.authorization_url

            if (url) {
                setAuthorizationUrl(url)
                setPaymentStatus('pending')
                window.open(url, '_blank', 'noopener,noreferrer')
                startPaymentPolling()
            } else {
                showNotification({
                    title: "Error",
                    message: "Failed to get payment authorization URL",
                    color: "red",
                })
                setPaymentStatus('failed')
            }
        },
        onError: (err: Error) => {
            showNotification({
                title: "Payment Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
            setPaymentStatus('failed')
        },
    })

    const { mutate: createTalentMutation, isPending: isCreatingTalent } = useMutation({
        mutationFn: createTalent,
        onSuccess: (data) => {
            showNotification({
                title: "Success",
                message: data?.data.message,
                color: "green",
            })
            handleCloseModal()
            queryClient
                .invalidateQueries({
                    queryKey: ["talents"],
                })
                .finally(() => false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
            setPaymentStatus("idle")
        },
    })

    const teamQuery = useQuery({
        queryKey: ["managers"],
        queryFn: () => fetchManagers(),
    })

    const managers: ManagerType[] = teamQuery.data?.data || []

    const startPaymentPolling = () => {
        pollIntervalRef.current = setInterval(() => {
            checkPaymentStatus()
        }, 3000)
    }

    const stopPaymentPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = undefined
        }
    }

    const checkPaymentStatus = async () => {
        try {
            const response = await getPaymentStatus()
            const status = response?.data.data.hasPaymentMethod
            if (status) {
                setPaymentStatus('success')
                stopPaymentPolling()

                if (pendingTalentData.current) {
                    createTalentMutation(pendingTalentData.current)
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error)
        }
    }
    const handleCloseModal = () => {
        setOpened(false)
        setPaymentStatus('idle')
        setAuthorizationUrl('')
        pendingTalentData.current = undefined
        stopPaymentPolling()
    }

    const handleFormSubmit = async (values: TalentFormData) => {
        const talentData = {
            ...values,
            manager: selectedManager?._id,
        }

        pendingTalentData.current = talentData

        try {
            const response = await getPaymentStatus()
            const hasPaymentMethod = response?.data.data.hasPaymentMethod

            if (hasPaymentMethod) {
                createTalentMutation(talentData)
            } else {
                setPaymentStatus('initiating')
                initiatePaymentMutation({ callback_url: `${window.location.origin}/payment-callback` })
            }
        } catch (error) {
            showNotification({
                title: "Error",
                message: "Failed to check payment status",
                color: "red",
            })
        }
    }

    const retryPayment = async () => {
        if (pendingTalentData.current) {
            try {
                const response = await getPaymentStatus()
                const hasPaymentMethod = response?.data.data.hasPaymentMethod

                if (hasPaymentMethod) {
                    createTalentMutation(pendingTalentData.current)
                } else {
                    setPaymentStatus('initiating')
                    initiatePaymentMutation({ callback_url: `${window.location.origin}/payment-callback` })
                }
            } catch (error) {
                showNotification({
                    title: "Error",
                    message: "Failed to check payment status",
                    color: "red",
                })
            }
        }
    }

    const isPending = isInitiatingPayment || isCreatingTalent || paymentStatus === 'pending'

    const getButtonText = () => {
        switch (paymentStatus) {
            case 'initiating':
                return 'Initiating Payment...'
            case 'pending':
                return 'Waiting for Payment...'
            case 'success':
                return isCreatingTalent ? 'Adding Talent...' : 'Payment Successful'
            case 'failed':
                return 'Retry Action'
            default:
                return isCreatingTalent ? 'Adding Talent...' : 'Add Talent'
        }
    }

    const getStatusMessage = () => {
        switch (paymentStatus) {
            case 'pending':
                return (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm">
                            Please complete your payment in the opened window.
                            We'll automatically proceed once payment is confirmed.
                        </p>
                        {authorizationUrl && (
                            <button
                                onClick={() => window.open(authorizationUrl, '_blank', 'noopener,noreferrer')}
                                className="text-blue-600 underline text-sm mt-2"
                            >
                                Reopen payment window
                            </button>
                        )}
                    </div>
                )
            case 'failed':
                return (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            Payment failed. Please try again.
                        </p>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={handleCloseModal}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Add Talent
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={handleCloseModal}
                />
            </div>

            {getStatusMessage()}

            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    stageName: "",
                    emailAddress: "",
                    phoneNumber: "",
                    gender: "",
                    industry: "",
                }}
                validationSchema={addTalentValidationSchema}
                onSubmit={handleFormSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="First Name"
                                control="input"
                                name="firstName"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Last Name"
                                control="input"
                                name="lastName"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>

                        <div className="mb-6">
                            <FormControls
                                label="Stage Name (optional)"
                                control="input"
                                name="stageName"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Email"
                                control="input"
                                name="emailAddress"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Mobile Number"
                                control="input"
                                name="phoneNumber"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <Select
                                label="Manager"
                                data={managers.map((manager) => ({
                                    value: manager._id,
                                    label: manager.fullName,
                                }))}
                                placeholder="Search managers"
                                searchable
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                styles={{
                                    input: {
                                        borderRadius: "80px",
                                        padding: "16px",
                                        height: "50px",
                                        marginTop: "10px",
                                    },
                                    label: {
                                        fontSize: "15px",
                                    },
                                }}
                                value={selectedManager?._id || null}
                                onChange={(value) => {
                                    const selected = managers.find(
                                        (manager) => manager._id === value
                                    )
                                    setSelectedManager(selected || undefined)
                                }}
                                clearable
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Gender"
                                control="select"
                                name="gender"
                                placeholder="Select Gender"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </FormControls>
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Industry"
                                control="input"
                                name="industry"
                                disabled={paymentStatus === 'pending' || paymentStatus === 'success' || isSubmitting}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>
                        <Button
                            variant="primary"
                            className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                            type={paymentStatus === 'failed' ? 'button' : 'submit'}
                            onClick={paymentStatus === 'failed' ? retryPayment : undefined}
                            disabled={isPending || paymentStatus === 'success' || isSubmitting}
                        >
                            {getButtonText()}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AddTalent