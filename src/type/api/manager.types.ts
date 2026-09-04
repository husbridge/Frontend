import { APIResponse } from "."

export interface ManagerResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: Data[]
}

export interface SingleManagerResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: Data
}

export interface Data {
    _id: string
    profileUrl: string
    fullName: string
    firstName: string
    lastName: string
    emailAddress: string
    phoneNumber: string
    gender: string
    dateOfBirth: ""
    address: string
    postCode: ""
    state: string
    country: ""
    geolocation: {
        latitude: number
        longitude: number
    }
    enableTwoFA: false
    isVerified: false
    agency: {
        _id: string
    }
    manager: null
    managing: []
    permissions: []
    verificationType: ""
    verificationTypeValue: ""
    industry: ""
    stageName: ""
    uniqueUsername:""
    registrationStage: string
    userStatus: string
    createdAt: string
    bio?: string
    socialLinks?: {
        instagram?: string
        tiktok?: string
        twitter?: string
        youtube?: string
        website?: string
    }
    tags?: string[]
    portfolioMedia?: {
        _id: string
        url: string
        type: "image"
        caption?: string
        order?: number
        uploadedAt?: string
    }[]
}

export interface CreateManagerRequest {
    fullName: string
    emailAddress: string
    phoneNumber: string
    gender: string
}

export interface CreateManagerResponse {
    statusCode: number
    message: string
    hasError: false
    data: null
}

export type ManagerStatsResponse = APIResponse<Data1>

export interface Data1 {
    total: number
    activeManagers: number
    deactivatedManagers: number
    suspendManagers: number
}
