import { Modal } from "@mantine/core"
import { Button } from "@components/index"
import Close from "@assets/icons/close.svg"
import { LuCalendarDays } from "react-icons/lu"
import { GoClock } from "react-icons/go"
import { IoCloseSharp } from "react-icons/io5"
import dayjs from "dayjs"
import { deleteEvent } from "@services/calendar"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Data } from "type/api/event.types"

export interface EventDetailsModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    handleSetReminder: () => void
    event?: Data
}

const EventDetailsModal = ({
    opened,
    setOpened,
    event,
}: EventDetailsModalProps) => {
    const queryClient = useQueryClient()

    const { isPending, mutate } = useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "Event deleted successfully",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["events"] })
                .finally(() => false)
            setOpened(false)
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
                    Event Details
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <p className="text-2md md:text-3md font-semibold">
                {event?.eventTitle}
            </p>
            {event?.eventDate && event?.eventDate.length >0 &&event?.eventDate.map((element, index) => (
                <div key={index}>
                    <div className="flex text-md font-medium items-center mt-4">
                        <LuCalendarDays size="20px" color="#000000B2" />
                        <p className="ml-2">
                            {dayjs(element.date).format("ddd MMM D ")}
                        </p>
                        <p className="text-[#D2CECE80] px-2">|</p>
                        <GoClock size="20px" color="#000000B2" />
                        <p className="ml-2">
                            {" "}
                            {dayjs(element.eventStartTime).format("hh:mma") +
                                " - " +
                                dayjs(element.eventEndTime).format("hh:mma")}
                        </p>
                    </div>
                    <p className="mt-8 text-2md md:text-3md font-medium text-black-70 border-b border-t py-6">
                        <span className="text-black-100">Location</span> :{" "}
                        {element.eventVenue}
                    </p>
                </div>
            ))}

            <p className=" text-2md md:text-3md font-medium text-black-70  border-b py-6">
                <span className="text-black-100">Description</span> :{" "}
                {event?.description}
            </p>

            { event?.attachedTalents && 
                event?.attachedTalents.length > 0 &&
            <p className="mb-8 text-2md md:text-3md font-medium text-black-70  border-b py-6 flex justify-between items-center">
                    <span className="text-black-100">Talents:</span>
                    <span className="flex flex-wrap gap-1">
                        {event?.attachedTalents.map((talent: any) =>(
                            <span key={talent._id} className="py-1 px-2 rounded-full border mr-1 text-sm">
                                {talent.fullName || talent.firstName || talent.stageName}
                            </span>
                        ))}
                    </span>
                </p>}

            <div className="flex mt-10 w-full">
                <Button
                    variant="red"
                    className="ml-4 w-full"
                    onClick={() => mutate(event?._id||"")}
                    disabled={isPending}
                >
                    <IoCloseSharp
                        color="#FF4040"
                        className="mr-2"
                        size="22px"
                    />
                    {isPending ? "Cancelling" : "Cancel Event"}
                </Button>
            </div>
        </Modal>
    )
}

export default EventDetailsModal
