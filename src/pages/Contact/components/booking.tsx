import BookingDetails from "./bookingDetails"
import BookingPersonalInformation from "./bookingPersonalInformation"
import BookingEventInformation from "./bookingEventInformation"
import BookingSummary from "./bookingSummary"
import { Button, LoadingState } from "@components/index"
import { Formik, Form } from "formik"
import { useState } from "react"
import {
    bookingPersonalValidationSchema,
    bookingEventValidationSchema,
    bookingDetailsValidationSchema,
} from "@utils/validationSchema"
import { useInquirySubmission } from "@hooks/useInquirySubmission"
import { useBuyerPrefill } from "@hooks/useBuyerPrefill"
import { showNotification } from "@mantine/notifications"
import { useInquiryStore } from "@hooks/useInquiry";
import { uploadFile } from "@services/storage"
import { PublicPackage } from "type/api/auth.types"
import { formatMoney } from "@utils/money"

const Booking = ({
    id,
    selectedPackage,
}: {
    id: string
    // Set only when the buyer arrived here via a package's "Book this
    // package" CTA (PHASE2_DESIGN.md §1) — display-only summary; the
    // create-inquiry call below still carries the raw packageId, which
    // husridge-server validates independently.
    selectedPackage?: PublicPackage | null
}) => {
    const [step, setStep] = useState(1);
    const document = useInquiryStore((state) => state.document);

    const { submit, isPending, isAuthenticatedBuyer } = useInquirySubmission()
    const { prefill, isLoading: isPrefillLoading } = useBuyerPrefill()

    if (isPrefillLoading) return <LoadingState />

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
                    item.eventCountry as {
                        label: string
                        value: string
                    }
                ).label,

                eventCity: item.eventCity,
                eventVenue: item.eventVenue,
                eventStartTime: item.eventStartTime,
                eventEndTime: item.eventEndTime,
            })),
            eventTitle: values.eventTitle,
            phoneNumber: values.phoneNumber,
            subject: values.subject,
            inquiryType: "booking",
            talentID: id,
            attachDocument: uploadedDocumentKey,
            ...(selectedPackage ? { packageId: selectedPackage._id } : {}),
        }
        submit(inquiry)
    }

    return (
        <>
            <Formik
                initialValues={{
                    fullName: prefill?.fullName || "",
                    alsoKnownAs: "",
                    emailAddress: prefill?.emailAddress || "",
                    phoneNumber: prefill?.phoneNumber || "",
                    subject: "",
                    description: "",
                    eventTitle: "",
                    eventDate: [
                        {
                            eventVenue: "",
                            eventCity: "",
                            eventCountry: {} as {
                                label: string
                                value: string
                            },
                            date: "",
                            eventStartTime: "",
                            eventEndTime: "",
                        },
                    ]
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
                        {step === 1 && selectedPackage && (
                            <div className="mb-6">
                                <p className="font-medium sm:text-md text-sm text-[#475569]">
                                    Package selected
                                </p>
                                <p className="font-medium sm:text-md text-sm text-[#000000] mt-2">
                                    {selectedPackage.label} —{" "}
                                    {formatMoney(
                                        selectedPackage.price,
                                        selectedPackage.currency
                                    )}
                                </p>
                            </div>
                        )}
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
                                booking
                            />
                        )}
                        {step === 1 && !isAuthenticatedBuyer && (
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
                                Preview Booking inquiry
                            </Button>
                            <Button
                                variant="primary"
                                className={`px-6 text-white-100  w-full rounded-[40px] mt-10 ${step === 3 ? "ml-4" : "ml-0"}`}
                                type={"submit"}
                                disabled={isPending}
                            >
                                {step > 2 ? "Send Inquiry" : "Proceed"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default Booking
