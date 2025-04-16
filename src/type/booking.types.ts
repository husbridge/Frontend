import { EventDate } from "./api/event.types"

export interface BookingInterface{
    fullName:string
    alsoKnownAs:string
    emailAddress:string
    phoneNumber:string
    subject:string
    description:string
    eventTitle: string
    eventDate:EventDate[]
                    
}