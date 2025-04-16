import { Data } from "type/api/inquiry.types"
import { create } from "zustand"

interface InquiryStore {
    inquiries: Data[]
    openInquiryDetails: boolean
    inquiryDetails: Data | undefined
    setOpenInquiryDetails: (isOpen: boolean) => void
    setInquiryDetails: (details: Data | undefined) => void
    setInquiries: (inquiries: Data[]) => void
}

const useInquiryManagement = create<InquiryStore>((set) => ({
    inquiries: [],
    openInquiryDetails: false,
    inquiryDetails: undefined,
    setOpenInquiryDetails: (isOpen: boolean) =>
        set({ openInquiryDetails: isOpen }),
    setInquiryDetails: (details: Data | undefined) =>
        set({ inquiryDetails: details }),
    setInquiries: (inquiries: Data[]) => set({ inquiries: inquiries }),
}))

export default useInquiryManagement
