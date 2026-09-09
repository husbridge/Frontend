import { Button, FormControls } from "@components/index"
import useTimer from "@hooks/auth/useTimer"
import useAuth from "@hooks/auth/useAuth"
import { useClientSignin } from "@hooks/auth/useSignIn"
import { showNotification } from "@mantine/notifications"
import LeftBackground from "./components/leftBackground"
import { sendPortalOTP, verifyPortalOTP } from "@services/auth"
import { setAccessToken } from "@services/api.services"
import { useMutation } from "@tanstack/react-query"
import { confirmEmailAddressSchema } from "@utils/validationSchema"
import { safeReturnTo } from "@utils/returnTo"
import { Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { type Error } from "type/api"

// Confirms the OTP husridge-server sent during buyer signup, then logs
// the buyer in — signup itself issues no token (see clientSignUp.tsx),
// so this page's job ends with a real session and a landing on the
// pre-filled inquiry (returnTo), not a generic dashboard.
const ConfirmClientSignup = () => {
    const { handleTimerStart, time, minutes, seconds } = useTimer()
    const navigate = useNavigate()
    const location = useLocation()
    const { dispatch } = useAuth()
    const [searchParams] = useSearchParams()
    const returnTo = searchParams.get("redirect_url")

    const pending = location.state as
        | { email: string; password: string; name: string }
        | undefined

    useEffect(() => {
        if (!pending?.email || !pending?.password) {
            showNotification({
                title: "Session expired",
                message: "Please sign up again to continue.",
                color: "red",
            })
            navigate(
                `/client-signup${returnTo ? `?redirect_url=${encodeURIComponent(returnTo)}` : ""}`,
                { replace: true }
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { mutate: login, isPending: isLoggingIn } = useClientSignin()

    const [loginResult, setLoginResult] = useState<{
        accessToken: string
        id: string
    } | null>(null)

    const { isPending, mutate } = useMutation({
        mutationFn: verifyPortalOTP,
        onSuccess: () => {
            if (!pending?.email || !pending?.password) return
            login(
                { email: pending.email, password: pending.password },
                {
                    onSuccess: (res) => {
                        setLoginResult(res.data.data)
                    },
                }
            )
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    useEffect(() => {
        if (!loginResult) return
        setAccessToken(loginResult.accessToken || "")
        dispatch({
            type: "SET_USER_DATA",
            payload: {
                accessToken: loginResult.accessToken,
                id: loginResult.id,
                userType: "client",
                refreshToken: "",
                profilePhotoUrl: "",
                fullName: pending?.name || "",
                firstName: "",
                lastName: "",
                registrationStage: "",
                isVerified: true,
                permissions: [""],
                uniqueUsername: "",
                userStatus: "",
            },
        })
        localStorage.setItem(
            "user",
            JSON.stringify({
                accessToken: loginResult.accessToken,
                id: loginResult.id,
                userType: "client",
            })
        )
        navigate(safeReturnTo(returnTo), { replace: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginResult])

    const { isPending: isResending, mutate: mutateResend } = useMutation({
        mutationFn: sendPortalOTP,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "OTP sent successfully",
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

    const handleResend = () => {
        if (!pending?.email) return
        mutateResend({ email: pending.email, name: pending.name })
        handleTimerStart()
    }

    useEffect(() => {
        handleTimerStart()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex ">
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-32  p-6 md:w-[70%] w-full">
                <MdArrowBack
                    size={28}
                    className="mb-10 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg !leading-10">
                    Verify your email address <br /> to finish creating your
                    account
                </h3>

                <Formik
                    initialValues={{ code: "" }}
                    validationSchema={confirmEmailAddressSchema}
                    onSubmit={(values) => {
                        if (!pending?.email) return
                        mutate({ code: values.code, email: pending.email })
                    }}
                >
                    {() => (
                        <Form className="py-4 mt-4">
                            <div className="mb-6">
                                <FormControls
                                    label="We have sent a 6-digit confirmation code to the email address you signed up with."
                                    control="otp"
                                    name="code"
                                    placeholder="enter code"
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
                                disabled={isPending || isLoggingIn}
                            >
                                Confirm code
                            </Button>
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-base text-[#475569]">
                    Didn't receive any code?{" "}
                    {time <= 0 ? (
                        <button
                            onClick={() => handleResend()}
                            className="inline-flex hover:!text-black"
                        >
                            {isResending ? "Sending..." : "Resend"}
                        </button>
                    ) : (
                        <span className="text-[#47556978] pr-2">
                            Retry in {`${minutes}:${seconds}`}
                        </span>
                    )}
                </p>
            </div>
        </div>
    )
}

export default ConfirmClientSignup
