import axiosInstance from "./api.services"
import {
    CreateManagerRequest,
    CreateManagerResponse,
    ManagerResponse,
    SingleManagerResponse,
    ManagerStatsResponse,
} from "type/api/manager.types"

const ENDPOINT = "/admin"

export const fetchManagers = async (filters?: any) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(
            ([, value]) => value !== '' && (Array.isArray(value) ? value.length : value)
        )
    );
    const response = await axiosInstance.get<ManagerResponse>(
        ENDPOINT + `/manager`,
        { params: cleanedFilters }
    )
    return response.data
}
export const fetchSingleUser = async (id: { id: string }) => {
    const response = await axiosInstance.get<SingleManagerResponse>(
        `/profile/${id.id}`
    )
    return response.data
}

export const createManager = (data: CreateManagerRequest) => {
    return axiosInstance.post<CreateManagerResponse>(
        ENDPOINT + "/manager",
        data
    )
}

export const suspendManager = (data: { managerId: string }) => {
    return axiosInstance.patch<CreateManagerResponse>(
        ENDPOINT + "/manager/suspend",
        data
    )
}

export const deactivateManager = (data: { managerId: string }) => {
    return axiosInstance.patch<CreateManagerResponse>(
        ENDPOINT + "/manager/deactivate",
        data
    )
}
export const activateManager = (data: { managerId: string }) => {
    return axiosInstance.patch<CreateManagerResponse>(
        ENDPOINT + "/manager/activate",
        data
    )
}

export const fetchManagerStats = async () => {
    const response = await axiosInstance.get<ManagerStatsResponse>(
        ENDPOINT + `/mng-stats`
    )
    return response.data
}

export const reactivateManager = (data: {managerId:string}) => {
    return axiosInstance.patch<CreateManagerResponse>(
        ENDPOINT + "/manager/activate",
        data
    )
}
