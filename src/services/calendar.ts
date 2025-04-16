import axiosInstance from "./api.services"
import { CreateEventRequest, CreateEventResponse } from "../type/api/event.types"


export const fetchEvents = async (filters?: {
    startDate?: string;
    endDate?: string;
    city?: string;
    country?: string;
    perPage?: number;
    page?: number;
    talentIDs?: string[];
}) => {
    const cleanedFilters = Object.fromEntries(
        Object.entries(filters || {}).filter(
            ([, value]) => value !== '' && (Array.isArray(value) ? value.length : value)
        )
    );

    const response = await axiosInstance.get<CreateEventResponse>(`/event`, {params: cleanedFilters})
    return response.data
}

export const fetchEventsByTalentId = async ({talentID, filters}:{talentID:string, filters: any}) => {
    const response = await axiosInstance.get<CreateEventResponse>(`/event`, {params: {
        talentIDs: [talentID],
        ...filters
    }})
    return response.data
}

// export const fetchSingleEvents = async (calendarId:string) => {
//     const response = await axiosInstance.get<Results[]>(`/calendar/${calendarId}`)
//     return response.data
// }

export const createEvent =(data:CreateEventRequest)=>{
    return axiosInstance.post<CreateEventResponse>("/event",
        data 
    );
};

export const deleteEvent = async (calendarId:string) => {
    const response = await axiosInstance.delete<{code:string, message:string}>(`/event/${calendarId}`)
    return response.data
}