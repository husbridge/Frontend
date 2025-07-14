import BookingDetails from "./bookingDetails"
import BookingPersonalInformation from "./bookingPersonalInformation"
import BookingEventInformation from "./bookingEventInformation"
import BookingSummary from "./bookingSummary"
import { Button, InquirySentModal } from "@components/index"
import { Formik, Form } from "formik"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import {
    bookingPersonalValidationSchema,
    bookingEventValidationSchema,
    bookingDetailsValidationSchema,
} from "@utils/validationSchema"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router-dom"
import { sendPortalOTP } from "@services/auth"
import { useInquiryStore } from "@hooks/useInquiry";
import { uploadFile } from "@services/storage"

const Collaboration = ({ id }: { id: string }) => {
    const [step, setStep] = useState(1)
    const [opened, setOpened] = useState(false)
    const navigate = useNavigate()
    const document = useInquiryStore((state) => state.document);

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

    const handleValidation = async (values: any) => {
        let uploadedDocumentKey = "";

        if (document) {
            const formData = new FormData();
            formData.append('file', document);
            const { path } = await uploadFile(formData);

            if (path === null) {
                showNotification({
                    title: 'Error',
                    message: 'Failed to upload document',
                    color: 'red'
                });
                return;
            }

            uploadedDocumentKey = path;
        }

        const inquiry = {
            fullName: values.fullName,
            description: values.description,
            emailAddress: values.emailAddress,
            eventDate: values.eventDate.map((item: any) => ({
                date: item.date,
                eventCountry: (
                    item.eventCountry as { label: string; value: string }
                ).label,
                eventCity: item.eventCity,
                eventVenue: item.eventVenue,
                eventStartTime: item.eventStartTime,
                eventEndTime: item.eventEndTime,
            })),
            eventTitle: values.eventTitle,
            phoneNumber: values.phoneNumber,
            subject: values.subject,
            inquiryType: "collaboration",
            talentID: id,
            attachDocument: uploadedDocumentKey
        }

        sessionStorage.setItem("inquiry", JSON.stringify(inquiry))

        onSendOtp.mutate({
            email: values.emailAddress,
            name: values.fullName,
        })
    }

    return (
        <>
            <InquirySentModal
                opened={opened}
                setOpened={setOpened}
                setStep={setStep}
            />
            <Formik
                initialValues={{
                    fullName: "",
                    alsoKnownAs: "",
                    emailAddress: "",
                    phoneNumber: "",
                    subject: "",
                    description: "",
                    eventTitle: "",
                    eventDate: [
                        {
                            eventVenue: "",
                            eventCity: "",
                            eventCountry: "",
                            date: "",
                            eventStartTime: "",
                            eventEndTime: "",
                        },
                    ],
                }}
                validationSchema={
                    step === 1
                        ? bookingPersonalValidationSchema
                        : step === 2
                          ? bookingEventValidationSchema
                          : bookingDetailsValidationSchema
                }
                onSubmit={(values) => {
                    {
                        step === 1
                            ? setStep(2)
                            : step === 2
                              ? setStep(3)
                              : handleValidation(values)
                    }
                }}
            >
                {({ values }) => (
                    <Form className="py-4 mt-4">
                        {step === 1 ? (
                            <BookingPersonalInformation />
                        ) : step === 2 ? (
                            <BookingEventInformation />
                        ) : step === 3 ? (
                            <BookingDetails />
                        ) : (
                            <BookingSummary
                                setStep={setStep}
                                values={values}
                                booking={false}
                            />
                        )}
                        {step === 1 && (
                            <p className="text-black-60 text-sm text-center">
                                *You'll be required to validate your email
                                address
                            </p>
                        )}
                        <div className="flex">
                            <Button
                                variant="yellow"
                                className={`px-6 text-white-100  w-full rounded-[40px] mt-10 ${step === 3 ? "block" : "hidden"}`}
                                type="button"
                                onClick={() => setStep(4)}
                            >
                                Preview Collaboration inquiry
                            </Button>
                            <Button
                                variant="primary"
                                className={`px-6 text-white-100  w-full rounded-[40px] mt-10 ${step === 3 ? "ml-4" : "ml-0"}`}
                                type={"submit"}
                                disabled={onSendOtp.isPending}
                            >
                                {step === 4 ? "Send Inquiry" : "Proceed"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default Collaboration
