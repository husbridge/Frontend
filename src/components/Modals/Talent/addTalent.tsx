import Close from "@assets/icons/close.svg"
import { Button, FormControls } from "@components/index"
import { Modal, Select } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { fetchManagers } from "@services/manager"
import { createTalent } from "@services/talents"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addTalentValidationSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useState, useRef, useEffect } from "react"
import { type Error } from "../../../type/api/index"
import { useBilling } from "@contexts/payments/billing"

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
    const [paymentStatus, setPaymentStatus] = useState<
        "idle" | "initiating" | "pending" | "success" | "failed"
    >("idle")
    const pendingTalentData = useRef<TalentFormData & { manager?: string }>()

    // Use billing context
    const {
        initiatePayment,
        checkPaymentStatus,
        hasPaymentMethod,
        isInitiatingPayment,
        isPolling,
        stopPolling,
        onPaymentEvent,
    } = useBilling()

    const { mutate: createTalentMutation, isPending: isCreatingTalent } =
        useMutation({
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

    // Watch for payment method confirmation
    useEffect(() => {
        if (
            hasPaymentMethod &&
            paymentStatus === "pending" &&
            pendingTalentData.current
        ) {
            setPaymentStatus("success")
            createTalentMutation(pendingTalentData.current)
        }
    }, [hasPaymentMethod, paymentStatus, createTalentMutation])

    // Listen to payment events from Paystack popup
    useEffect(() => {
        const unsubscribe = onPaymentEvent((type) => {
            switch (type) {
                case "success":
                    showNotification({
                        title: "Payment Processing",
                        message: "Verifying your payment...",
                        color: "blue",
                    })
                    break
                case "cancelled":
                    setPaymentStatus("failed")
                    showNotification({
                        title: "Payment Cancelled",
                        message: "You cancelled the payment. Please try again.",
                        color: "orange",
                    })
                    break
                case "error":
                    setPaymentStatus("failed")
                    showNotification({
                        title: "Payment Error",
                        message:
                            "An error occurred during payment. Please try again.",
                        color: "red",
                    })
                    break
            }
        })

        return unsubscribe
    }, [onPaymentEvent])

    const handleCloseModal = () => {
        setOpened(false)
        setPaymentStatus("idle")
        pendingTalentData.current = undefined
        stopPolling()
    }

    const handleFormSubmit = async (values: TalentFormData) => {
        const talentData = {
            ...values,
            manager: selectedManager?._id,
        }

        pendingTalentData.current = talentData

        // Check current payment status first
        checkPaymentStatus()

        // Wait a moment for status to update
        setTimeout(() => {
            if (hasPaymentMethod) {
                // Already has payment method, create talent directly
                createTalentMutation(talentData)
            } else {
                // Need to initiate payment
                setPaymentStatus("initiating")
                initiatePayment({
                    callback_url: `${window.location.origin}/payment-callback`,
                })
                setPaymentStatus("pending")
            }
        }, 300)
    }

    const retryPayment = async () => {
        if (pendingTalentData.current) {
            // Check if payment was completed in the meantime
            checkPaymentStatus()

            setTimeout(() => {
                if (hasPaymentMethod) {
                    createTalentMutation(pendingTalentData.current!)
                } else {
                    setPaymentStatus("initiating")
                    initiatePayment({
                        callback_url: `${window.location.origin}/payment-callback`,
                    })
                    setPaymentStatus("pending")
                }
            }, 300)
        }
    }

    const isPending =
        isInitiatingPayment ||
        isCreatingTalent ||
        paymentStatus === "pending" ||
        isPolling

    const getButtonText = () => {
        switch (paymentStatus) {
            case "initiating":
                return "Initiating Payment..."
            case "pending":
                return isPolling
                    ? "Verifying Payment..."
                    : "Waiting for Payment..."
            case "success":
                return isCreatingTalent
                    ? "Adding Talent..."
                    : "Payment Successful"
            case "failed":
                return "Retry Payment"
            default:
                return isCreatingTalent ? "Adding Talent..." : "Add Talent"
        }
    }

    const getStatusMessage = () => {
        switch (paymentStatus) {
            case "pending":
                return (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm">
                            {isPolling
                                ? "Verifying your payment. Please wait..."
                                : "Please complete your payment in the opened window."}
                        </p>
                    </div>
                )
            case "failed":
                return (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">
                            Payment was not completed. Please try again.
                        </p>
                    </div>
                )
            case "success":
                return (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm">
                            Payment verified! Adding talent...
                        </p>
                    </div>
                )
            default:
                return null
        }
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isPolling) {
                stopPolling()
            }
        }
    }, [isPolling, stopPolling])

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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                                disabled={
                                    paymentStatus === "pending" ||
                                    paymentStatus === "success" ||
                                    isSubmitting
                                }
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
                            type={
                                paymentStatus === "failed" ? "button" : "submit"
                            }
                            onClick={
                                paymentStatus === "failed"
                                    ? retryPayment
                                    : undefined
                            }
                            disabled={
                                isPending ||
                                paymentStatus === "success" ||
                                isSubmitting
                            }
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
