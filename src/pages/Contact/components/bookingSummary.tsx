import { FaEdit } from "react-icons/fa"
//import PdfIcon from "@assets/icons/pdf.svg"
import dayjs from "dayjs"
import { BookingInterface } from "../../../type/booking.types"
import { darkFieldLabel, darkFieldValue } from "../darkTheme"

const BookingSummary = ({
    setStep,
    values,
    booking,
}: {
    setStep: (val: number) => void
    values: BookingInterface
    booking: boolean
}) => {
    return (
        <div className="px-2 sm:px-0">
            <div className="">
                <div className="flex justify-between">
                    <p className="font-medium text-3md text-[#ffffff]">
                        {" "}
                        Personal Information{" "}
                    </p>
                    <div className="cursor-pointer" onClick={() => setStep(1)}>
                        <FaEdit className="text-[#ffffff]/70" />
                    </div>
                </div>

                <div className="flex mt-4 space-x-20">
                    <div className="w-1/2">
                        <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                            Full Name
                        </p>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                            {values.fullName}
                        </p>
                    </div>

                    <div className="w-1/2">
                        {" "}
                        <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                            Also Known as
                        </p>
                        <p className={`font-Montserrat font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                            {values.alsoKnownAs}
                        </p>
                    </div>
                </div>

                <div className="flex mt-5 space-x-20 border-b border-[#ffffff]/15 py-4">
                    <div className="w-1/2">
                        <p className={`font-Montserrat font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                            Mobile Number
                        </p>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                            {values.phoneNumber}
                        </p>
                    </div>

                    <div className="w-1/2">
                        {" "}
                        <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                            Email
                        </p>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                            {values.emailAddress}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between my-4 ">
                    <p className="font-medium text-3md text-[#ffffff]"> Venue Information </p>
                    <div className="cursor-pointer" onClick={() => setStep(2)}>
                        <FaEdit className="text-[#ffffff]/70" />
                    </div>
                </div>
                <div className="w-1/2">
                    {" "}
                    <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                        Event Title
                    </p>
                    <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                        {values.eventTitle}
                    </p>
                </div>
                {values.eventDate.map((item, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex mt-4 space-x-20">
                            <div className="w-1/2">
                                <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                                    Event City
                                </p>
                                <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                                    {item.eventCity}
                                </p>
                            </div>

                            <div className="w-1/2">
                                {" "}
                                <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                                    Event Country
                                </p>
                                <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                                    {
                                        (
                                            item.eventCountry as {
                                                label: string
                                                value: string
                                            }
                                        ).label
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex mt-4 space-x-20">
                            <div className="w-1/2">
                                <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                                    Event Venue
                                </p>
                                <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                                    {item.eventVenue}
                                </p>
                            </div>

                            <div className="w-1/2">
                                {" "}
                                <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                                    Event Date
                                </p>
                                <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                                    {dayjs(item.date).format("DD MMM, YYYY") +
                                        " at " +
                                        dayjs(item.eventStartTime).format(
                                            "h:mm"
                                        ) +
                                        "-" +
                                        dayjs(item.eventEndTime).format("h:mm")}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex justify-between mt-4">
                    <p className="font-medium text-3md text-[#ffffff]">
                        {" "}
                        {booking ? "Booking" : "collaboration"} Details{" "}
                    </p>
                    <div className="cursor-pointer" onClick={() => setStep(3)}>
                        <FaEdit className="text-[#ffffff]/70" />
                    </div>
                </div>

                <div className="flex mt-4">
                    <div>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                            Event Subject
                        </p>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                            {values.subject}
                        </p>
                    </div>
                </div>

                <div className="flex mt-5">
                    <div>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldLabel}`}>
                            Event Description
                        </p>
                        <p className={`font-medium sm:text-md text-sm ${darkFieldValue} mt-2`}>
                            {values.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingSummary
