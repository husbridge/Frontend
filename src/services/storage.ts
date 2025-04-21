import { showNotification } from "@mantine/notifications"
import axiosInstance from "./api.services"

export const uploadFile = async (
    file: FormData,
    onProgress?: (percent: number) => void
) => {
    const token = JSON.parse(localStorage.getItem("user") || "{}").accessToken
    const response = await axiosInstance.post("storage/upload", file, {
        headers: {
            Authorization: `Bearer ${token}`,
            contentType: "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                )
                onProgress(percent)
            }
        },
    })

    if (response.status >= 300) {
        showNotification({
            title: "Error",
            message: response.data.message || "Failed to upload file",
            color: "red",
        })
        onProgress?.(0)
        return null
    }

    return response.data.data
}
