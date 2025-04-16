export interface MessagingResponse {
    statusCode: 0
    message: string
    hasError: boolean
    data: Data[]
}

export interface Data {
    _id: string
    userId: string
    senderId: string
    user: string
    message: string
    groupId: string
    date: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface MessageNotification {
    count: number
    senderEmail: string
    chatGroupIds: string
}
