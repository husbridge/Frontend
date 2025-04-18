import axiosInstance from "./api.services"

export const uploadFile = async (file: FormData) => {
    const response = await axiosInstance.post("storage/upload", file, {
        headers: {
            Authorization: "",
            contentType: "multipart/form-data",
        },
    })

    return response
}
