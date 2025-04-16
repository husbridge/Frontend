import { fetchEvents, fetchEventsByTalentId } from "@services/calendar"

import { useQuery } from "@tanstack/react-query"

const useGetEvents = (id?: string) => {
    const result = useQuery({
        queryKey: ["events"],
        queryFn: () => fetchEvents(),
        enabled: id ? false:true ,
    })
    return result
}

const useGetEventsByTalentId = ({talentID, filters}:{talentID: string, filters?: any}) => {
    const result = useQuery({
        queryKey: ["events", {talentID}, filters],
        queryFn: () => fetchEventsByTalentId({talentID, filters}),
        enabled: talentID ? true : false,
    })
    return result
}

export { useGetEvents, useGetEventsByTalentId }
