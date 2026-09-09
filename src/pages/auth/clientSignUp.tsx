import LeftBackground from "./components/leftBackground"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useClientSignup } from "@hooks/auth/useSignIn"
import { useEffect, useRef } from "react"
import { clientSignupValidationSchema } from "@utils/validationSchema"
import { safeReturnTo } from "@utils/returnTo"
import useAuth from "@hooks/auth/useAuth"

// Buyer self-signup — reached from husridge.com/t/:uniqueName's Book/
// Message CTAs via /inquiry/start, which appends ?redirect_url=... pointing
// back at the pre-filled inquiry the buyer was trying to send. Signup
// itself doesn't log the buyer in (husridge-server only stages the
// account and emails an OTP) — /confirm-client-signup does that once the
// code is confirmed.
const ClientSignUp: React.FC = () => {
    const navigate = useNavigate()
    const { state } = useAuth()
    const [searchParams] = useSearchParams()
    const returnTo = searchParams.get("redirect_url")
    const { mutate, isPending, data } = useClientSignup()

    // Formik's onSubmit gives us the values at submit time; the
    // mutation's onSuccess only gets the response back. Stash what the
    // next page needs (password to log in with, once OTP confirms) in a
    // ref rather than round-tripping it through the URL.
    const pendingPassword = useRef("")
    const pendingName = useRef("")

    // Direct navigation while already logged in (e.g. an open tab) —
    // skip signup entirely rather than showing the form.
    useEffect(() => {
        if (state.isAuthenticated) {
            navigate(safeReturnTo(returnTo), { replace: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isAuthenticated])

    useEffect(() => {
        if (data?.data.data) {
            const { email } = data.data.data
            navigate(
                `/confirm-client-signup${returnTo ? `?redirect_url=${encodeURIComponent(returnTo)}` : ""}`,
                {
                    state: {
                        email,
                        password: pendingPassword.current,
                        name: pendingName.current,
                    },
                }
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div className="flex ">
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-24  p-6 md:w-[70%] w-full">
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg leading-6">
                    Create your account
                </h3>
                <p className="text-3md text-black-50 font-normal mt-4 mb-8">
                    Sign up to send a booking or message
                </p>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        organisationName: "",
                        phone: "",
                    }}
                    validationSchema={clientSignupValidationSchema}
                    onSubmit={(values) => {
                        pendingPassword.current = values.password
                        pendingName.current = values.name
                        mutate({
                            name: values.name,
                            email: values.email,
                            password: values.password,
                            organisationName: values.organisationName || undefined,
                            phone: values.phone || undefined,
                        })
                    }}
                >
                    {() => (
                        <Form className="py-4 mt-3">
                            <div className="mb-6">
                                <FormControls
                                    label="Full name"
                                    control="input"
                                    name="name"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2 w-full",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>
                            <div className="mb-6">
                                <FormControls
                                    label="Email"
                                    control="input"
                                    name="email"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2 w-full",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>
                            <div className="mb-6">
                                <FormControls
                                    label="Password"
                                    control="input"
                                    name="password"
                                    type="password"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2 w-full",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>
                            <div className="mb-6">
                                <FormControls
                                    label="Organisation (optional)"
                                    control="input"
                                    name="organisationName"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2 w-full",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>
                            <div className="mb-6">
                                <FormControls
                                    label="Phone (optional)"
                                    control="input"
                                    name="phone"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2 w-full",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>
                            <Button
                                variant="primary"
                                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Creating account..." : "Sign up"}
                            </Button>
                        </Form>
                    )}
                </Formik>
                <p className="font-medium text-md text-center mt-8 justify-center underline text-[#475569ca]">
                    <Link
                        to={`/client-login${returnTo ? `?redirect_url=${encodeURIComponent(returnTo)}` : ""}`}
                    >
                        Already have an account? Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default ClientSignUp
