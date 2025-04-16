import dayjs from "dayjs"
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

export function capitalizeFirstLetter(word: string) {
    if (!word) return ""
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export const groupBy = <T, K extends keyof any>(
    list: T[],
    getKey: (item: T) => K
) =>
    list.reduce(
        (previous, currentItem) => {
            const group = getKey(currentItem)
            if (!previous[group]) previous[group] = []
            previous[group].push(currentItem)
            return previous
        },
        {} as Record<K, T[]>
    )

export function parseUTCDate(val: string): string {
    const date = new Date(val)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
export const formatShortDateTime = (dateString: string) => {
    const date = dayjs(dateString)
    const today = dayjs()
    if (date.isSame(today, "day")) {
        return date.format("h:mm A")
    }

    return date.format("DD MMM")
}

const today = new Date()
const getLastWeek = () => {
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)
    return lastWeek.toISOString().split("T")[0]
}

const getLastMonth = () => {
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)
    return lastMonth.toISOString().split("T")[0]
}

const getLastYear = () => {
    const lastYear = new Date(today)
    lastYear.setFullYear(today.getFullYear() - 1)
    return lastYear.toISOString().split("T")[0]
}

const getToday = () => today.toISOString().split("T")[0]

export const dateRanges = {
    today: getToday(),
    lastWeek: getLastWeek(),
    lastMonth: getLastMonth(),
    lastYear: getLastYear(),
}

export const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    const rawData = window.atob(base64)
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export const formatInquiryType = (type: string) => {
    switch (type) {
        case "collaboration":
            return (
                <p className="bg-[#DEFEE3] text-[#12220C] p-1 text-[10px] rounded-full">
                    Collaboration
                </p>
            )
        case "proposal":
            return (
                <p className="bg-[#DEE3FE] text-[#0C0E22] p-1 text-[10px] rounded-full">
                    Proposal
                </p>
            )
        case "booking":
            return (
                <p className="bg-[#F4DEFE] text-[#1E0C22] p-1 text-[10px] rounded-full">
                    Booking
                </p>
            )

        default:
            return (
                <div className="flex">
                    <p>unknown role</p>
                </div>
            )
    }
}

export const mergeDate = (date: Date, time: Date) => {
    return dayjs(date)
        .set("hour", dayjs(time).hour())
        .set("minute", dayjs(time).minute())
        .set("second", dayjs(time).second())
        .toISOString() // Combine date and startTime,
}

export const countActiveFilters = (filters: any) => {
    let count = 0

    Object.entries(filters).forEach(([key, value]) => {
        if (key === "startDate" || key === "endDate") return

        if (value && (Array.isArray(value) ? value.length : true)) {
            count++
        }
    })

    if (filters.startDate && filters.endDate) {
        count++
    }

    return count
}

export function formatFileSize(fileSizeInBytes: number) {
    if (fileSizeInBytes >= 1024 * 1024) {
        // Convert to MB if the file size is 1MB or more
        const sizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2)
        return `${sizeInMB}MB`
    } else {
        // Convert to kB otherwise
        const sizeInKB = (fileSizeInBytes / 1024).toFixed(0)
        return `${sizeInKB}kB`
    }
}
