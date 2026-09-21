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
                            <div className="mb-6 flex items-center rounded-2xl overflow-hidden bg-[#ffffff]/5 border border-[#ffffff]/15">
                                {selectedPackage.image ? (
                                    <img
                                        src={selectedPackage.image}
                                        alt={selectedPackage.label}
                                        className="w-24 h-24 object-cover flex-none"
                                    />
                                ) : (
                                    // Matches Website's own no-image fallback
                                    // for a package card (PackagesSection.tsx:
                                    // `from-primary-light-gray to-primary-black`)
                                    // rather than inventing a different
                                    // placeholder treatment for the same case.
                                    <div className="w-24 h-24 flex-none bg-gradient-to-br from-[#313A47]/40 to-[#101214]" />
                                )}
                                <div className="p-4 flex-1 min-w-0">
                                    <p className="text-xs text-[#ffffff]/70 uppercase tracking-wide">
                                        Enquiring about
                                    </p>
                                    <div className="flex items-center justify-between gap-2 mt-1">
                                        <p className="font-semibold text-[#ffffff] truncate">
                                            {selectedPackage.label}
                                        </p>
                                        <span className="bg-[#FEC009] text-[#101214] text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap flex-none">
                                            {formatMoney(
                                                selectedPackage.price,
                                                selectedPackage.currency
                                            )}
                                        </span>
                                    </div>
                                    {selectedPackage.deliverables?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {selectedPackage.deliverables.map(
                                                (d, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-xs bg-[#ffffff]/10 text-[#ffffff]/85 rounded-full px-2 py-0.5"
                                                    >
                                                        {d}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
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
                            <p className="text-[#ffffff]/70 text-sm text-center">
                                *You'll be required to validate your email
                                address
                            </p>
                        )}
                        <div className="flex">
                            <Button
                                variant="yellow"
                                className={`px-6 !text-[#ffffff] w-full rounded-[40px] mt-10 ${step === 3 ? "block" : "hidden"}`}
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
