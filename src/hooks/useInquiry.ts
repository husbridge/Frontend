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

type FileMeta = {
    name: string
    size: number
    type: string
    lastModified: number
}

interface InquiryStore {
    document: File | null
    documentMeta: FileMeta | null
    setDocument: (document: File | null) => void
    clearDocument: () => void
}

const useInquiryStore = create<InquiryStore>()(
    persist(
        (set) => ({
            document: null,
            documentMeta: null,
            setDocument: (document: File | null) => {
                set(() => ({
                    document,
                    documentMeta: document
                        ? {
                              name: document.name,
                              size: document.size,
                              type: document.type,
                              lastModified: document.lastModified,
                          }
                        : null,
                }))
            },
            clearDocument: () => set({ document: null, documentMeta: null }),
        }),
        // {
        //     name: "inquiry-document-meta",
        //     partialize: (state) => ({
        //         fileMeta: state.documentMeta, 
        //     }),
        // }
        {
            name: "inquiry-store",
            storage: {
                getItem: (key) => {
                    const value = localStorage.getItem(key)
                    return value ? JSON.parse(value) : null
                },
                setItem: (key, value) => {
                    localStorage.setItem(key, JSON.stringify(value.state.documentMeta))
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
