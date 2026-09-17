import { APIResponse } from "."
import { EventDate } from "./event.types"
import { PublicPackage } from "./auth.types"

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
    // Set only when the buyer picked a package before starting contact
    // (PHASE2_DESIGN.md §1). husridge-server populates this — it's the
    // full package (label/price/deliverables/image), not a bare id — see
    // PortalService.getInquiresByTalentId's PackagePublicDto wrapping.
    // Was missing from this type entirely, which is why the talent-facing
    // detail view had no package field to render at all: the data existed
    // server-side (PHASE2_BACKLOG.md, "packageId reached the write side
    // but never the read side") but nothing on this side declared it.
    packageId: PublicPackage | null
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
    // Not required by every inquiryType — "message" sends neither
    // (PortalController.ts validates each type's own required fields;
    // this shared shape stays permissive rather than a union per type).
    phoneNumber?: string
    eventTitle?: string
    subject?: string
    alsoKnowAs?: string
    description: string
    attachDocument?: string
    inquiryType: string
    talentID: string
    eventDate?: EventDate[]
    // Optional — set only when a buyer picked a package before starting
    // contact (see the Website's PackagesSection "Book this package" CTA).
    // Booking-only in practice; husridge-server validates it against
    // talentID regardless of inquiryType.
    packageId?: string
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
