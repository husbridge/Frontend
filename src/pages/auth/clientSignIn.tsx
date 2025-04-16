import LeftBackground from "./components/leftBackground"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { Link, useLocation,  } from "react-router-dom"
import { useClientSignin } from "@hooks/auth/useSignIn"
import { useEffect } from "react"
import { clientLoginValidationSchema } from "@utils/validationSchema"
import { useNavigate } from "react-router-dom"
import { setAccessToken } from "@services/api.services"
import useAuth from "@hooks/auth/useAuth"

const ClientLogin: React.FC = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuth()
    const location = useLocation();
    const { mutate, isPending, data} = useClientSignin();
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get("redirect_url");

    useEffect(() => {
        if (data) {
            setAccessToken(data.data.data.accessToken || "")
            dispatch({
                type: "SET_USER_DATA",
                payload: {
                    accessToken: data.data.data.accessToken,
                    userType: "client",
                    refreshToken: "",
                    profilePhotoUrl: "",
                    fullName: "",
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
                    accessToken: data.data.data.accessToken,
                    userType: "client",
                })
            )
            navigate(redirectUrl || "/inquiry-management");
         }
    }, [data])
    
    return (
        <div className="flex ">
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-24  p-6 md:w-[70%] w-full">
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg leading-6">
                    Welcome
                </h3>
                <p className="text-3md text-black-50 font-normal mt-4 mb-8">
                    Login to your Husridge client portal
                </p>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={clientLoginValidationSchema}
                    onSubmit={(values) => mutate(values)}
                >
                    {() => (
                        <Form className="py-4 mt-3">
                            <div className="mb-6">
                                <FormControls
                                    label="Email"
                                    control="input"
                                    name="email"
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
                                    type="password"
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
                                {isPending ?"Loading":"Proceed"}
                                
                            </Button>
                        </Form>
                    )}
                </Formik>
                <p className="font-medium text-md text-center mt-8 justify-center underline text-[#475569ca]">
                    <Link to="/login">Not a client?</Link>
                </p>
            </div>
        </div>
    )
}

export default ClientLogin
