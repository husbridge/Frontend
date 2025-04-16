import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import dayjs from "dayjs"


const MonthYearHeader = ({ calendarRef, currentDate, updateDays }: { calendarRef: any, currentDate: dayjs.Dayjs, updateDays: (newDate: dayjs.Dayjs) => void }) => {
    

    const handlePrev = () => {
        const calendarApi = calendarRef.current?.getApi();
        const prevMonth = currentDate.subtract(1, "month");
        calendarApi.gotoDate(prevMonth.toDate()); // Navigate FullCalendar to the previous month
       
        updateDays(prevMonth); // Update the days component
    };

    const handleNext = () => {
        const calendarApi = calendarRef.current?.getApi();
        const nextMonth = currentDate.add(1, "month");
        calendarApi.gotoDate(nextMonth.toDate()); // Navigate FullCalendar to the next month
        updateDays(nextMonth); // Update the days component
    }

    return (
        <div className="md:hidden flex justify-between items-center p-2 bg-gray-200 rounded-full mt-4">
            <button onClick={handlePrev} className="bg-white-100 p-1 rounded-full ">
                <IoChevronBack  size='18px'/>
            </button>
            <p className="text-3md font-medium">
                {currentDate.format("MMMM YYYY")}
            </p>
            <button onClick={handleNext} className="bg-white-100 p-1 rounded-full ">
                <IoChevronForward size='18px'/>
            </button>
        </div>
    );
};

export default MonthYearHeader;