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
    PortfolioItemRequest,
} from "type/api/auth.types"
import axiosInstance from "./api.services"

// Portfolio/publish item responses reuse ProfileResponse's shape for
// single-object responses (`data` is one PortfolioItem) or a list.
interface PortfolioItemResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: NonNullable<ProfileResponse["data"]["portfolioItems"]>[number] | null
}
interface PortfolioListResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: NonNullable<ProfileResponse["data"]["portfolioItems"]>
}
// publish()/unpublish() return the full ProfileDto on success, but on the
// "missing required fields" failure it's just `{missingFields: string[]}`
// (bare field keys, no labels — GET /profile's richer, labeled
// missingFields is what the completeness widget should render instead;
// this is only a same-tick confirmation of what blocked THIS attempt).
interface PublishResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: ProfileResponse["data"] | { missingFields: string[] } | null
}

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

export const uploadPortfolioMedia = (data: FormData) => {
    return axiosInstance.post<ProfileResponse>("/profile/portfolio-media", data)
}

export const deletePortfolioMedia = (mediaId: string) => {
    return axiosInstance.delete<ProfileResponse>(
        `/profile/portfolio-media/${mediaId}`
    )
}

// --- Phase 1 Step 5: profile setup wizard, publish/unpublish, portfolio ---
// manager. Every function below takes an optional `userId` — omitted for a
// talent/agency editing their own profile, or set to a roster talent's id
// when a manager is editing on their behalf (husridge-server's
// canEditTalentProfile enforces the actual permission check server-side;
// the frontend just calls the `:userId`-suffixed route and surfaces
// whatever error, e.g. 403, comes back).
const profilePath = (userId?: string) =>
    userId ? `/profile/${userId}` : "/profile"

export const fetchProfileFor = async (userId?: string) => {
    const response = await axiosInstance.get<ProfileResponse>(
        profilePath(userId)
    )
    return response.data
}

export const updateProfileStep = (data: ProfileRequest, userId?: string) => {
    return axiosInstance.put<ProfileResponse>(profilePath(userId), data)
}

export const publishProfile = (userId?: string) => {
    return axiosInstance.post<PublishResponse>(`${profilePath(userId)}/publish`)
}

export const unpublishProfile = (userId?: string) => {
    return axiosInstance.post<PublishResponse>(
        `${profilePath(userId)}/unpublish`
    )
}

export const fetchPortfolioItems = async (userId?: string) => {
    const response = await axiosInstance.get<PortfolioListResponse>(
        `${profilePath(userId)}/portfolio`
    )
    return response.data
}

export const createPortfolioItem = (
    data: PortfolioItemRequest,
    file: File | null,
    userId?: string,
    onUploadProgress?: (percent: number) => void
) => {
    const formData = new FormData()
    if (file) formData.append("media", file)
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value))
        }
    })
    return axiosInstance.post<PortfolioItemResponse>(
        `${profilePath(userId)}/portfolio`,
        formData,
        {
            // A hard cap so an upload can never sit indefinitely with no
            // feedback — the v0 portfolio-media UI had exactly this stuck
            // "Uploading..." failure mode with no client-side timeout.
            // Without this, a dropped connection or a hung server-side
            // process leaves the axios promise pending forever.
            timeout: 2 * 60 * 1000,
            onUploadProgress: (event) => {
                if (!onUploadProgress || !event.total) return
                onUploadProgress(Math.round((event.loaded / event.total) * 100))
            },
        }
    )
}

export const updatePortfolioItem = (
    itemId: string,
    data: PortfolioItemRequest,
    userId?: string
) => {
    return axiosInstance.patch<PortfolioItemResponse>(
        `${profilePath(userId)}/portfolio/${itemId}`,
        data
    )
}

export const deletePortfolioItem = (itemId: string, userId?: string) => {
    return axiosInstance.delete<PortfolioItemResponse>(
        `${profilePath(userId)}/portfolio/${itemId}`
    )
}

export const reorderPortfolioItems = (
    orderedItemIds: string[],
    userId?: string
) => {
    return axiosInstance.put<PortfolioListResponse>(
        `${profilePath(userId)}/portfolio/reorder`,
        { orderedItemIds }
    )
}
