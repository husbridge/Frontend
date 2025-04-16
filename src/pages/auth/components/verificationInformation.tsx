import { FormControls, Button } from "@components/index"
import { FaArrowRight } from "react-icons/fa"
import { Formik, Form } from "formik"
import { verificationValidationSchema } from "@utils/validationSchema"
import { createProfile } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import { useNavigate } from "react-router-dom"
import useAuth from "@hooks/auth/useAuth"
import config from "../../../config"
import { useState } from "react"

const VerificationInformation = () => {
    const { state, dispatch } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { isPending, mutate } = useMutation({
        mutationFn: createProfile,
        onSuccess: ({data}) => {
            if (state.user){
                const user={ accessToken: state.user.accessToken,
                    refreshToken: state.user.refreshToken,
                    profilePhotoUrl: state.user.profilePhotoUrl,
                    fullName: state.user.fullName,
                    firstName: state.user.firstName,
                    lastName: state.user.lastName,
                    registrationStage: data.data?.registrationStage||"",
                    isVerified:state.user.isVerified,
                    permissions: state.user.permissions,
                    userType: state.user.userType,
                    uniqueUsername:state.user.uniqueUsername,
                    userStatus: state.user.userStatus
                }
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                ),
                    state.user &&
                        dispatch({
                            type: "UPDATE_USER_DATA",
                            payload: user
                        })
            }

            window.location.href = `https://identity.dojah.io/?widget_id=${config.dojahWidgetId}&metadata[user_id]=${data.data._id}`
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })
    return (
        <div className="mt-14 mb-4">
            <div
                className="mb-4 flex items-center cursor-pointer"
                onClick={() => navigate("/dashboard")}
            >
                <p className="underline text-yellow-100 text-[14px] mr-2">
                    Skip for now
                </p>
                <FaArrowRight color="#E8B006" />
            </div>

            <h3 className="font-semibold text-[28px] sm:text-2lg leading-8">
                Personal Information
            </h3>
            <p className="text-black-70 text-3md mt-2">
                Verify your phone number & identity below to proceed
            </p>
            <Formik
                initialValues={{
                    mobileNumber: "",
                }}
                validationSchema={verificationValidationSchema}
                onSubmit={(values) =>{
                    setLoading(true)
                    mutate({
                        phoneNumber: values.mobileNumber,
                    })
                }
                }
            >
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="Mobile Number"
                                control="input"
                                name="mobileNumber"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>
                        {/* <div className="mb-6">
                            <FormControls
                                label="Verification Type"
                                control="select"
                                name="verificationType"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            >
                                <option value="BVN">BVN Verification</option>
                                <option value="NIN">NIN Verification</option>
                            </FormControls>
                        </div>
                        <div className="mb-4">
                            <FormControls
                                label=""
                                control="input"
                                type="number"
                                name="verificationValue"
                                placeholder={`Enter your ${values.verificationType === "BVN" ? "10-digit BVN" : "11-digit NIN"} code here`}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div> */}
                        <Button
                            variant="primary"
                            className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                            type="submit"
                            disabled={isPending || loading}
                        >
                            {(isPending || loading) ? "Loading..." : "Verify ID"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default VerificationInformation
