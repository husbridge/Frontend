import axiosInstance from "./api.services"

export const getDownloadUrl = async (path: string, access: string) => {
    const response = await axiosInstance.get(
        `/storage/download/${path}`, // /api/storage/:folder/:key
        {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        }
    )
    return response.data
}

export const getFileMetadata = async (path: string, access: string) => {
    const response = await axiosInstance.get(`/storage/metadata/${path}`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    })
    return response.data
}

export const getShareableUrl = async (path: string, access: string) => {
    console.log("share triggered")
    console.log("path", path)
    const response = await axiosInstance.get(`/storage/share/${path}`, {
        headers: {
            Authorization: `Bearer ${access}`,
        },
    })
    console.log("share response", response.data)
    return response.data
}
