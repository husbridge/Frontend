import { MessagingResponse } from "type/api/messaging.types"
import { axiosMessagingInstance } from "./api.services"


export const fetchChats = async (groupId: string, access:string) => {
   
    const response = await axiosMessagingInstance.get<MessagingResponse>(
        `/chats/${groupId}`,
        {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        }
    )
    return response.data
}
