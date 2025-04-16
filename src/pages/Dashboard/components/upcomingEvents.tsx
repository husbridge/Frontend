import Calendar from "@assets/icons/calendar.svg"
import Timer from "@assets/icons/timer.svg"
//import Avatar from "@assets/icons/avatar.svg"
import { Button } from "@components/index"
import { GrLocation } from "react-icons/gr"
import { Data } from "type/api/event.types"
import dayjs from "dayjs"

const UpcomingEvents = ({
    setOpenModal,
    event
}: {
    setOpenModal: () => void
    event: Data
}) => {
    return (
        <div className="bg-white-100 rounded-lg py-4 w-full">
            <div className="flex justify-between border-b border-grey-80 px-4 pb-3">
                <div className="flex">
                    <img src={Calendar} alt="" />
                    <p className="text-sm ml-1">
                        {dayjs(event.eventDate[0].date).format("MMM D ")}
                        
                    </p>
                </div>
                <div className="flex">
                    <img src={Timer} alt="time" />
                    <p className="text-sm ml-1">
                        {dayjs(event.eventDate[0].eventStartTime).format(
                            "h:mmA"
                        ) +
                            " - " +
                            dayjs(event.eventDate[0].eventEndTime).format(
                                "h:mmA"
                            )}
                        
                    </p>
                </div>
            </div>
            <div className="py-3 px-4">
                <p className="text-[2md] font-medium mb-2">
                    {event.eventTitle}
                    
                </p>
                {/* <div className="flex items-center">
                    <img src={Avatar} className="w-5" alt="" />
                    <p className="pl-2 text-black-70 text-sm">
                    
                        Basket Mouth
                    </p>
                </div> */}
                <div className="flex mt-2">
                    <GrLocation size="20px" />
                    <p className="pl-2 text-black-70 text-sm">
                        {event.eventDate[0].eventVenue}
                        
                    </p>
                </div>
                <Button
                    variant="yellow"
                    className="mt-4 w-full text-md"
                    onClick={() => setOpenModal()}
                >
                    See full details
                </Button>
            </div>
        </div>
    )
}

export default UpcomingEvents
