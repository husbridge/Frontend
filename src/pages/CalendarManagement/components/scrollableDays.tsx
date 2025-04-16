import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"

const ScrollableDays = ({
    selectedDate,
    setSelectedDate,
}: {
    selectedDate: dayjs.Dayjs
    setSelectedDate: (date: dayjs.Dayjs) => void
}) => {
    const [daysInWeek, setDaysInWeek] = useState<dayjs.Dayjs[]>([])

    useEffect(() => {
        updateDays(selectedDate)
    }, [selectedDate])

    const updateDays = (newDate: dayjs.Dayjs) => {
        const startOfWeek = newDate.startOf("week")
        setDaysInWeek(
            Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"))
        )
    }

    const handleDayClick = (day: dayjs.Dayjs) => {
        setSelectedDate(day)
    }

    const handlePrevDay = () => {
        const prevDay = selectedDate.subtract(1, "day")
        setSelectedDate(prevDay)
    }

    const handleNextDay = () => {
        const nextDay = selectedDate.add(1, "day")
        setSelectedDate(nextDay)
    }
    return (
        <div className="mt-6">
            <div className="md:hidden flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevDay}
                    className=" bg-gray-200 p-1 rounded-full "
                >
                    <IoChevronBack />
                </button>
                <div className="flex overflow-x-scroll">
                    {daysInWeek.map((day) => (
                        <button
                            key={day.toString()}
                            className={`flex flex-col items-center p-2 ${
                                day.isSame(selectedDate, "day")
                                    ? "bg-black-100 text-yellow-100 rounded-lg"
                                    : "bg-transparent text-black"
                            }`}
                            onClick={() => handleDayClick(day)}
                        >
                            <span>{day.format("ddd")}</span>
                            <span className="font-bold">{day.format("D")}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleNextDay}
                    className=" bg-gray-200 p-1 rounded-full "
                >
                    <IoChevronForward />
                </button>
            </div>
        </div>
    )
}

export default ScrollableDays
