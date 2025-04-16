import { Modal } from "@mantine/core"
import { FormControls } from "@components/index"
import Close from "@assets/icons/close.svg"
import { Formik, Form } from "formik"

export interface SetReminderModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const SetReminderModal = ({ opened, setOpened }: SetReminderModalProps) => {
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
                    Event Details
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <Formik initialValues={{}} onSubmit={() => {}}>
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="Date"
                                control="date"
                                name="date"
                                placeholder="00/00/00"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-4",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>

                        <div className="mb-6">
                            <FormControls
                                label="Time"
                                control="date"
                                name="time"
                                placeholder="00:00"
                                showTimeSelect
                                showTimeSelectOnly
                                dateFormat="h:mm aa"
                                timeCaption="Time"
                                //type={showPassword ? "text" : "password"}
                                //suffixIcon={displayPasswordIcon()}
                                classNames={{
                                    mainRoot: " border  border-black-20 px-4",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                            />
                        </div>

                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default SetReminderModal
