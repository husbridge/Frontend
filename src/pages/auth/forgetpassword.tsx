import LeftBackground from "./components/leftBackground"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { useMutation } from "@tanstack/react-query"
import { requestForgotPassword } from "@services/auth"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../type/api/index"
import { forgotPasswordValidationSchema } from "@utils/validationSchema"
import { useNavigate } from "react-router"

const ForgetPassword= () => {
    const navigate= useNavigate()
    const { isPending, mutate, variables } = useMutation({
        mutationFn: requestForgotPassword,
        onSuccess: (data) => {
            navigate("/confirm-email-address", {state:{email: variables?.username, previous:"forgetPassword"}})
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })
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
            <div className="md:block hidden">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:py-2 md:py-2 sm:p-20  md:pt-32 p-6 md:w-[70%] w-full">
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg leading-6">
                    Reset Password
                </h3>
                <p className="text-3md text-black-50 font-normal mt-4 mb-8">
                    Enter your account E-mail to set a new password
                </p>
                <Formik
                    initialValues={{
                        username: "",
                    }}
                    validationSchema={forgotPasswordValidationSchema}
                    onSubmit={(values) => {
                        mutate(values)
                    }}
                >
                    {() => (
                        <Form className="py-4 mt-4">
                            <div className="mb-6">
                                <FormControls
                                    label="Email"
                                    control="input"
                                    name="username"
                                    //placeholder="enter your email address"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>

                            <Button
                                variant="primary"
                                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                type="submit"
                            >
                                {isPending ? "Sending..." : "Send Link"}
                            </Button>
                        </Form>
                    )}
                </Formik>

                <p className="font-medium text-md text-center justify-center underline text-[#475569] mt-4 ">
                    <a href="/forget-password">Forget password?</a>
                </p>

                <p className="text-center text-md sm:mt-40 mt-52 underline  text-[#475569] ">
                    <a href="/welcome">Dont have an account? Sign Up</a>
                </p>
            </div>
        </div>
    )
}

export default ForgetPassword;
