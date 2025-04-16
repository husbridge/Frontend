import { APIResponse } from "."

export interface TalentsResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: Data[]
}

export interface Data {
    _id: string
    profileUrl: ""
    fullName: string
    firstName: string
    lastName: string
    emailAddress: string
    phoneNumber: string
    gender: string
    dateOfBirth: ""
    address: ""
    postCode: ""
    state: ""
    country: ""
    geolocation: {
        latitude: number
        longitude: number
    }
    enableTwoFA: boolean
    isVerified: boolean
    agency: {
        _id: string
    }
    manager: string
    managing: []
    permissions: []
    verificationType: string
    verificationTypeValue: string
    industry: string
    stageName: string
    registrationStage: string
    userType: string
    uniqueUsername: string
    userStatus: string
    createdAt: string
}

export interface CreateTalentRequest {
    firstName: string
    lastName: string
    stageName: string
    industry: string
    emailAddress?: string
    gender?: string
    phoneNumber?: string
    id?: string
    manager?: string
}

export type CreateTalentResponse = APIResponse<null>
export type TalentStatsResponse = APIResponse<Data>
export interface Data {
    activeTalent: number
    suspendTalent: number
    deactivatedTalent: number
    total: number
}

export interface assignManagerRequest {
    managerId: string
    talentId: string
    permissions: string[]
}

export interface IndustriesResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: string[]
}
