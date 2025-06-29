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

export const getFileMetadata = async (path: string, access: string) => {
    const response = await axiosMessagingInstance.get(
        `/files/metadata/${path}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    );
    return response.data
}

export const getDownloadUrl = async (path: string, access: string) => {
    const response = await axiosMessagingInstance.get(
        `/files/download/${path}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    );
    return response.data
}

export const getShareableUrl = async (path: string, access: string) => {
    const response = await axiosMessagingInstance.get(
        `/files/share/${path}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            }
        }
    );
    return response.data
}
