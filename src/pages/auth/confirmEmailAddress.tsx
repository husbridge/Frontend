import { AccountCreatedModal, Button, FormControls } from "@components/index"
import useAuth from "@hooks/auth/useAuth"
import { useForgetPassword } from "@hooks/auth/useForgetPassword"
import useTimer from "@hooks/auth/useTimer"
import { showNotification } from "@mantine/notifications"
import { setAccessToken } from "@services/api.services"
import { resendOTP, verifyOTP } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { confirmEmailAddressSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useCallback, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { type Error } from "../../type/api/index"
import LeftBackground from "./components/leftBackground"

const ConfirmEmailAddress = () => {
    const { handleTimerStart, time, minutes, seconds } = useTimer()
    const [openModal, setOpenModal] = useState(false)

    const [userDataAfterVerification, setUserDataAfterVerification] =
        useState<any>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const { dispatch } = useAuth()

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

    const { isPending, mutate } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: async (data) => {
            setUserDataAfterVerification(data.data.data)
            setAccessToken(data.data.data.accessToken || "")

            saveUserDataAfterPayment(data.data.data)
            if (data.data.data.registrationStage === "completed") {
                setOpenModal(true)
                return
            }
            navigate("/login")
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

    // const retryPayment = async () => {
    //     // Ensure we have access token for payment APIs
    //     if (userDataAfterVerification?.accessToken) {
    //         setAccessToken(userDataAfterVerification.accessToken)
    //     }

    //     // Check payment status
    //     // checkPaymentStatus()

    //     setTimeout(() => {
    //         if (hasPaymentMethod && userDataAfterVerification) {
    //             // Payment exists, save user data and show modal
    //             saveUserDataAfterPayment(userDataAfterVerification)
    //             setPaymentStatus("success")
    //             setOpenModal(true)
    //         } else {
    //             // Retry payment initiation
    //             setPaymentStatus("initiating")
    //             initiatePayment({
    //                 callback_url: `${window.location.origin}/payment-callback`,
    //             })
    //             setPaymentStatus("pending")
    //         }
    //     }, 500)
    // }

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

    const getSubmitButtonText = () => {
        if (location.state?.previous === "forgetPassword") {
            return "Confirm code"
        }
        return isPending ? "Verifying..." : "Verify"
    }

    const isSubmitDisabled = () => {
        if (location.state?.previous === "forgetPassword") {
            return false
        }

        // Disable if currently processing verification, initiating payment, or payment is pending/failed
        return isPending
        // ||
        // isInitiatingPayment ||
        // paymentStatus === "pending" ||
        // paymentStatus === "failed"
    }

    // Cleanup on unmount
    // useEffect(() => {
    //     handleTimerStart()

    //     return () => {
    //         if (isPolling) {
    //             stopPolling()
    //         }
    //     }
    // }, [isPolling, stopPolling, handleTimerStart])

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
                {/* {paymentStatus !== "idle" && getPaymentStatusMessage()} */}

                <Formik
                    initialValues={{
                        code: "",
                    }}
                    validationSchema={confirmEmailAddressSchema}
                    onSubmit={(values) => {
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
                                    label="We have sent a 6-digit confirmation OTP to the email address that you provided."
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
                    Didn&apos;t receive code?{" "}
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
