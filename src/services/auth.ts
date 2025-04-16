import {
    AgencyRegistrationRequest,
    AgencyRegistrationResponse,
    Jwt,
    SigninRequest,
    RegistrationRequest,
    RegistrationResponse,
    OTPValidationRequest,
    OTPValidationResponse,
    ProfileRequest,
    ProfileResponse,
    resendOTPRequest,
    ChangePasswordRequest,
    ChangePasswordResponse,
    NotificationSettingsRequest,
    NotificationSettingsResponse,
    PublicProfileResponse,
    ClientSigninRequest,
    PortalOTPValidationRequest,
    PortalOTPValidationResponse,
    ClientSigninResponse,
    sendPortalOTPRequest,
} from "type/api/auth.types"
import axiosInstance from "./api.services"

const ENDPOINT = "/user"

interface RequestPasswordRequest {
    emailAddress: string
    newPassword: string
    code: string
}

export const signup = (data: RegistrationRequest) => {
    return axiosInstance.post<RegistrationResponse>(ENDPOINT + "/signup", data)
}
export const verifyOTP = (data: OTPValidationRequest) => {
    return axiosInstance.post<OTPValidationResponse>(
        ENDPOINT + "/otp/validate",
        data
    )
}
export const verifyPortalOTP = (data: PortalOTPValidationRequest) => {
    return axiosInstance.post<PortalOTPValidationResponse>(
        "/portal/auth/validate-otp",
        data
    )
}
export const sendPortalOTP = (data: sendPortalOTPRequest) => {
    return axiosInstance.post<PortalOTPValidationResponse>(
        "/portal/auth/send-otp",
        data
    )
}
export const resendOTP = (data: resendOTPRequest) => {
    return axiosInstance.post<RegistrationResponse>(
        ENDPOINT + "/resend-signup-otp",
        data
    )
}

export const agencySignup = (data: AgencyRegistrationRequest) => {
    return axiosInstance.post<AgencyRegistrationResponse>("/agency", data)
}
export const createProfile = (data: ProfileRequest) => {
    return axiosInstance.put<ProfileResponse>("/profile", data)
}

export const refreshToken = ({ refreshToken }: { refreshToken: string }) => {
    return axiosInstance.post<Jwt>(ENDPOINT + "/refresh-tokens", refreshToken)
}
export const signin = (data: SigninRequest) => {
    return axiosInstance.post<OTPValidationResponse>(ENDPOINT + "/login", data)
}
export const clientSignin = (data: ClientSigninRequest) => {
    return axiosInstance.post<ClientSigninResponse>("/portal/auth/login", data)
}

export const requestForgotPassword = (data: { username: string }) => {
    return axiosInstance.patch<RegistrationResponse>(
        ENDPOINT + "/forget-password",
        data
    )
}

export const resetPassword = (password: RequestPasswordRequest) => {
    return axiosInstance.patch<unknown>(ENDPOINT + "/reset-password", password)
}

export const fetchProfile = async () => {
    const response = await axiosInstance.get<ProfileResponse>(`profile`)
    return response.data
}

export const fetchAgency = async () => {
    const response = await axiosInstance.get<ProfileResponse>(`profile`)
    return response.data
}

export const changePassword = (data: ChangePasswordRequest) => {
    return axiosInstance.patch<ChangePasswordResponse>(
        ENDPOINT + "/change-password",
        data
    )
}

export const updateNotificationSettings = (
    data: NotificationSettingsRequest
) => {
    return axiosInstance.patch<NotificationSettingsResponse>(
        "/profile/notify-settings",
        data
    )
}

export const fetchNotificationSettings = async () => {
    const response = await axiosInstance.get<NotificationSettingsResponse>(
        `profile/notify-settings`
    )
    return response.data
}

export const fetchPublicProfile = async (username: string) => {
    const response = await axiosInstance.get<PublicProfileResponse>(
        `/profile/pub/usr/${username}`
    )
    return response.data
}

export const subscribePushNotifications = async (data: PushSubscription) => {
    const response = await axiosInstance.post(
        `/profile/push-notification/subscribe`,
        data
    )
    return response.data
}

export const unsubscribePushNotifications = async (data: PushSubscription) => {
    const response = await axiosInstance.post(
        `/profile/push-notification/unsubscribe`,
        data
    )
    return response.data
}

export const markNotificationAsRead = async (notificationId: string) => {
    const response = await axiosInstance.patch(
        `/user/notifications/mark-read`,
        { notificationId }
    )
    return response.data
}

export const fetchNotifications = async (page?: string, limit?: string) => {
    const params = new URLSearchParams()

    if (page) params.append("page", page)
    if (limit) params.append("limit", limit)

    const response = await axiosInstance.get(`/user/notifications`, { params })
    return response.data
}

export const uploadProfileImage = (data: FormData) => {
    return axiosInstance.patch<ChangePasswordResponse>(
        "/profile/profile-picture",
        data
    )
}
