import {
    fetchInquiries,
    fetchInquiriesByTalentId,
    fetchPortalInquiries,
} from "@services/inquiry"
import { useQuery } from "@tanstack/react-query"
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useGetInquiries = ({
    id,
    userType,
    filters,
}: {
    id?: string
    userType?: string
    filters?: any
}) => {
    const result = useQuery({
        queryKey: ["inquiries", filters],
        queryFn: () => fetchInquiries(filters),
        enabled: !id && userType !== "client" ? true : false,
    })
    return result
}

const useGetInquiriesByTalentId = ({
    id,
    filters,
}: {
    id: string
    filters?: any
}) => {
    const result = useQuery({
        queryKey: ["inquiries", id, filters],
        queryFn: () => fetchInquiriesByTalentId(id, filters),
        enabled: id ? true : false,
    })
    return result
}
const useGetPortalInquiries = (userType: string) => {
    const result = useQuery({
        queryKey: ["portalInquiries"],
        queryFn: () => fetchPortalInquiries(),
        enabled: userType === "client" ? true : false,
    })
    return result
}

interface InquiryStore {
    document: File | null
    setDocument: (document: File | null) => void
}

const useInquiryStore = create<InquiryStore>()(
    persist(
        (set) => ({
            document: null,
            setDocument: (document: File | null) => {
                set(() => ({
                    document: document,
                }))
            },
        }),
        {
            name: "inquiry-store",
            storage: {
                getItem: (key) => {
                    const value = localStorage.getItem(key)
                    return value ? JSON.parse(value) : null
                },
                setItem: (key, value) => {
                    localStorage.setItem(key, JSON.stringify(value))
                },
                removeItem: (key) => {
                    localStorage.removeItem(key)
                },
            },
        }
    )
)

export {
    useGetInquiries,
    useGetInquiriesByTalentId,
    useGetPortalInquiries,
    useInquiryStore,
}
