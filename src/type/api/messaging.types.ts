export interface MessagingResponse {
    statusCode: 0
    message: string
    hasError: boolean
    data: Data[]
}

export enum MessageType {
    TEXT = 'text',
    FILE = 'file',
}

interface MessageMetadata {
    contentType: string;
    key: string;
    originalName: string;
    url: string;
}

export interface Data {
    _id: string
    userId: string
    senderId: string
    user: string
    type: MessageType
    metadata: MessageMetadata
    message: string
    roomId: string
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
