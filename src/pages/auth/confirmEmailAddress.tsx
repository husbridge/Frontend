import LeftBackground from "./components/leftBackground"
import { FormControls, Button, AccountCreatedModal } from "@components/index"
import { Formik, Form } from "formik"
import { useNavigate, useLocation } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { useState, useEffect, useRef } from "react"
import { verifyOTP, resendOTP } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../type/api/index"
import { confirmEmailAddressSchema } from "@utils/validationSchema"
import useAuth from "@hooks/auth/useAuth"
import { setAccessToken } from "@services/api.services"
import useTimer from "@hooks/auth/useTimer"
import { useForgetPassword } from "@hooks/auth/useForgetPassword"
import { initiatePayment, getPaymentStatus } from "@services/payment"

const ConfirmEmailAddress = () => {
    const { handleTimerStart, time, minutes, seconds } = useTimer()
    const [openModal, setOpenModal] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'pending' | 'success' | 'failed'>('idle')
    const [authorizationUrl, setAuthorizationUrl] = useState<string>('')
    const [userDataAfterVerification, setUserDataAfterVerification] = useState<any>(null)
    const navigate = useNavigate()
    const location = useLocation()
    const pollIntervalRef = useRef<NodeJS.Timeout>()

    const { dispatch } = useAuth()

    // Function to save user data after payment completion
    const saveUserDataAfterPayment = (userData: any) => {
        // Set access token
        setAccessToken(userData.accessToken || "")

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify({
            ...userData,
            hasAgency: !!userData.agency
        }))

        // Dispatch to auth context
        dispatch({
            type: "SET_USER_DATA",
            payload: userData,
        })
    }

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

    const { isPending, mutate } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: async (data) => {
            // Store user data temporarily - don't save to localStorage/auth context yet
            setUserDataAfterVerification(data.data.data)

            // If registration is already completed, save user data and navigate
            if (data.data.data.registrationStage === "completed") {
                saveUserDataAfterPayment(data.data.data)
                navigate("/dashboard")
                return
            }

            try {
                const paymentResponse = await getPaymentStatus()
                const hasPaymentMethod = paymentResponse?.data.data.hasPaymentMethod

                if (hasPaymentMethod) {
                    // Payment already exists, save user data and show modal
                    saveUserDataAfterPayment(data.data.data)
                    setOpenModal(true)
                } else {
                    // No payment method exists, initiate payment
                    // Don't save user data yet - wait for payment completion
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
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { isPending: isLoading, mutate: mutateResend } = useMutation({
        mutationFn: resendOTP,
        onSuccess: ({ data }) => {
            showNotification({
                title: "Success",
                message: data.message,
                color: "green",
            })
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { isPending: isLoadingForgetPassword, mutate: mutateForgetPassword } =
        useForgetPassword()

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
            if (status && userDataAfterVerification) {
                setPaymentStatus('success')
                stopPaymentPolling()

                // Payment successful - NOW save the user data
                saveUserDataAfterPayment(userDataAfterVerification)

                // Show the modal to proceed
                setOpenModal(true)
            }
        } catch (error) {
            console.error('Error checking payment status:', error)
        }
    }

    const retryPayment = async () => {
        try {
            const response = await getPaymentStatus()
            const hasPaymentMethod = response?.data.data.hasPaymentMethod

            if (hasPaymentMethod && userDataAfterVerification) {
                // Payment exists, save user data and show modal
                saveUserDataAfterPayment(userDataAfterVerification)
                setPaymentStatus('success')
                setOpenModal(true)
            } else {
                // Retry payment initiation
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

    const handleResend = () => {
        if (location.state?.previous === "forgetPassword") {
            mutateForgetPassword({ username: location.state.email })
        } else {
            mutateResend({ username: location.state.email })
        }

        handleTimerStart()
    }

    const handleModalNavigate = () => {
        if (userDataAfterVerification) {
            userDataAfterVerification.userType === "agency"
                ? navigate("/agency-signup", { state: { key: 1 } })
                : userDataAfterVerification.userType === "manager"
                    ? navigate("/manager-signup", { state: { key: 1 } })
                    : navigate("/talent-signup", { state: { key: 1 } })
        }
    }

    const getPaymentStatusMessage = () => {
        switch (paymentStatus) {
            case 'pending':
                return (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm font-medium">
                            Payment Required
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                            Please complete your payment in the opened window to proceed to the next step.
                        </p>
                        {authorizationUrl && (
                            <button
                                onClick={() => window.open(authorizationUrl, '_blank', 'noopener,noreferrer')}
                                className="text-blue-600 underline text-sm mt-2 hover:text-blue-800"
                            >
                                Reopen payment window
                            </button>
                        )}
                    </div>
                )
            case 'failed':
                return (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">
                            Payment Failed
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                            Payment could not be processed. Please try again to continue.
                        </p>
                        <button
                            onClick={retryPayment}
                            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            disabled={isInitiatingPayment}
                        >
                            {isInitiatingPayment ? 'Retrying...' : 'Retry Payment'}
                        </button>
                    </div>
                )
            case 'success':
                return (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">
                            Payment Successful!
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                            Your payment has been processed successfully. You can now proceed.
                        </p>
                    </div>
                )
            default:
                return null
        }
    }

    const getSubmitButtonText = () => {
        if (location.state?.previous === "forgetPassword") {
            return "Confirm code"
        }

        switch (paymentStatus) {
            case 'initiating':
                return 'Initiating Payment...'
            case 'pending':
                return 'Waiting for Payment...'
            case 'success':
                return 'Create Profile'
            case 'failed':
                return 'Payment Required'
            default:
                return isPending ? "Creating..." : "Create Profile"
        }
    }

    const isSubmitDisabled = () => {
        if (location.state?.previous === "forgetPassword") {
            return false
        }

        return isPending || isInitiatingPayment || (paymentStatus === 'pending') || (paymentStatus === 'failed')
    }

    useEffect(() => {
        handleTimerStart()

        // Cleanup polling on component unmount
        return () => {
            stopPaymentPolling()
        }
    }, [])

    return (
        <div className="flex">
            <AccountCreatedModal
                opened={openModal}
                handleNavigate={handleModalNavigate}
            />
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-32 p-6 md:w-[70%] w-full">
                <MdArrowBack
                    size={28}
                    className="mb-10 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg leading-6">
                    Confirm Email Address
                </h3>

                {/* Payment Status Message */}
                {paymentStatus !== 'idle' && getPaymentStatusMessage()}

                <Formik
                    initialValues={{
                        code: "",
                    }}
                    validationSchema={confirmEmailAddressSchema}
                    onSubmit={(values) => {
                        console.log(values)
                        if (location.state?.previous === "forgetPassword") {
                            navigate("/createNewPassword", {
                                state: {
                                    email: location.state.email,
                                    otp: values.code,
                                },
                            })
                        } else {
                            mutate({
                                code: values.code,
                                username: location.state.email,
                            })
                        }
                    }}
                >
                    {() => (
                        <Form className="py-4 mt-4">
                            <div className="mb-6">
                                <FormControls
                                    label="We have sent a 6-digit confirmaton OTP to the email address that you provided."
                                    control="otp"
                                    name="code"
                                    placeholder="enter your new password"
                                    classNames={{
                                        mainRoot: " h-12  border-black-20 p",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000000B2]"
                                />
                            </div>

                            <Button
                                variant="primary"
                                className="px-6 text-white-100 w-full rounded-[40px] mt-10"
                                type="submit"
                                disabled={isSubmitDisabled()}
                            >
                                {getSubmitButtonText()}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-[16px] text-[#475569]">
                    Didn&apos;t receive any code?{" "}
                    <span
                        className="text-[#47556978] cursor-pointer pr-2"
                        onClick={() => time === 0 && handleResend()}
                    >
                        {isLoading || isLoadingForgetPassword
                            ? "Retrying..."
                            : "Retry in"}
                    </span>
                    {`${minutes}:${seconds}`}
                </p>
            </div>
        </div>
    )
}

export default ConfirmEmailAddress;