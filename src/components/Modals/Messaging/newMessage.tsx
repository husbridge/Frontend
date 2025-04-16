import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { useRef, useState } from "react"
import { MdAttachFile, MdClose } from "react-icons/md"
import { ChangeEvent } from "react"

export interface NewMessageModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const NewMessageModal = ({ opened, setOpened }: NewMessageModalProps) => {
    const ref = useRef<HTMLInputElement | null>(null)
    const [fileName, setFileName] = useState("")

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setFileName(file.name)

            //setFieldValue("image", file)
        }
    }
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
                    New Message
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
                                label="Enter E-mail"
                                control="input"
                                name="email"
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
                                label="Subject"
                                control="input"
                                name="subject"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>
                        <div className="border border-[#0000001A] rounded-[8px] p-2">
                            <textarea
                                name=""
                                id=""
                                rows={4}
                                className="outline-none"
                            />
                            {fileName && (
                                <div className="flex bg-[#F7F7F7] p-2 items-between w-fit">
                                    <p>{fileName}</p>{" "}
                                    <MdClose
                                        size={22}
                                        className="ml-2 cursor-pointer"
                                        onClick={() => setFileName("")}
                                    />
                                </div>
                            )}
                            <div className="flex justify-end items-between">
                                <div
                                    className="flex items-center mt-2 cursor-pointer"
                                    onClick={() => {
                                        ref.current?.click()
                                    }}
                                >
                                    <MdAttachFile size={24} color="#000000" />
                                    <input
                                        data-testid="file-upload"
                                        // ref={fileInputRef}
                                        type="file"
                                        hidden
                                        onChange={handleUpload}
                                        ref={ref}
                                    />
                                </div>

                                <Button
                                    variant="primary"
                                    className="!text-md ml-4"
                                >
                                    Send
                                </Button>
                            </div>
                        </div>

                        
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}
export default NewMessageModal
