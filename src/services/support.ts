import axiosInstance from "./api.services"

export type CreateSupportTicketRequest = {
    email: string
    subject: string
    message: string
    fullName: string
}

export type CreateSupportTicketResponse = {
    success: boolean
    message: string
}

export async function createSupportTicket(
    payload: CreateSupportTicketRequest
): Promise<CreateSupportTicketResponse> {
    const { data } = await axiosInstance.post<CreateSupportTicketResponse>(
        "/support",
        payload
    )
    return data
}
