import { MessagingResponse } from "type/api/messaging.types"
import { axiosMessagingInstance } from "./api.services"


export const fetchChats = async (roomId: string, access: string) => {
    const response = await axiosMessagingInstance.get<MessagingResponse>(
        `/chats/${roomId}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        }
    )
    return response.data
}

export const getFileMetadata = async (key: string, access: string) => {
    const response = await axiosMessagingInstance.get(
        `/files/metadata/${key}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    );
    return response.data
}

export const getDownloadUrl = async (key: string, access: string) => {
    const response = await axiosMessagingInstance.get(
        `/files/download/${key}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    );
    return response.data
}

export const getShareableUrl = async (key: string, access: string) => {
    const response = await axiosMessagingInstance.get(
        `/aws/share/${key}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    );
    return response.data
}
