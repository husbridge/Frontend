import Close from "@assets/icons/close.svg"
import { Formik, Form } from "formik"
import { FormControls, Button } from "@components/index"
import { Data } from "../../../../type/api/manager.types"
import { editTalent } from "@services/talents"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../../type/api/index"

interface TalentInformationInterface {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    handleClick: () => void
    data?: Data
}
const TalentInformation = ({
    setOpened,
    handleClick,
    data,
}: TalentInformationInterface) => {
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: editTalent,
        onSuccess: (data) => {
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })

            queryClient
                .invalidateQueries({
                    queryKey: ["talents"],
                })
                .finally(() => false)
            queryClient
                .invalidateQueries({
                    queryKey: ["singleUser"],
                })
                .finally(() => false)
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
        <div>
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Talent information
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <Formik
                initialValues={{
                    firstName: data?.firstName || "",
                    lastName: data?.lastName || "",
                    stageName: data?.stageName || "",
                    email: data?.emailAddress || "",
                    industry: data?.industry || "",
                }}
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
                                label="Stage Name"
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
                                label="Email"
                                control="input"
                                name="email"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                                disabled
                            />
                        </div>
                        {/* <div className="mb-6">
                            <FormControls
                                label="Booking Price (optional)"
                                control="input"
                                name="bookingPrice"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                                suffixIcon={
                                    <select className="bg-[#F7F7F7] mr-2 border-l">
                                        <option>USD</option>
                                    </select>
                                }
                            />
                        </div> */}

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
                        <div className="flex gap-6">
                            <Button
                                variant="clear"
                                className="px-6 border-[#CCCCCC]  w-full rounded-[40px] mt-10"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Editing..." : "Edit"}
                            </Button>
                            <Button
                                variant="primary"
                                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                type="button"
                                onClick={handleClick}
                            >
                                Proceed
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default TalentInformation
