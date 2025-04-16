import LeftBackground from "./components/leftBackground"
import { FormControls, Button, AccountCreatedModal } from "@components/index"
import { Formik, Form } from "formik"
import { useNavigate, useLocation } from "react-router-dom"
import { MdArrowBack } from "react-icons/md"
import { useState, useEffect } from "react"
import { verifyOTP, resendOTP } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../type/api/index"
import { confirmEmailAddressSchema } from "@utils/validationSchema"
import useAuth from "@hooks/auth/useAuth"
import { setAccessToken } from "@services/api.services"
import useTimer from "@hooks/auth/useTimer"
import { useForgetPassword } from "@hooks/auth/useForgetPassword"

const ConfirmEmailAddress = () => {
    const { handleTimerStart, time, minutes, seconds } = useTimer()
    const [openModal, setOpenModal] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()


    const { dispatch } = useAuth()
    const { isPending, mutate, data } = useMutation({
        mutationFn: verifyOTP,
        onSuccess: (data) => {
            setAccessToken(data.data.data.accessToken || "")
            localStorage.setItem("user", JSON.stringify({
                ...data.data.data,
                hasAgency: !!data.data.data.agency
            })),
                dispatch({
                    type: "SET_USER_DATA",
                    payload: data.data.data,
                })
            if (data.data.data.registrationStage === "completed") {
                navigate("/dashboard")
            } else {
                setOpenModal(true)
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

    const handleResend = () => {
        if (location.state?.previous === "forgetPassword") {
            mutateForgetPassword({ username: location.state.email })
        } else {
            mutateResend({ username: location.state.email })
        }

        handleTimerStart()
    }
    useEffect(() => {
        handleTimerStart()
    }, [])

    return (
        <div className="flex ">
            <AccountCreatedModal
                opened={openModal}
                handleNavigate={() => {
                    data?.data.data.userType === "agency"
                        ? navigate("/agency-signup", { state: { key: 1 } })
                        : data?.data.data.userType === "manager"
                          ? navigate("/manager-signup", { state: { key: 1 } })
                          : navigate("/talent-signup", { state: { key: 1 } })
                }}
            />
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-32  p-6 md:w-[70%] w-full">
                <MdArrowBack
                    size={28}
                    className="mb-10 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg leading-6">
                    Confirm Email Address
                </h3>

                <Formik
                    initialValues={{
                        code: "",
                        //username:""
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
                        }
                         else {
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
                                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                type="submit"
                                disabled={isPending}
                            >
                                {location.state?.previous === "forgetPassword"
                                    ? "Confirm code"
                                    : isPending
                                      ? "Creating..."
                                      : "Create Profile"}
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
