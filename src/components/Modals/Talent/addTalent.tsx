import Close from "@assets/icons/close.svg"
import { Button, FormControls } from "@components/index"
import { Modal, Select } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { fetchManagers } from "@services/manager"
import { createTalent } from "@services/talents"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addTalentValidationSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useState } from "react"
import { type Error } from "../../../type/api/index"

export interface AddTalentModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

type ManagerType = {
    _id: string
    fullName: string
}

const AddTalent = ({ opened, setOpened }: AddTalentModalProps) => {
    const queryClient = useQueryClient()
    const [selectedManager, setSelectedManager] = useState<ManagerType>()

    const { isPending, mutate } = useMutation({
        mutationFn: createTalent,
        onSuccess: (data) => {
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })
            setOpened(false)
            queryClient
                .invalidateQueries({
                    queryKey: ["talents"],
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

    const teamQuery = useQuery({
        queryKey: ["managers"],
        queryFn: () => fetchManagers(),
    })

    const managers: ManagerType[] = teamQuery.data?.data || []

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Add Talent
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
                    firstName: "",
                    lastName: "",
                    stageName: "",
                    emailAddress: "",
                    phoneNumber: "",
                    gender: "",
                    industry: "",
                }}
                validationSchema={addTalentValidationSchema}
                onSubmit={(values) =>
                    mutate({
                        ...values,
                        manager: selectedManager?._id,
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
                                //placeholder="enter your password"

                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Email"
                                control="input"
                                name="emailAddress"
                                //placeholder="enter your password"

                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Mobile Number"
                                control="input"
                                name="phoneNumber"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <Select
                                label="Manager"
                                data={managers.map((manager) => ({
                                    value: manager._id,
                                    label: manager.fullName,
                                }))}
                                placeholder="Search managers"
                                searchable
                                styles={{
                                    input: {
                                        borderRadius: "80px",
                                        padding: "16px",
                                        height: "50px",
                                        marginTop: "10px",
                                    },
                                    label: {
                                        fontSize: "15px",
                                    },
                                }}
                                value={selectedManager?._id || null}
                                onChange={(value) => {
                                    const selected = managers.find(
                                        (manager) => manager._id === value
                                    )
                                    setSelectedManager(selected || undefined)
                                }}
                                clearable
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Gender"
                                control="select"
                                name="gender"
                                placeholder="Select Gender"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </FormControls>
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Industry"
                                control="input"
                                name="industry"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
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
                            {isPending ? "Adding..." : "Add Talent"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AddTalent
