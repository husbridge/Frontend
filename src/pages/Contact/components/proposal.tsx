import { Button, FormControls, InquirySentModal } from "@components/index"
import { Progress } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { uploadFile } from "@services/storage"
import { useInquirySubmission } from "@hooks/useInquirySubmission"
import { proposalInquiryValidationSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useState } from "react"

const Proposal = ({ id }: { id: string }) => {
    const [opened, setOpened] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const { submit, isPending, isAuthenticatedBuyer } = useInquirySubmission()

    const handleValidation = async (values: any) => {
        console.log(values.attachDocument)
        let uploadedDocumentKey

        if (values.attachDocument) {
            const formData = new FormData()
            formData.append("file", values.attachDocument)
            const { path } = await uploadFile(formData, (percent) =>
                setUploadProgress(percent)
            )

            if (path === null) {
                showNotification({
                    title: "Error",
                    message: "Failed to upload document",
                    color: "red",
                })
                return
            }

            uploadedDocumentKey = path
        }

        console.log(uploadedDocumentKey)
        const inquiry = {
            ...values,
            inquiryType: "proposal",
            talentID: id,
            attachDocument: uploadedDocumentKey,
        }

        submit(inquiry)
    }

    return (
        <>
            <InquirySentModal opened={opened} setOpened={setOpened} />
            <Formik
                initialValues={{
                    fullName: "",
                    alsoKnownAs: "",
                    emailAddress: "",
                    phoneNumber: "",
                    subject: "",
                    description: "",
                    attachDocument: null,
                }}
                validationSchema={proposalInquiryValidationSchema}
                onSubmit={(values) => {
                    handleValidation(values)
                }}
            >
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="Full Name"
                                control="input"
                                name="fullName"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Also known as (optional)"
                                control="input"
                                name="alsoKnowAs"
                                placeholder="what is a popular name you are known as"
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
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Phone Number"
                                control="input"
                                name="phoneNumber"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Subject"
                                control="input"
                                name="subject"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                placeholder="Short title for your inquiry"
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Description"
                                control="textarea"
                                name="description"
                                classNames={{
                                    mainRoot:
                                        " border  border-black-20 px-2 h-[100px]",
                                    input: "text-[#40540A] text-[14px] h-[150px]",
                                }}
                                placeholder="Make your Inquiry"
                            />
                        </div>
                        <div className="mb-6 space-y-1">
                            <FormControls
                                label="Attach document"
                                control="file"
                                name="attachDocument"
                                classNames={{
                                    mainRoot:
                                        "border border-dashed  border-[#CBD5E1] px-2 rounded-3xl",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                placeholder="Upload Png, Jpg or Jpeg of your Valid ID"
                            />
                            {uploadProgress > 0 && (
                                <Progress
                                    value={uploadProgress}
                                    color="yellow"
                                    radius="xl"
                                />
                            )}
                        </div>
                        {!isAuthenticatedBuyer && (
                            <p className="text-black-60 text-sm text-center">
                                *You'll be required to validate your email
                                address
                            </p>
                        )}
                        <Button
                            variant="primary"
                            className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                            type="submit"
                            disabled={isPending}
                        >
                            Send Inquiry
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Proposal
