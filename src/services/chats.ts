import axiosInstance from "./api.services"

const ENDPOINT = "/chats"

const CHATS_BASE_URL = "https://messaging-chat-52d9cbfd4c37.herokuapp.com/api/"
// const CHATS_BASE_URL = "http://localhost:3000/api/"

export const getChatHistory = async (chatId: string) => {
    const response = await axiosInstance.get<any>(ENDPOINT +`/${chatId}`,{
        baseURL: CHATS_BASE_URL
    })
    return response.data
}
