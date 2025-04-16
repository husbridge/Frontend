import { create } from "zustand"

interface InvoiceStore {
    invoice: File | null
    setInvoice: (file: File | null) => void
}

// Create the notification store
export const useInvoiceStore = create<InvoiceStore>()((set) => ({
    invoice: null,
    setInvoice: (file: File | null) => {
        set(() => ({
            invoice: file,
        }))
    },
}))
