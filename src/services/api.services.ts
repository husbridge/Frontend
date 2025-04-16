import axios from "axios"
import { Error } from "../type/api"

// const BASE_URL = "https://husridge-server.onrender.com/api/" // import.meta.env.VITE_BASE_URL
const BASE_URL = "http://localhost:8084/api/"

const MESSAGING_BASE_URL = "https://messaging-chat.onrender.com/api" //import.meta.env.VITE_MESSAGING_API_URL
// const MESSAGING_BASE_URL = "http://localhost:3000/api/"

let EXPIRYINTERCEPTOR: number

const axiosInstance = axios.create({
    baseURL: BASE_URL,
})

export const axiosMessagingInstance = axios.create({
    baseURL: MESSAGING_BASE_URL,
})

// axiosInstance.interceptors.request.use(
//     async (config) => {
//         // Get access token from your authentication context
//         const { state } = useAuth()

//         if (state.jwt) {
//             config.headers.Authorization = `Bearer ${state.jwt.access.token}`
//         }
//         return config
//     },
//     (error) => {
//         return Promise.reject(error)
//     }
// )
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
