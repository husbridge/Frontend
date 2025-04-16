import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import { createManager } from "@services/manager"
import { addManagerValidationSchema } from "@utils/validationSchema"

export interface AddEventModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const AddManager = ({ opened, setOpened }: AddEventModalProps) => {
    const queryClient = useQueryClient()
    
    const { isPending, mutate,  } = useMutation({
        mutationFn: createManager,
        onSuccess: (data ) => {
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })
            setOpened(false)
            queryClient
                .invalidateQueries({
                    queryKey: ["managers"],
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
                Add Manager
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <Formik initialValues={{
                fullName:"",
                emailAddress:"",
                phoneNumber:"",
                gender:"male",
            }}
            validationSchema={addManagerValidationSchema} 
            onSubmit={(values)=>mutate(values)}>
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="Full Name"
                                control="input"
                                name="fullName"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
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
                                    input: "text-[#40540A] text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Mobile Number"
                                control="input"
                                name="phoneNumber"
                                //placeholder="enter your password"
                                
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Gender"
                                control="select"
                                name="gender"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </FormControls>
                        </div>
                        
                        <Button
                            variant="primary"
                            className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending? "Adding...":"Add Manager"}
                            
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AddManager
