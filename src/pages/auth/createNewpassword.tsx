import LeftBackground from "./components/leftBackground"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import useShowPassword from "@utils/useShowPassword"
import { resetPassword } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../type/api/index"
import { resetPasswordSchema } from "@utils/validationSchema";
import { useNavigate, useLocation } from "react-router-dom"

const createNewPassword: React.FC = () => {
    const { showPassword, displayPasswordIcon } = useShowPassword()
    const navigate  = useNavigate()
    
    let location = useLocation()
    const { isPending, mutate } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "Password reset successful",
                color: "green",
            })
            navigate("/login")
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data.message || err.message,
                color: "red",
            })
        },
    })

    return (
        <div className="flex ">
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-32  p-6 md:w-[70%] w-full">
                <h3 className="font-semibold text-[28px] sm:text-2lg leading-6">
                    Create New Password
                </h3>
                <p className="text-3md text-black-50 font-normal mt-4 mb-8">
                    Create a new password for your account
                </p>
                <Formik
                    initialValues={{ password: "", confirmPassword: "" }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={(values) =>
                        mutate({
                            code:location.state.otp,
                            emailAddress:location.state.email,
                            newPassword: values.password,
                        })
                    }
                >
                    {() => (
                        <Form className="py-4 mt-4">
                            <div className="mb-6">
                                <FormControls
                                    label="New Password"
                                    control="input"
                                    name="password"
                                    placeholder="enter your new password"
                                    type={showPassword ? "text" : "password"}
                                    suffixIcon={displayPasswordIcon()}
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
                                    label="Confirm Password"
                                    control="input"
                                    name="confirmPassword"
                                    placeholder="enter your password"
                                    type={showPassword ? "text" : "confirmPassword"}
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
                                {isPending ? "Loading..." : "Reset"}
                            </Button>
                        </Form>
                    )}
                </Formik>
                <p className="font-medium text-md text-center justify-center underline text-[#475569] mt-4">
                    <a href="">Forget password?</a>
                </p>
                <p className="text-center text-md mt-44 underline text-[#475569]">
                    <a href="">Don't have an account? Sign Up</a>
                </p>
            </div>
        </div>
    )
}

export default createNewPassword
