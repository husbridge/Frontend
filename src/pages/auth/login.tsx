import LeftBackground from "./components/leftBackground"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { Link, useNavigate } from "react-router-dom"
import { useSignin } from "@hooks/auth/useSignIn"
import { useEffect } from "react"
import { loginValidationSchema } from "@utils/validationSchema"
import useShowPassword from "@utils/useShowPassword"

const Login: React.FC = () => {
    const navigate = useNavigate()
    const {
        mutate,
        isPending,
        data,
        variables,
        paymentStatus,
        authorizationUrl,
        isInitiatingPayment,
        retryPayment
    } = useSignin()
    const { showPassword, displayPasswordIcon } = useShowPassword()

    useEffect(() => {
        if (data?.data.data === null) {
            navigate("/confirm-email-address", { state: { email: variables?.username } })
            return
        }
    }, [data])

    const getPaymentStatusMessage = () => {
        switch (paymentStatus) {
            case 'pending':
                return (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-700 text-sm font-medium">
                            Payment Method Required
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                            Please add your payment method in the opened window to complete login.
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
                            Payment Setup Failed
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                            Could not set up payment method. Please try again to complete login.
                        </p>
                        <button
                            onClick={retryPayment}
                            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            disabled={isInitiatingPayment}
                        >
                            {isInitiatingPayment ? 'Retrying...' : 'Retry Payment Setup'}
                        </button>
                    </div>
                )
            case 'success':
                return (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">
                            Payment Method Added Successfully!
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                            Redirecting to dashboard...
                        </p>
                    </div>
                )
            default:
                return null
        }
    }

    const getSubmitButtonText = () => {
        switch (paymentStatus) {
            case 'initiating':
                return 'Setting up Payment...'
            case 'pending':
                return 'Waiting for Payment Setup...'
            case 'success':
                return 'Login Successful'
            case 'failed':
                return 'Payment Required'
            default:
                return isPending ? "Loading" : "Proceed"
        }
    }

    const isSubmitDisabled = () => {
        return isPending || isInitiatingPayment || paymentStatus === 'pending' || paymentStatus === 'success'
    }

    return (
        <div className="flex h-scre">
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-24 flex justify-center p-6 md:w-[70%] w-full">
                <div className="max-w-4xl w-full ">
                    <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg leading-6">
                        Welcome back
                    </h3>
                    <p className="text-3md text-black-50 font-normal mt-4 mb-8">
                        Login to your Husridge account
                    </p>

                    {/* Payment Status Message */}
                    {paymentStatus !== 'idle' && getPaymentStatusMessage()}

                    <Formik
                        initialValues={{
                            username: "",
                            password: "",
                        }}
                        validationSchema={loginValidationSchema}
                        onSubmit={(values) => {
                            mutate(values)
                        }}
                    >
                        {() => (
                            <Form className="py-4 mt-3">
                                <div className="mb-6">
                                    <FormControls
                                        label="Email"
                                        control="input"
                                        name="username"
                                        disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
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
                                        type={showPassword ? "text" : "password"}
                                        suffixIcon={displayPasswordIcon()}
                                        disabled={paymentStatus === 'pending' || paymentStatus === 'success'}
                                        classNames={{
                                            mainRoot:
                                                " border  border-black-20 px-2",
                                            input: "text-black-100 text-[14px]",
                                        }}
                                    />
                                </div>

                                <Button
                                    variant="primary"
                                    className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                    type="submit"
                                    disabled={isSubmitDisabled()}
                                >
                                    {getSubmitButtonText()}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <div className="font-medium text-md text-center flex justify-between underline text-[#475569] mt-4 ">
                        <Link to="/forget-password">Forget password?</Link>
                        <Link to="/client-login">Client login</Link>
                    </div>
                    <p className="text-center text-md mt-28 text-[#475569]">
                        Don't have an account? {" "}
                        <Link to="/welcome" className="underline font-semibold">Sign Up!</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login