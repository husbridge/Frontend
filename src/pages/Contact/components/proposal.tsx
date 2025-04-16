import { FormControls, Button, InquirySentModal } from "@components/index"
import { Formik, Form } from "formik"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { proposalInquiryValidationSchema } from "@utils/validationSchema"
import { showNotification } from "@mantine/notifications"
import { sendPortalOTP } from "@services/auth"
import { useNavigate } from "react-router-dom"
import { useInquiryStore } from "@hooks/useInquiry"

const Proposal = ({ id }: { id: string }) => {
    const [opened, setOpened] = useState(false)
    const navigate = useNavigate()
    const setDocument = useInquiryStore((state) => state.setDocument)

    const onSendOtp = useMutation({
        mutationFn: sendPortalOTP,
        onSuccess: () => {
            navigate("/confirm-inquiry")
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message:
                    err.message ||
                    "Something went wrong, please try again later",
                color: "red",
            })
        },
    })

    const handleValidation = (values: any) => {
        if (values.document) setDocument(values.document)
        const inquiry = {
            ...values,
            inquiryType: "proposal",
            talentID: id,
        }
        sessionStorage.setItem("inquiry", JSON.stringify(inquiry))

        onSendOtp.mutate({
            email: values.emailAddress,
            name: values.fullName,
        })
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
                        <div className="mb-6">
                            <FormControls
                                label="Attach document"
                                control="file"
                                name="document"
                                classNames={{
                                    mainRoot:
                                        "border border-dashed  border-[#CBD5E1] px-2 rounded-3xl",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                placeholder="Upload Png, Jpg or Jpeg of your Valid ID"
                            />
                        </div>
                        <p className="text-black-60 text-sm text-center">
                            *You'll be required to validate your email address
                        </p>
                        <Button
                            variant="primary"
                            className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                            type="submit"
                            disabled={onSendOtp.isPending}
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
