import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { FaArrowRight } from "react-icons/fa"
import { talentValidationSchema } from "@utils/validationSchema"
import { createProfile } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import useAuth from "@hooks/auth/useAuth"
import { useNavigate } from "react-router-dom"

const TalentInformation = ({ handleClick }: { handleClick: () => void }) => {
    const { state, dispatch } = useAuth()
    const navigate = useNavigate()
    const { isPending, mutate } = useMutation({
        mutationFn: createProfile,
        onSuccess: ({ data }) => {
            if (state.user) {
                const user = {
                    accessToken: state.user.accessToken,
                    refreshToken: state.user.refreshToken,
                    profilePhotoUrl: state.user.profilePhotoUrl,
                    fullName: data.data.fullName || "",
                    firstName: state.user.firstName,
                    lastName: state.user.lastName,
                    registrationStage: data.data?.registrationStage || "",
                    isVerified: state.user.isVerified,
                    permissions: state.user.permissions,
                    userType: state.user.userType,
                    hasAgency: state.user.hasAgency,
                }
                localStorage.setItem("user", JSON.stringify(user)),
                    dispatch({
                        type: "UPDATE_USER_DATA",
                        payload: {
                            ...state.user,
                            firstName: data.data.firstName || "",
                            lastName: data.data.lastName || "",
                        },
                    })
            }
            handleClick()
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
                <p className="underline text-yellow-100 text-[14px] mr-2 ">
                    Skip for now
                </p>
                <FaArrowRight color="#E8B006" />
            </div>

            <h3 className="font-semibold text-[28px] sm:text-2lg leading-8">
                Talent Information
            </h3>
            <p className="text-black-70 text-3md mt-2">
                Fill your account details below to proceed
            </p>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    stageName: "",
                    industry: "",
                    //bookingPrice: "",
                }}
                validationSchema={talentValidationSchema}
                onSubmit={(values) =>
                    mutate({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        stageName: values.stageName,
                        industry: values.industry,
                    })
                }
            >
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="First Name"
                                control="input"
                                name="firstName"
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
                                label="Last Name"
                                control="input"
                                name="lastName"
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
                                label="Stage Name (optional)"
                                control="input"
                                name="stageName"
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
                                label="Industry"
                                control="input"
                                name="industry"
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
                                label="Booking Price (optional)"
                                control="input"
                                name="bookingPrice"
                                type="number"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div> */}
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

export default TalentInformation
