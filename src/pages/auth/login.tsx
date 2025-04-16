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
    const { mutate, isPending, data, variables} = useSignin()

    useEffect(() => {
        if (data?.data.data === null) {
            navigate("/confirm-email-address", {state:{email: variables?.username}})
            return
         }
        // if (data) {
        //     navigate("/dashboard")
        //     return
        // }
         
    }, [data])
    const { showPassword, displayPasswordIcon } = useShowPassword()
    
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
                    <Formik
                        initialValues={{
                            username: "",
                            password: "",
                        }}
                        validationSchema={loginValidationSchema}
                        onSubmit={(values) => mutate(values)}
                    >
                        {() => (
                            <Form className="py-4 mt-3">
                                <div className="mb-6">
                                    <FormControls
                                        label="Email"
                                        control="input"
                                        name="username"
                                        //placeholder="enter your email address"
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
                                        //placeholder="enter your password"
                                        type={showPassword ? "text" : "password"}
                                        suffixIcon={displayPasswordIcon()}
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
                                    disabled={isPending}
                                >
                                    {isPending ?"Loading":"Proceed"}
                                    
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
