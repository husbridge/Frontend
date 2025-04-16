export interface CreateEventRequest {
    eventTitle: string
    description: string
    eventDate: EventDate[]
    talents: string[]
}
export interface Data {
    eventTitle: string
    description: string
    eventCity: string
    eventCountry: string
    _id: string

    fileUrls: []
    isDeleted: boolean
    isApproved: boolean
    paymentMade: boolean
    eventStatus: string
    attachedTalents: []

    eventDate: EventDate[]
    createdAt: string
    updatedAt: string
    __v: boolean
    createdBy: string
}
type OptionType = { label: string; value: string } | string
export interface EventDate {
    eventCity: string
    eventCountry: OptionType
    eventVenue: string
    date: string
    eventStartTime: string
    eventEndTime: string
}

export interface CreateEventResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: EventsData
}
export interface EventsData {
    events: Data[]
    total: number
}
export interface EventResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: Data
}
