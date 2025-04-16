import { EventDate } from "./event.types"
import { APIResponse } from "."

export type InquiryResponse = APIResponse<Data[]>

export interface Data {
    talentID: string

    isApproved: boolean
    _id: string
    eventTitle: string

    description: string
    alsoKnowAs: string
    fullName: string
    emailAddress: string
    phoneNumber: string
    subject: string
    attachDocument: string
    chatGroupId: string
    isDeleted: false
    bookedForTalent: {
        _id: string
        profileUrl: string
        fullName: string
        firstName: string
        lastName: string
        gender: string
        isVerified: boolean
        agency: null
        manager: null
        industry: string
        stageName: string
        userType: string
        uniqueUsername: string
    }
    eventDate: EventDate[]
    inquiryType: string
    createdAt: string
    updatedAt: string
    __v: number
}
export interface NewData {
    chatGroupId: Data[]
}

export interface CreateInquiryRequest {
    fullName: string
    emailAddress: string
    phoneNumber: string
    eventTitle?: string
    subject: string
    alsoKnowAs?: string
    description: string
    attachDocument?: string
    inquiryType: string
    talentID: string
    eventDate?: EventDate[]
}
export type CreateInquiryResponse = APIResponse<null>

export interface SendMailRequest {
    email: string
    subject: string
    messageBody: string
    isInquiryResponse?: boolean
}

export interface InquiryStatResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: {
        booking: number
        collaboration: number
        proposal: number
        total: number
    }
}
