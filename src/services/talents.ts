import axiosInstance from "./api.services"
import { TalentsResponse, CreateTalentRequest, CreateTalentResponse, TalentStatsResponse, assignManagerRequest, IndustriesResponse  } from "type/api/talents.types"

const ENDPOINT = "/admin"
// interface IFilters {  
//     name?:string
//     role?:string
//     sortBy?:string
//     limit?:number
//     page?:number
    
// }
export const fetchTalents = async (filters?: {
    industry?: string;
    startDate?: string;
    endDate?: string;
}) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(
            ([, value]) => value !== '' && (Array.isArray(value) ? value.length : value)
        )
    );
    const response = await axiosInstance.get<TalentsResponse>(`${ENDPOINT}/talents`, {params: cleanedFilters});
    return response.data;
};

export const fetchIndustries = async () => {
    const response = await axiosInstance.get<IndustriesResponse>(ENDPOINT +`/industries`,)
    return response.data
}
export const fetchTalentStats = async () => {
    const response = await axiosInstance.get<TalentStatsResponse>(ENDPOINT +`/talent-stats`,)
    return response.data
}
export const createTalent = (data: CreateTalentRequest) => {
    return axiosInstance.post<CreateTalentResponse>(
        ENDPOINT + "/talents",
        data
    )
}
export const assignManagerToTalent = (data: assignManagerRequest) => {
    return axiosInstance.patch<CreateTalentResponse>(
        ENDPOINT + "/assign-mng-talents",
        data
    )
}
export const editTalent = async({
    id,
    ...data
}: CreateTalentRequest) => {
    return axiosInstance.patch<CreateTalentResponse>(`/talents/${id}`, data)
}