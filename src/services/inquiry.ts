import { useInquiryStore } from "@hooks/useInquiry"
import axiosInstance from "./api.services"
import {
    CreateInquiryRequest,
    CreateInquiryResponse,
    InquiryResponse,
    SendMailRequest,
    InquiryStatResponse,
} from "type/api/inquiry.types"

import { AxiosResponse } from "axios"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

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

const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
    },
    maxAttempts: 3,
})

export const createInquiry = async (
    data: CreateInquiryRequest
): Promise<AxiosResponse<CreateInquiryResponse>> => {
    const { document, setDocument } = useInquiryStore.getState()
    let uploadedDocumentKey: string | undefined
    console.log(import.meta.env.VITE_AWS_REGION, document)
    if (document) {
        try {
            // Generate a unique key for the file
            const fileExtension = document.name.split(".").pop()
            const uniqueKey = `inquiries/${Date.now()}~~${document.size}~~${document.name}.${fileExtension}`

            // Upload to S3
            await s3Client.send(
                new PutObjectCommand({
                    Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
                    Key: uniqueKey,
                    Body: document,
                    ContentType: document.type,
                    Metadata: {
                        filename: document.name,
                        size: document.size.toString(),
                    },
                })
            )
            setDocument(null)
            uploadedDocumentKey = uniqueKey
        } catch (error) {
            console.error("Error uploading document to S3:", error)
            throw new Error("Failed to upload document")
        }
    }

    // Prepare the final data with document key if available
    const finalData = {
        ...data,
        attachDocument: uploadedDocumentKey,
    }

    // Send the inquiry data to the backend
    return axiosInstance.post<CreateInquiryResponse>(
        "/portal/inquires",
        finalData
    )
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
