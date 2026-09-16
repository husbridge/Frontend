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
    data: {accessToken: string, id: string}
}
// Buyer self-signup (Phase 1 Step 3 backend, wired to the UI here as part
// of the Book/Message CTA flow). Signup itself issues no token — it just
// stages the account and emails an OTP; the token only comes from
// clientSignin, called after validate-otp confirms the code.
export interface ClientSignupRequest {
    name: string
    email: string
    password: string
    organisationName?: string
    phone?: string
}
export interface ClientSignupResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: { id: string; email: string } | null
}
// GET /portal/auth/me — the authenticated buyer's own account fields, for
// prefilling the inquiry forms (not their inquiry list — that's
// ClientSigninResponse's dashboard cousin, fetchPortalInquiries).
export interface OwnPortalProfileResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: {
        name: string
        email: string
        phoneNumber: string
        organisationName: string
    } | null
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
    id: string
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
    hasPaymentMethod?: boolean
}
// Phase 1 Step 2 structured profile fields (husridge-server IUpdateProfile).
// `PUT /profile` (and `/profile/:userId` for a manager) merges field by
// field — a request that only sets a subset of these leaves the rest
// untouched server-side, which is what lets the Step 5 wizard PUT one step
// at a time without clobbering the others.
export type SocialPlatform =
    | "instagram"
    | "tiktok"
    | "twitter"
    | "youtube"
    | "website"
    | "other"

export type AudienceBand =
    | ""
    | "under_1k"
    | "1k_10k"
    | "10k_50k"
    | "50k_100k"
    | "100k_500k"
    | "500k_plus"

export interface SocialAccount {
    _id?: string
    platform: SocialPlatform
    handle?: string
    url?: string
    audienceBand?: AudienceBand
}

export interface Brand {
    _id?: string
    name: string
    logoUrl?: string
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
    bio?: string
    socialLinks?: {
        instagram?: string
        tiktok?: string
        twitter?: string
        youtube?: string
        website?: string
    }
    tags?: string[]
    professionalTitle?: string
    shortBio?: string
    longBio?: string
    primaryCategory?: string
    categories?: string[]
    skills?: string[]
    city?: string
    serviceAreas?: string[]
    socialAccounts?: SocialAccount[]
    yearsExperience?: number
    brands?: Brand[]
}

// Wire shape for ProfileResponse.data.missingFields (husridge-server
// ProfileDto, Step 5 review round: `{key, label}` — no `present` (already
// pre-filtered to missing-only) and `key` not `field`. Render verbatim,
// don't re-map field names to labels client-side.
export interface MissingFieldItem {
    key: string
    label: string
}

export type PortfolioMediaType = "image" | "video"
export type PortfolioMediaProvider =
    | "cloudinary"
    | "youtube"
    | "instagram"
    | "tiktok"
export type PortfolioVisibility = "public" | "hidden"

export interface PortfolioMediaEntry {
    url: string
    type: PortfolioMediaType
    thumbnailUrl?: string
    provider: PortfolioMediaProvider
}

export interface PortfolioItem {
    _id: string
    media: PortfolioMediaEntry[]
    title: string
    description: string
    role: string
    clientName: string
    category: string
    date: string
    sortOrder: number
    visibility: PortfolioVisibility
    createdBy: string
}

export interface PortfolioItemRequest {
    title?: string
    description?: string
    role?: string
    clientName?: string
    category?: string
    date?: string
    visibility?: PortfolioVisibility
    // For an embed (YouTube/Instagram/TikTok) item — omit when uploading an
    // image file instead (sent as the `media` multipart field).
    embedUrl?: string
    embedThumbnailUrl?: string
    embedProvider?: PortfolioMediaProvider
}

// Phase 2 (PHASE2_DESIGN.md) — husridge-server's PackageDto. price is
// always an integer in the smallest unit of `currency` (kobo for NGN),
// never a float — PackageEditor converts to/from the major unit for
// display, this type stores the wire shape as-is.
export interface Package {
    _id: string
    category: string
    label: string
    description: string
    price: number
    currency: string
    deliverables: string[]
    turnaroundDays: number
    revisions: number
    terms: string
    sortOrder: number
    active: boolean
    archivedAt: string | null
    createdBy: string
}

export interface PackageRequest {
    category?: string
    label?: string
    description?: string
    price?: number
    currency?: string
    deliverables?: string[]
    turnaroundDays?: number
    revisions?: number
    terms?: string
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
        bio?: string
        socialLinks?: {
            instagram?: string
            tiktok?: string
            twitter?: string
            youtube?: string
            website?: string
        }
        tags?: string[]
        // TEMP (v0) — being retired in favor of portfolioItems below. Only
        // read by the legacy Settings "Add Photo" flow, which this Step 5
        // work migrates off it (see portfolioInformation.tsx).
        portfolioMedia?: {
            _id: string
            url: string
            type: "image"
            caption?: string
            order?: number
            uploadedAt?: string
        }[]
        professionalTitle?: string
        shortBio?: string
        longBio?: string
        primaryCategory?: string
        categories?: string[]
        skills?: string[]
        city?: string
        serviceAreas?: string[]
        socialAccounts?: SocialAccount[]
        yearsExperience?: number
        brands?: Brand[]
        isPublished?: boolean
        visibility?: string
        completenessScore?: number
        missingFields?: MissingFieldItem[]
        nextBestAction?: string
        publishedAt?: string
        viewCount?: number
        portfolioItems?: PortfolioItem[]
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
        // Phase 2 (PHASE2_DESIGN.md) — husridge-server's ProfilePublicDto
        // now includes this on both public profile routes (the whitelisted
        // one and this legacy one). Used to resolve a booking flow's
        // ?packageId into a display summary (label/price/deliverables) —
        // never re-trusted for anything beyond display, since the actual
        // create-inquiry call is validated server-side regardless.
        packages?: PublicPackage[]
    }
}

export interface PublicPackage {
    _id: string
    category: string
    label: string
    description: string
    image: string
    price: number
    currency: string
    deliverables: string[]
    turnaroundDays: number
    revisions: number
    terms: string
    sortOrder: number
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
