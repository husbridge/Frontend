import { Button, FormControls, InquirySentModal, LoadingState } from "@components/index"
import { Progress } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { uploadFile } from "@services/storage"
import { useInquirySubmission } from "@hooks/useInquirySubmission"
import { useBuyerPrefill } from "@hooks/useBuyerPrefill"
import { proposalInquiryValidationSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useState } from "react"
import { darkInput, darkTextarea, darkLabel } from "../darkTheme"

const Proposal = ({ id }: { id: string }) => {
    const [opened, setOpened] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const { submit, isPending, isAuthenticatedBuyer } = useInquirySubmission()
    const { prefill, isLoading: isPrefillLoading } = useBuyerPrefill()

    if (isPrefillLoading) return <LoadingState />

    const handleValidation = async (values: any) => {
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
                    fullName: prefill?.fullName || "",
                    alsoKnownAs: "",
                    emailAddress: prefill?.emailAddress || "",
                    phoneNumber: prefill?.phoneNumber || "",
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
                                classNames={darkInput}
                                labelClassName={darkLabel}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Also known as (optional)"
                                control="input"
                                name="alsoKnowAs"
                                placeholder="what is a popular name you are known as"
                                classNames={darkInput}
                                labelClassName={darkLabel}
                            />
                        </div>

                        <div className="mb-6">
                            <FormControls
                                label="Email"
                                control="input"
                                name="emailAddress"
                                classNames={darkInput}
                                labelClassName={darkLabel}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Phone Number"
                                control="input"
                                name="phoneNumber"
                                classNames={darkInput}
                                labelClassName={darkLabel}
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Subject"
                                control="input"
                                name="subject"
                                classNames={darkInput}
                                labelClassName={darkLabel}
                                placeholder="Short title for your inquiry"
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Description"
                                control="textarea"
                                name="description"
                                classNames={{
                                    wrapper: `${darkTextarea.wrapper} h-[100px]`,
                                    input: darkTextarea.input,
                                }}
                                labelClassName={darkLabel}
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
                                        "border border-dashed !border-white/20 !bg-white/5 px-2 rounded-3xl",
                                    input: "!text-white/40",
                                }}
                                labelClassName={darkLabel}
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
                            <p className="text-white/50 text-sm text-center">
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
