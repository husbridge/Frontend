import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { FormControls, Button } from "@components/index"
import { Formik, Form } from "formik"
import { pdf } from "@react-pdf/renderer"
import InvoicePDF from "./invoice"
import { useState } from "react"
import { useInvoiceStore } from "@hooks/useInvoiceStore"
import useAuth from "@hooks/auth/useAuth"
import { jwtDecode } from "jwt-decode"
import { DecodedUser } from "@components/Layout/sidebar/clientSidebar"
import { useQuery } from "@tanstack/react-query"
import { CURRENCIES } from "../../../type/currency.types"
import { fetchProfile } from "@services/auth"
import { invoiceValidationSchema } from "../../../utils/validationSchema"

export interface GenerateIvoiceModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const GenerateIvoiceModal = ({
    opened,
    setOpened,
}: GenerateIvoiceModalProps) => {
    const [clientName, setClientName] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [clientLocation, setClientLocation] = useState("")
    const [clientPhoneNumber, setClientPhoneNumber] = useState("")
    const [eventType, setEventType] = useState("Concert")
    const [eventDate, setEventDate] = useState("")
    const [billingFee, setBillingFee] = useState("")
    const [billCurrency, setBillCurrency] = useState("USD")
    const [logisticInformation, setLogisticInformation] =
        useState("Fully covered")
    const [showCustomInput, setShowCustomInput] = useState(false)
    const [customLogisticValue, setCustomLogisticValue] = useState("")
    const [logisticsFee, setLogisticsFee] = useState("")
    const [logisticsCurrency, setLogisticsCurrency] = useState("USD")
    const [additionalTC, setAdditionalTC] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [accountName, setAccountName] = useState("")
    const [bankName, setBankName] = useState("")
    // const [totalFee, setTotalFee] = useState("")
    const [billOption, setBillOption] = useState("Per day")
    const setInvoice = useInvoiceStore((state) => state.setInvoice)
    const { state } = useAuth()

    const decoded = jwtDecode(state.user?.accessToken || "") as DecodedUser

    const onLogisticsInfoChange = (e: any) => {
        const value = e.target.value
        if (value === "custom") {
            setShowCustomInput(true)
            setLogisticInformation("")
        } else {
            setShowCustomInput(false)
            setLogisticInformation(value)
        }
    }

    const { data } = useQuery({
        queryKey: ["profile"],
        queryFn: () => fetchProfile(),
        // Capped after a production incident where a 500 on GET /profile
        // caused an indefinite retry storm (hundreds of failed requests) —
        // TanStack Query's default is 3 retries with exponential backoff.
        retry: 1,
    })

    const formatCurrency = (amount: string, currency: string) => {
        const symbol = CURRENCIES.find(
            (value) => value.code === currency
        )?.symbol

        return `${symbol}${amount}`
    }

    const handleGeneratePdf = async () => {
        const formattedBillingFee = formatCurrency(billingFee, billCurrency)
        const formattedLogisticsFee = formatCurrency(
            logisticsFee,
            logisticsCurrency
        )
        const formattedTotalFee = formatCurrency(
            String(Number(billingFee) + Number(logisticsFee)),
            billCurrency
        )

        const pdfDoc = (
            <InvoicePDF
                clientName={clientName}
                clientEmail={clientEmail}
                clientLocation={clientLocation}
                clientPhoneNumber={clientPhoneNumber}
                eventType={eventType}
                eventDate={eventDate}
                fees={formattedBillingFee}
                billOption={billOption}
                logisticInformation={logisticInformation}
                logisticsFee={formattedLogisticsFee}
                accountNumber={accountNumber}
                accountName={accountName}
                bankName={bankName}
                additionalTC={additionalTC}
                totalFee={formattedTotalFee}
                fullName={data?.data?.fullName || ""}
                phoneNumber={data?.data.phoneNumber || ""}
                address={data?.data.address || ""}
                email={decoded?.email || ""}
            />
        )

        const pdfBlob = await pdf(pdfDoc).toBlob()

        // Convert the blob to a File object
        const file = new File([pdfBlob], "Invoice.pdf", {
            type: "application/pdf",
        })

        // Save the file to the state
        setInvoice(file)
        setOpened(false)
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
                    Collaboration details
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <Formik
                initialValues={{}}
                onSubmit={() => {}}
                validationSchema={invoiceValidationSchema}
            >
                {() => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6">
                            <FormControls
                                label="Client Name"
                                control="input"
                                name="clientName"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                                onChange={(e) =>
                                    setClientName(e.currentTarget.value)
                                }
                            />
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Client E-mail"
                                control="input"
                                name="clientEmail"
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                                onChange={(e) =>
                                    setClientEmail(e.currentTarget.value)
                                }
                            />
                        </div>
                        <div className="sm:flex mb-6">
                            <div className="w-full mb-6 sm:mb-0">
                                <FormControls
                                    label="Client Location"
                                    control="input"
                                    name="clientLocation"
                                    //placeholder="00/00/00"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                    onChange={(e) =>
                                        setClientLocation(e.currentTarget.value)
                                    }
                                />
                            </div>
                            <div className="sm:ml-4 w-full">
                                <FormControls
                                    label="Client Phone Number"
                                    control="input"
                                    name="PhoneNumber"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(e) =>
                                        setClientPhoneNumber(
                                            e.currentTarget.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div className="sm:flex mb-6">
                            <div className="w-full mb-6 sm:mb-0">
                                <FormControls
                                    label="Event Type"
                                    control="select"
                                    name="eventType"
                                    //placeholder="00/00/00"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                    onChange={(e: any) =>
                                        setEventType(e.target.value)
                                    }
                                >
                                    <option value="Concert">Concert</option>
                                </FormControls>
                            </div>
                            <div className="sm:ml-4 w-full">
                                <FormControls
                                    label="Event Date"
                                    control="date"
                                    name="eventDate"
                                    placeholder="00/00/00"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(date: any) => setEventDate(date)}
                                />
                            </div>
                        </div>
                        <div className="w-full mb-6 sm:mb-0">
                            <FormControls
                                label="Bill Option"
                                control="select"
                                name="billOption"
                                //placeholder="00/00/00"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-4",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                                onChange={(e: any) =>
                                    setBillOption(e.target.value)
                                }
                            >
                                <option value="per_event">Per Event</option>
                                <option value="Per day">Per Day</option>
                                <option value="per_week">Per Week</option>
                                <option value="per_month">Per Month</option>
                                <option value="overall">Overall</option>
                            </FormControls>
                        </div>
                        <div className="sm:flex my-6 text-[14px]">
                            <div className="mb-6 sm:ml-4 w-1/2">
                                <FormControls
                                    label="Fees"
                                    control="input"
                                    name="fees"
                                    // placeholder="00/00/00"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(e) =>
                                        setBillingFee(e.currentTarget.value)
                                    }
                                />
                            </div>
                            <div className="sm:ml-4 w-1/2">
                                <FormControls
                                    label="Currency"
                                    control="select"
                                    name="currency"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(e) =>
                                        setBillCurrency(e.currentTarget.value)
                                    }
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option
                                            key={currency.code}
                                            value={currency.code}
                                        >
                                            {`${currency.name} (${currency.code})`}
                                        </option>
                                    ))}
                                </FormControls>
                            </div>
                        </div>
                        <div className="mb-6">
                            <FormControls
                                label="Logistics Information"
                                control="select"
                                name="logisticsInformation"
                                //placeholder="00/00/00"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-4",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                                onChange={onLogisticsInfoChange}
                            >
                                <option value="Fully covered">
                                    Fully covered
                                </option>
                                <option value="custom">Custom</option>
                            </FormControls>

                            {showCustomInput && (
                                <FormControls
                                    label="Custom Logistics Information"
                                    control="input"
                                    type="text"
                                    name="customLogisticsInformation"
                                    placeholder="Enter custom logistics information"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4 mt-2",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    value={customLogisticValue}
                                    onChange={(e) => {
                                        const customValue = (e.target as any)
                                            .value
                                        setCustomLogisticValue(customValue)
                                        setLogisticInformation(customValue)
                                    }}
                                />
                            )}
                        </div>

                        {/* Logistics Fees */}
                        <div className="sm:flex my-6 text-[14px]">
                            <div className="mb-6 sm:ml-4 w-1/2">
                                <FormControls
                                    label="Logistics Fees"
                                    control="input"
                                    name="logisticsFees"
                                    // placeholder="00/00/00"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(e) =>
                                        setLogisticsFee(e.currentTarget.value)
                                    }
                                />
                            </div>
                            <div className="sm:ml-4 w-1/2">
                                <FormControls
                                    label="Currency"
                                    control="select"
                                    name="currency"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(e) =>
                                        setLogisticsCurrency(
                                            e.currentTarget.value
                                        )
                                    }
                                >
                                    {CURRENCIES.map((currency) => (
                                        <option
                                            key={currency.code}
                                            value={currency.code}
                                        >
                                            {`${currency.name} (${currency.code})`}
                                        </option>
                                    ))}
                                </FormControls>
                            </div>
                        </div>

                        <div className="mb-6">
                            <FormControls
                                label="Bank Name"
                                control="input"
                                name="bankName"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                onChange={(e) =>
                                    setBankName(e.currentTarget.value)
                                }
                            />
                        </div>

                        {/* Account Details */}
                        <div className="sm:flex mb-6">
                            <div className="w-full mb-6 sm:mb-0">
                                <FormControls
                                    label="Account Number"
                                    control="input"
                                    name="accountNumber"
                                    //placeholder="00/00/00"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                    onChange={(e) =>
                                        setAccountNumber(e.currentTarget.value)
                                    }
                                />
                            </div>
                            <div className="sm:ml-4 w-full">
                                <FormControls
                                    label="Account Name"
                                    control="input"
                                    name="accountName"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-4",
                                        input: "text-[#40540A] text-[14px]",
                                    }}
                                    onChange={(e) =>
                                        setAccountName(e.currentTarget.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Additional T&C */}
                        <div className="mb-6">
                            <FormControls
                                label="Additional T&C"
                                control="textarea"
                                name="additionalT$C"
                                placeholder="Please type your terms & conditions"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                onChange={(e) =>
                                    setAdditionalTC(e.currentTarget.value)
                                }
                            />
                        </div>

                        {/* Total Fee */}
                        {/* <div className="mb-6">
                            <FormControls
                                label="Total Fee"
                                control="input"
                                name="totalFee"
                                //placeholder="enter your password"

                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-[#40540A] text-[14px]",
                                }}
                                onChange={(e) =>
                                    setTotalFee(e.currentTarget.value)
                                }
                            />
                        </div> */}
                        <hr />

                        {/* Generate Invoice Button */}
                        <div className="mb-6">
                            <Button
                                variant="primary"
                                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                type="button"
                                onClick={handleGeneratePdf}
                            >
                                Generate
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}
export default GenerateIvoiceModal
