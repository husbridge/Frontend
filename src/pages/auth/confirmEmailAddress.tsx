import LeftBackground from "./components/leftBackground"
import { FormControls, Button, AccountCreatedModal } from "@components/index"
import { Formik, Form } from "formik"
import { useNavigate, useLocation } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { useState, useEffect, useCallback } from "react"
import { verifyOTP, resendOTP } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../type/api/index"
import { confirmEmailAddressSchema } from "@utils/validationSchema"
import useAuth from "@hooks/auth/useAuth"
import { setAccessToken } from "@services/api.services"
import useTimer from "@hooks/auth/useTimer"
import { useForgetPassword } from "@hooks/auth/useForgetPassword"
import { useBilling } from "@contexts/payments/billing"

const ConfirmEmailAddress = () => {
    const { handleTimerStart, time, minutes, seconds } = useTimer()
    const [openModal, setOpenModal] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<
        "idle" | "initiating" | "pending" | "success" | "failed"
    >("idle")
    const [userDataAfterVerification, setUserDataAfterVerification] =
        useState<any>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const { dispatch } = useAuth()

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

    const saveUserDataAfterPayment = useCallback(
        (userData: any) => {
            setAccessToken(userData.accessToken || "")

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...userData,
                    hasAgency: !!userData.agency,
                })
            )

            dispatch({
                type: "SET_USER_DATA",
                payload: userData,
            })
        },
        [dispatch]
    )

    // Watch for payment confirmation
    useEffect(() => {
        if (
            hasPaymentMethod &&
            paymentStatus === "pending" &&
            userDataAfterVerification
        ) {
            setPaymentStatus("success")
            stopPolling()

            saveUserDataAfterPayment(userDataAfterVerification)

            showNotification({
                title: "Payment Successful",
                message: "Your payment has been processed successfully!",
                color: "green",
            })

            setOpenModal(true)
        }
    }, [
        hasPaymentMethod,
        paymentStatus,
        userDataAfterVerification,
        stopPolling,
        saveUserDataAfterPayment,
    ])

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
                        message:
                            "You cancelled the payment. Please try again to continue registration.",
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

    const { isPending, mutate } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: async (data) => {
            setUserDataAfterVerification(data.data.data)
            setAccessToken(data.data.data.accessToken || "")

            // Non-talent users or completed registrations can proceed immediately
            if (
                data.data.data.registrationStage === "completed" ||
                data.data.data.userType !== "talent"
            ) {
                saveUserDataAfterPayment(data.data.data)
                setOpenModal(true)
                return
            }

            // For talent users, check payment status
            checkPaymentStatus()

            // Wait for payment status to be retrieved
            setTimeout(() => {
                if (hasPaymentMethod) {
                    saveUserDataAfterPayment(data.data.data)
                    setPaymentStatus("success")
                    setOpenModal(true)
                } else {
                    setPaymentStatus("initiating")
                    initiatePayment({
                        callback_url: `${window.location.origin}/payment-callback`,
                    })
                    setPaymentStatus("pending")
                }
            }, 500)
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

    const retryPayment = async () => {
        // Ensure we have access token for payment APIs
        if (userDataAfterVerification?.accessToken) {
            setAccessToken(userDataAfterVerification.accessToken)
        }

        // Check payment status
        checkPaymentStatus()

        setTimeout(() => {
            if (hasPaymentMethod && userDataAfterVerification) {
                // Payment exists, save user data and show modal
                saveUserDataAfterPayment(userDataAfterVerification)
                setPaymentStatus("success")
                setOpenModal(true)
            } else {
                // Retry payment initiation
                setPaymentStatus("initiating")
                initiatePayment({
                    callback_url: `${window.location.origin}/payment-callback`,
                })
                setPaymentStatus("pending")
            }
        }, 500)
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
            case "initiating":
                return (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm font-medium">
                            Preparing Payment
                        </p>
                        <p className="text-yellow-600 text-sm mt-1">
                            Setting up your payment. Please wait...
                        </p>
                    </div>
                )
            case "pending":
                return (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm font-medium">
                            Payment Required
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                            {isPolling
                                ? "Verifying your payment. Please wait..."
                                : "Please complete your payment in the opened window to proceed."}
                        </p>
                    </div>
                )
            case "failed":
                return (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">
                            Payment Failed
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                            Payment could not be processed. Please try again to
                            continue.
                        </p>
                        <button
                            onClick={retryPayment}
                            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            disabled={isInitiatingPayment}
                        >
                            {isInitiatingPayment
                                ? "Retrying..."
                                : "Retry Payment"}
                        </button>
                    </div>
                )
            case "success":
                return (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">
                            Payment Successful!
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                            Your payment has been processed successfully. You
                            can now create your profile.
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
            case "initiating":
                return "Setting up payment..."
            case "pending":
                return isPolling
                    ? "Verifying payment..."
                    : "Complete payment to continue"
            case "success":
                return "Create Profile"
            case "failed":
                return "Payment required - try again"
            default:
                return isPending ? "Verifying..." : "Verify"
        }
    }

    const isSubmitDisabled = () => {
        if (location.state?.previous === "forgetPassword") {
            return false
        }

        // Disable if currently processing verification, initiating payment, or payment is pending/failed
        return (
            isPending ||
            isInitiatingPayment ||
            paymentStatus === "pending" ||
            paymentStatus === "failed"
        )
    }

    // Cleanup on unmount
    useEffect(() => {
        handleTimerStart()

        return () => {
            if (isPolling) {
                stopPolling()
            }
        }
    }, [isPolling, stopPolling, handleTimerStart])

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
                {paymentStatus !== "idle" && getPaymentStatusMessage()}

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

export default ConfirmEmailAddress
