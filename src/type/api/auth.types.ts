export interface RegistrationRequest {
    emailAddress: string
    password: string
    fullName?: string
    userType: "admin" | "manager" | "talent" | "agency"
}
export interface RegistrationResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: null
}

export interface AgencyRegistrationRequest {
    agencyName: string
    shortDescription?: string
    longDescriptions?: {
        title: string
        subTitle: string
        description: string
    }
    regNumber: string
    industry: string
    address: string
    state: string
    country: string
}
export interface AgencyRegistrationResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: {
        agencyName: string
        shortDescription?: string
        longDescriptions?: {
            title: string
            subTitle: string
            description: string
        }
        regNumber: string
        registrationStage: string
        industry: string
        address: string
        state: string
        country: string
    }
}
export interface resendOTPRequest {
    username: string
}
export interface ClientSigninResponse{
    statusCode: number 
    message: string 
    hasError: boolean 
    data: {accessToken: string}
}
export interface OTPValidationRequest {
    username: string
    code: string
}
export interface PortalOTPValidationRequest {
    email: string
    code: string
}
export interface sendPortalOTPRequest {
    email: string
    name: string
}
export interface OTPValidationResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: Data
}
export interface PortalOTPValidationResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: null
}
export interface Data {
    accessToken: string
    refreshToken: string
    profilePhotoUrl: string
    fullName: string
    firstName: string
    lastName: string
    registrationStage: string
    isVerified: boolean
    permissions: string[]
    userType: "admin" | "manager" | "talent" | "agency"| "client"
    uniqueUsername: string
    userStatus: string
    _id?: string
    hasAgency?: boolean
    agency?: any
}
export interface ProfileRequest {
    fullName?: string
    firstName?: string
    lastName?: string
    verificationTypeValue?: string
    verificationType?: string
    emailAddress?: string
    phoneNumber?: string
    gender?: string
    dateOfBirth?: string
    stageName?: string
    industry?: string
    address?: string
    postCode?: string
    state?: string
    country?: string
    geolocation?: {
        latitude?: number
        longitude?: number
    }
}
export interface ProfileResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: {
        _id: string
        profileUrl: string
        fullName: string
        firstName: string
        lastName: string
        verificationTypeValue?: string
        verificationType?: string
        emailAddress?: string
        userType: "admin" | "manager" | "talent" | "agency"|"client"
        phoneNumber?: string
        gender?: string
        dateOfBirth?: string
        stageName: string
        registrationStage:
            | "profile"
            | "agency"
            | "manager"
            | "completed"
            | "talent"
            | ""
        industry?: string
        address?: string
        postCode?: string
        state?: string
        country?: string
        uniqueUsername: string
        userStatus: string
        geolocation?: {
            latitude?: number
            longitude?: number
        }
        agency: {
            _id: string
            agencyName: string
            regNumber: string
            industry: string
            address: string
            country: string
            state: string
            shortDescription: string
            staffs: Staffs[];
        }
        managing: ProfileResponse[]
    }
}

export interface Staffs {
    _id: string
    profileUrl: string
    fullName: string
    firstName: string
    lastName: string
    emailAddress: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
    address: string
    postCode: string
    state: string
    country: string
    geolocation: {
        latitude: number
        longitude: number
    }
    enableTwoFA: boolean
    isVerified: boolean
    agency: null
    manager: null
    managing: []
    permissions: []
    verificationType: string
    verificationTypeValue: string
    industry: string
    stageName: string
    registrationStage: string
    userType: string
    uniqueUsername: string
}

export interface PublicProfileResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: {
        _id: string
        profileUrl: string
        fullName: string
        firstName: string
        lastName: string
        gender: string
        isVerified: true
        agency: {
            _id: string
            agencyName: string
            regNumber: string
            industry: string
            address: string
            country: string
            state: string
            shortDescription: string
            longDescriptions: {
                title: string
                subTitle: string
                description: string
                _id: string
            }
            staffs: string[]
        }
        manager: Data
        industry: string
        stageName: string
    }
}
export interface NotificationSettingsResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: {
        emailNotification: boolean
        eventsNotification: boolean
        inquiriesNotification: boolean
        messagesSMSNotification: boolean
        productTipAndPromotionNotification: boolean
    }
}
export interface NotificationSettingsRequest {
    emailNotification?: boolean
    eventsNotification?: boolean
    inquiriesNotification?: boolean
    messagesSMSNotification?: boolean
    productTipAndPromotionNotification?: boolean
}



export interface ChangePasswordRequest {
    oldPassword: string
    newPassword: string
}
export interface ChangePasswordResponse {
    statusCode: number
    message: string
    hasError: boolean
    data?:string
}

export interface NotificationsResponse {
    _id: string;
    userId: string;
    title: string;
    content: string;
    type: string;
    isRead: boolean;
    metadata: {
        inquiryType: string;
        inquiryId: string;
    };
    createdAt: string; 
    updatedAt: string;
}
export interface User {
    id: number
    email: string
    fullName: string
    mobileNumber: string
    verificationType: string
    role: string
}
export interface Jwt {
    access: { token: string; expires: Date }
    refresh: {
        token: string
        expires: Date
    }
}
export interface ClientSigninRequest{
    email: string
    password: string
}

export interface SigninRequest {
    username: string
    password: string
}
export type RefreshResponse = Jwt
export type AuthState = {
    isAuthenticated: boolean
    user: Data | null
}
export type AuthActionType = {
    type:
        | "SET_USER_DATA"
        | "UPDATE_USER_DATA"
        | "CLEAR_USER_DATA"
        | "SET_DOCS_DATA"
        | "REFRESH_TOKEN"
    payload?: Data
}
