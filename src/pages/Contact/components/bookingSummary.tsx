import { FaEdit } from "react-icons/fa"
//import PdfIcon from "@assets/icons/pdf.svg"
import dayjs from "dayjs"
import { BookingInterface } from "../../../type/booking.types"

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
        <div className=" bg-white-100 px-2 sm:px-0">
            <div className="">
                <div className="flex justify-between">
                    <p className=" font-medium text-3md">
                        {" "}
                        Personal Information{" "}
                    </p>
                    <div className="cursor-pointer" onClick={() => setStep(1)}>
                        <FaEdit className="" />
                    </div>
                </div>

                <div className="flex mt-4 space-x-20">
                    <div className="w-1/2">
                        <p className=" font-medium sm:text-md text-sm text-[#475569]">
                            Full Name
                        </p>
                        <p className=" font-medium sm:text-md text-sm text-[#000000] mt-2">
                            {values.fullName}
                        </p>
                    </div>

                    <div className="w-1/2">
                        {" "}
                        <p className=" font-medium sm:text-md text-sm text-[#475569]">
                            Also Known as
                        </p>
                        <p className="font-Montserrat font-medium sm:text-md text-sm  text-[#000000] mt-2">
                            {values.alsoKnownAs}
                        </p>
                    </div>
                </div>

                <div className="flex mt-5 space-x-20 border-b py-4">
                    <div className="w-1/2">
                        <p className="font-Montserrat font-medium sm:text-md text-sm text-[#475569]">
                            Mobile Number
                        </p>
                        <p className=" font-medium sm:text-md text-sm text-[#000000] mt-2">
                            {values.phoneNumber}
                        </p>
                    </div>

                    <div className="w-1/2">
                        {" "}
                        <p className=" font-medium sm:text-md text-sm text-[#475569]">
                            Email
                        </p>
                        <p className=" font-medium sm:text-md text-sm  text-[#000000] mt-2">
                            {values.emailAddress}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between my-4 ">
                    <p className=" font-medium text-3md"> Venue Information </p>
                    <div className="cursor-pointer" onClick={() => setStep(2)}>
                        <FaEdit />
                    </div>
                </div>
                <div className="w-1/2">
                    {" "}
                    <p className=" font-medium sm:text-md text-sm text-[#475569]">
                        Event Title
                    </p>
                    <p className=" font-medium sm:text-md text-sm  text-[#000000] mt-2">
                        {values.eventTitle}
                    </p>
                </div>
                {values.eventDate.map((item, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex mt-4 space-x-20">
                            <div className="w-1/2">
                                <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                    Event City
                                </p>
                                <p className=" font-medium sm:text-md text-sm text-[#000000] mt-2">
                                    {item.eventCity}
                                </p>
                            </div>

                            <div className="w-1/2">
                                {" "}
                                <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                    Event Country
                                </p>
                                <p className=" font-medium sm:text-md text-sm  text-[#000000] mt-2">
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
                                <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                    Event Venue
                                </p>
                                <p className=" font-medium sm:text-md text-sm text-[#000000] mt-2">
                                    {item.eventVenue}
                                </p>
                            </div>

                            <div className="w-1/2">
                                {" "}
                                <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                    Event Date
                                </p>
                                <p className=" font-medium sm:text-md text-sm  text-[#000000] mt-2">
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
                    <p className=" font-medium text-3md">
                        {" "}
                        {booking ? "Booking" : "collaboration"} Details{" "}
                    </p>
                    <div className="cursor-pointer" onClick={() => setStep(3)}>
                        <FaEdit />
                    </div>
                </div>

                <div className="flex mt-4">
                    <div>
                        <p className=" font-medium sm:text-md text-sm text-[#475569]">
                            Event Subject
                        </p>
                        <p className=" font-medium sm:text-md text-sm text-[#000000] mt-2">
                            {values.subject}
                        </p>
                    </div>
                </div>

                <div className="flex mt-5">
                    <div>
                        <p className=" font-medium sm:text-md text-sm text-[#475569]">
                            Event Description
                        </p>
                        <p className=" font-medium sm:text-md text-sm text-[#000000] mt-2">
                            {values.description}
                        </p>
                    </div>
                </div>

                {/* <div className="mt-5">
                    <p className=" font-medium text-md text-[#475569]">
                        Attachment
                    </p>
                    <div className="flex p-2 mt-2">
                        <img src={PdfIcon} alt="" />{" "}
                        <p className="text-sm mx-2 font-normal">
                            Proposal Description.pdf <br /> 100 KB
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default BookingSummary
