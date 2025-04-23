import RightArrow from "@assets/icons/rightArrow.svg"
import {
    AddEvent,
    Button,
    EventDetailModal,
    Input,
    SetReminderModal,
} from "@components/index"
import { EventClickArg, EventContentArg, EventInput } from "@fullcalendar/core"
import { EventImpl } from "@fullcalendar/core/internal"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { createRef, useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { FaPlus } from "react-icons/fa"
import { IoFilter } from "react-icons/io5"

import { countActiveFilters, mergeDate } from "@utils/helpers"
import dayjs from "dayjs"
import { CreateEventResponse, EventsData } from "type/api/event.types"
import MonthYearHeader from "./components/monthYearHeader"
import ScrollableDays from "./components/scrollableDays"

const renderEventContent = (eventContent: EventContentArg) => {
    const getRandomColor = () => {
        const letters = "0123456789ABCDEF"
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    const borderColor = getRandomColor()
    return (
        <div
            style={{
                background: `${borderColor}1A`,
                borderColor: borderColor,
            }}
            className={`rounded-[9px] flex justify-between p-2 items-center m-1 border w-full  text-black-100 cursor-pointer`}
        >
            <div>
                <p className="font-medium text-sm text-wrap">
                    {eventContent.event.title}
                </p>
                <p className=" mt-1 text-[10px] text-wrap">
                    {eventContent.event.extendedProps.venue}
                </p>

                <p className="text-[10px] font-medium mt-1">
                    {dayjs(
                        eventContent.event.extendedProps.eventStartTime
                    ).format("h:mma")}{" "}
                    -{" "}
                    {dayjs(
                        eventContent.event.extendedProps.eventEndTime
                    ).format("h:mma")}
                </p>
            </div>
            <img src={RightArrow} alt="" />
        </div>
    )
}

const Calendar = ({
    data,
    setOpenFilter,
    filters,
}: {
    data?: CreateEventResponse
    setOpenFilter: (isOpen: boolean) => void
    filters: any
}) => {
    const [addEvent, setAddEvent] = useState(false)
    const [openEventDetails, setOpenEventDetails] = useState(false)
    const [openSetReminder, setOpenSetReminder] = useState(false)
    const [eventsData, setEventsData] = useState<EventInput[]>([])
    const [singleEvent, setSingleEvent] = useState<EventImpl>()
    const [selectedDate, setSelectedDate] = useState(dayjs())

    function transformData(data: EventsData) {
        const result: any = []
        data?.events.forEach((event) => {
            event.eventDate.forEach((dateInfo) => {
                const newEvent = {
                    eventTitle: event.eventTitle,
                    description: event.description,
                    eventCity: dateInfo.eventCity,
                    eventCountry: dateInfo.eventCountry,
                    date: dateInfo.date,
                    eventVenue: dateInfo.eventVenue,
                    startTime: dateInfo.eventStartTime,
                    endTime: dateInfo.eventEndTime,
                    attachedTalents: event.attachedTalents,
                    id: event._id,
                }
                result.push(newEvent)
            })
        })

        return result
    }

    useEffect(() => {
        if (data?.data) {
            const transformedData = transformData(data.data)
            const tempEvents = []
            for (let i = 0; i < transformedData.length; i++) {
                const app = transformedData[i]

                tempEvents.push({
                    title: app.eventTitle,
                    eventStartTime: app.startTime,
                    start: mergeDate(app.date, app.startTime),
                    //end: mergeDate(app.date, app.endTime),
                    eventEndTime: app.endTime,
                    country: app.eventCountry,
                    city: app.eventCity,
                    _id: app.id,
                    venue: app.eventVenue,
                    description: app.description,
                    attachedTalents: app.attachedTalents,
                })
            }

            setEventsData(tempEvents)
        }
    }, [data])

    const getHeaderProps = (): any => {
        return {
            left: "prev next today",
            center: "title",
            right: "listDay,dayGridMonth",
        }
    }
    const calendarComponentRef: any = createRef<FullCalendar>()
    const changeView = (): void => {
        const calendar = calendarComponentRef.current.getApi()
        calendar.changeView(
            window.innerWidth < 768 ? "listDay" : "dayGridMonth"
        )
        calendar.setOption("header", getHeaderProps())
        //console.log(view)
    }
    const handleEventClick = (arg: EventClickArg) => {
        setSingleEvent(arg.event)
        setOpenEventDetails(true)
    }

    const handleUpdateDays = (newDate: dayjs.Dayjs) => {
        setSelectedDate(newDate)
        // Update FullCalendar view with new date
        const calendarApi = calendarComponentRef.current?.getApi()
        calendarApi?.gotoDate(newDate.toDate())
    }
    return (
        <>
            <SetReminderModal
                opened={openSetReminder}
                setOpened={setOpenSetReminder}
            />
            <EventDetailModal
                opened={openEventDetails}
                setOpened={setOpenEventDetails}
                handleSetReminder={() => {
                    setOpenEventDetails(false)
                    setOpenSetReminder(true)
                }}
                event={singleEvent}
            />
            <AddEvent opened={addEvent} setOpened={setAddEvent} />
            <div className="flex justify-between items-center mt-4">
                <p className="text-3md sm:text-[20px] lg:text-lg md:mb-0 mb-4">
                    Calendar
                    {/* ({data?.data?.total || 0}) */}
                </p>
                <div className="sm:flex hidden">
                    <Button
                        variant="clear"
                        className={`rounded-[35px] flex gap-2 !justify-between`}
                        onClick={() => !!setOpenFilter && setOpenFilter(true)}
                    >
                        Filters
                        {countActiveFilters(filters) > 0 ? (
                            <span className="py-0.5 px-2 text-sm rounded-full bg-black-100 text-white-100">
                                {countActiveFilters(filters)}
                            </span>
                        ) : (
                            <IoFilter />
                        )}
                    </Button>
                    <Input
                        placeholder="Search for an event"
                        className=" border border-[#E0E0E0] rounded-2xl w-[200px] xl:w-[300px] p-4 h-[50px] text-[12px] text-grey-100 font-medium ml-4"
                        prefixIcon={
                            <BiSearch
                                size="30px"
                                color="black"
                                className="mr-2"
                            />
                        }
                    />
                </div>

                <div className="flex">
                    <Button
                        className="flex text-white-100"
                        variant="black"
                        onClick={() => setAddEvent(true)}
                    >
                        <FaPlus color="white" className="mr-2" /> Add Event
                    </Button>
                </div>
            </div>
            <div className="sm:hidden flex mt-4 justify-between">
                <Button
                    variant="clear"
                    className={`rounded-[35px] flex gap-2 !justify-between`}
                    onClick={() => !!setOpenFilter && setOpenFilter(true)}
                >
                    Filters
                    {countActiveFilters(filters) > 0 ? (
                        <span className="py-0.5 px-2 text-sm rounded-full bg-black-100 text-white-100">
                            {countActiveFilters(filters)}
                        </span>
                    ) : (
                        <IoFilter />
                    )}
                </Button>
                <Input
                    placeholder="Search for an event"
                    className=" border border-[#E0E0E0] rounded-2xl w-[200px] xl:w-[300px] p-4 h-[50px] text-[12px] text-grey-100 font-medium ml-4"
                    prefixIcon={
                        <BiSearch size="30px" color="black" className="mr-2" />
                    }
                />
            </div>
            <MonthYearHeader
                calendarRef={calendarComponentRef}
                updateDays={handleUpdateDays}
                currentDate={selectedDate}
            />

            {/* Scrollable Days */}
            <ScrollableDays
                selectedDate={selectedDate}
                setSelectedDate={handleUpdateDays}
            />
            <div className="bg-white-100 p-2 mt-4 relative">
                <FullCalendar
                    ref={calendarComponentRef}
                    eventClick={(arg) => handleEventClick(arg)}
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                    ]}
                    initialView={
                        window.innerWidth > 768 ? "dayGridMonth" : "listDay"
                    }
                    //dateClick={(info) => setSelectedDate(dayjs(info.date))}

                    views={{
                        listWeek: { buttonText: "week" },
                        listMonth: { buttonText: "Month" },
                        listDay: { buttonText: "Day" },
                    }}
                    events={eventsData}
                    eventContent={renderEventContent}
                    headerToolbar={
                        window.innerWidth > 768 ? getHeaderProps() : false
                    }
                    windowResize={changeView}
                />
            </div>
        </>
    )
}

export default Calendar
