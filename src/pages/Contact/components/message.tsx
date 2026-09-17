import { Button, FormControls, InquirySentModal, LoadingState } from "@components/index"
import { useInquirySubmission } from "@hooks/useInquirySubmission"
import { useBuyerPrefill } from "@hooks/useBuyerPrefill"
import { messageInquiryValidationSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useState } from "react"

// Deliberately the lightest of the four tabs — a general "just want to ask
// something" contact, not a booking request. Was previously not a real
// inquiry type at all: Website's "Message" CTA (inquiryStart.tsx) mapped
// it onto Collaboration, a 3-step form with event date + document upload —
// the wrong shape for a simple message. Replaced with a real "message"
// inquiryType (PortalController.ts) and this dedicated, minimal form.
const Message = ({ id }: { id: string }) => {
    const [opened, setOpened] = useState(false)
    const { submit, isPending, isAuthenticatedBuyer } = useInquirySubmission()
    const { prefill, isLoading: isPrefillLoading } = useBuyerPrefill()

    if (isPrefillLoading) return <LoadingState />

    return (
        <>
            <InquirySentModal opened={opened} setOpened={setOpened} />
            <Formik
                initialValues={{
                    fullName: prefill?.fullName || "",
                    emailAddress: prefill?.emailAddress || "",
                    description: "",
                }}
                validationSchema={messageInquiryValidationSchema}
                onSubmit={(values) => {
                    submit({
                        ...values,
                        inquiryType: "message",
                        talentID: id,
                    })
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
                                label="Message"
                                control="textarea"
                                name="description"
                                classNames={{
                                    mainRoot:
                                        " border  border-black-20 px-2 h-[100px]",
                                    input: "text-[#40540A] text-[14px] h-[150px]",
                                }}
                                placeholder="What would you like to ask?"
                            />
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
                            Send Message
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default Message
