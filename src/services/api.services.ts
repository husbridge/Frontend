import axios from "axios"
import { Error } from "../type/api"

export const frontendUrl = () => window.location.origin

const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://husridge-server.onrender.com/api/"

export const MESSAGING_BASE_URL =
    import.meta.env.VITE_MESSAGING_BASE_URL ||
    "https://messaging-chat-new.onrender.com"

let EXPIRYINTERCEPTOR: number

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

export const axiosMessagingInstance = axios.create({
    baseURL: MESSAGING_BASE_URL,
})

export const requestInterceptor = (token: string) => {
    axiosInstance.interceptors.request.use((config) => {
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    })
}
export const setAccessToken = (token: string) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${token}`
    }
}
export const removeAccessToken = () => {
    axiosInstance.defaults.headers.common["Authorization"] = undefined
}
export const setExpiryInterceptor = (callback: () => Promise<void>) => {
    if (EXPIRYINTERCEPTOR)
        axiosInstance.interceptors.request.eject(EXPIRYINTERCEPTOR)
    EXPIRYINTERCEPTOR = axiosInstance.interceptors.response.use(
        null,
        (error: Error) => {
            const errorMessage = error.message || ""

            if (
                errorMessage.includes("unauthorized") ||
                errorMessage.includes("Request failed with status code 401")
            ) {
                callback()
                    .then(() => null)
                    .catch(() => null)
            }
            return Promise.reject(error)
        }
    )
}

export default axiosInstance
