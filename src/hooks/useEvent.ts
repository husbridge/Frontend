import { fetchEvents, fetchEventsByTalentId } from "@services/calendar"

import { useQuery } from "@tanstack/react-query"

// Capped (retry: 1, not TanStack's default 3 + exponential backoff) after
// a production incident where a 500 on a similarly-critical endpoint
// (GET /profile) caused an indefinite retry storm — applying the same cap
// here since events queries carry the same risk.
const useGetEvents = (id?: string) => {
    const result = useQuery({
        queryKey: ["events"],
        queryFn: () => fetchEvents(),
        enabled: id ? false:true ,
        retry: 1,
    })
    return result
}

const useGetEventsByTalentId = ({talentID, filters}:{talentID: string, filters?: any}) => {
    const result = useQuery({
        queryKey: ["events", {talentID}, filters],
        queryFn: () => fetchEventsByTalentId({talentID, filters}),
        enabled: talentID ? true : false,
        retry: 1,
    })
    return result
}

export { useGetEvents, useGetEventsByTalentId }
