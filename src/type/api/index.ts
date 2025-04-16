import { AxiosError } from "axios"

export type Error = AxiosError<{ message: string }>
export interface APIResponse<T> {
    statusCode: number
    message: string
    hasError: boolean
    data: T
}