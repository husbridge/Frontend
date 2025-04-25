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
