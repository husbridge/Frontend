import {
    CreateInquiryRequest,
    CreateInquiryResponse,
    InquiryResponse,
    InquiryStatResponse,
    SendMailRequest,
} from "type/api/inquiry.types"
import axiosInstance from "./api.services"

import { AxiosResponse } from "axios"

export const fetchInquiries = async (filters?: any) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(
            ([, value]) =>
                value !== "" && (Array.isArray(value) ? value.length : value)
        )
    )
    const response = await axiosInstance.get<InquiryResponse>(`/inquires`, {
        params: cleanedFilters,
    })
    return response.data
}
export const fetchPortalInquiries = async () => {
    const response = await axiosInstance.get<InquiryResponse>(
        `portal/auth/dashboard`
    )
    return response.data
}

export const fetchInquiriesByTalentId = async (id: string, filters: any) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(
            ([, value]) =>
                value !== "" && (Array.isArray(value) ? value.length : value)
        )
    )
    const response = await axiosInstance.get<InquiryResponse>(
        `/portal/inquires/${id}`,
        { params: cleanedFilters }
    )
    return response.data
}
export const fetchInquiriesByManagerId = async (id: string) => {
    const response = await axiosInstance.get<InquiryResponse>(
        `/portal/inquires-mng/${id}`
    )
    return response.data
}

// interface CreateInquiryRequest {
//     // Add other fields as needed
//     document?: File
// }

// interface CreateInquiryResponse {
//     // Add response type fields
// }

export const createInquiry = async (
    data: CreateInquiryRequest
): Promise<AxiosResponse<CreateInquiryResponse>> => {
    // Send the inquiry data to the backend
    return axiosInstance.post<CreateInquiryResponse>("/portal/inquires", data)
}

// export const createInquiry = (data: CreateInquiryRequest) => {
// const { document } = useInquiryStore.getState()
// console.log(document, data)
//     return axiosInstance.post<CreateInquiryResponse>("/portal/inquires", data)
// }

export const sendMail = (data: SendMailRequest) => {
    return axiosInstance.post<unknown>("/mail/send", data)
}

export const sendInquiryMail = (
    data: SendMailRequest & { file?: File | null }
) => {
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("messageBody", data.messageBody)
    formData.append("subject", data.subject)
    formData.append("isInquiryResponse", String(true))

    if (data.file) {
        formData.append("file", data.file) // Attach the file if provided
    }

    return axiosInstance.post<unknown>("/mail/send", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

export const fetchDashboardStats = async () => {
    const response =
        await axiosInstance.get<InquiryStatResponse>(`/inquires/stats`)
    return response.data
}
