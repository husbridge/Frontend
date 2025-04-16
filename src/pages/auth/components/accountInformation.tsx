import { FormControls, Button } from "@components/index"
import useShowPassword from "@utils/useShowPassword"
import { Formik, Form } from "formik"
import { accountValidationSchema } from "@utils/validationSchema"
import { signup } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router-dom"
import { type Error } from "../../../type/api/index"
import useAuth from "@hooks/auth/useAuth"

const AccountInformation = ({
    userType,
}: {
    userType: "admin" | "manager" | "talent"|"agency"
}) => {
    const { showPassword, displayPasswordIcon } = useShowPassword()
    const { showPassword: showPassword2, displayPasswordIcon:displayPasswordIcon2 } = useShowPassword()
    const navigate = useNavigate()
    const { state } = useAuth()
    const { isPending, mutate, variables } = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            navigate("/confirm-email-address", {state:{email: variables?.emailAddress}});
            showNotification({
                title: "Success",
                message: data.data.message,
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

    
        if(state.isAuthenticated){
            navigate("/dashboard")
            return;
        }
    
    return (
        <div className="mt-20 mb-4">
            <h3 className="font-semibold leading-8 text-[28px] sm:text-2lg">
                Account Information
            </h3>
            <p className="text-black-70 text-3md mt-2">
                Fill your account details below to proceed
            </p>
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                    confirmPassword: "",
                   
                }}
                validationSchema={accountValidationSchema}
                onSubmit={(values) =>
                    mutate({
                        emailAddress: values.email,
                        password: values.password,
                        userType: userType,
                    })
                }
            >
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6 mt-4">
                            <FormControls
                                label="Email"
                                control="input"
                                name="email"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
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
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Confirm password"
                                control="input"
                                name="confirmPassword"
                                //placeholder="enter your password"
                                type={showPassword2 ? "text" : "password"}
                                suffixIcon={displayPasswordIcon2()}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
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
                            {isPending ? "Loading..." : "Proceed"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AccountInformation
