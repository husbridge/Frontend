export interface CalendarResponse {
    results: Results[]
    page: number
    limit: number
    totalPages: number
    totalResults: number
}
type OptionType = { label: string; value: string } | string;
export interface Results {
    id: string
    userId: number
    eventTitle: string
    description: string
    eventVenue: string
    eventCity: OptionType
    eventCountry: OptionType
    eventDate: string
    eventTime: string
}

export interface CalendarRequest {
    userId: number
    eventTitle: string
    description: string
    eventVenue: string
    eventCity: string
    eventCountry: string
    eventDate: string
    eventTime: string
}
