import {
    createContext,
    useContext,
    ReactNode,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react"
import { useMutation } from "@tanstack/react-query"
import PaystackPop from "@paystack/inline-js"

import {
    initiatePayment as initiatePaystackPayment,
    getPaymentStatus,
} from "@services/payment"

type PaymentEventType = "success" | "cancelled" | "error"
type PaymentEventCallback = (type: PaymentEventType, data?: any) => void

interface BillingContextType {
    initiatePayment: (paymentDetails?: Record<string, any>) => void
    checkPaymentStatus: () => void
    startPolling: () => void
    stopPolling: () => void
    onPaymentEvent: (callback: PaymentEventCallback) => () => void
    isInitiatingPayment: boolean
    isCheckingStatus: boolean
    hasPaymentMethod: boolean
    isPolling: boolean
    error: string | null
}

const BillingContext = createContext<BillingContextType | null>(null)

interface BillingProviderProps {
    children: ReactNode
}

function BillingProvider({ children }: BillingProviderProps) {
    const pollingInterval = useRef<NodeJS.Timeout>()
    const [isPolling, setIsPolling] = useState(false)
    const [hasPaymentMethod, setHasPaymentMethod] = useState(false)

    // Mutation for checking payment status
    const {
        mutate: checkPaymentStatusMutate,
        isPending: isCheckingStatus,
        error: statusError,
    } = useMutation({
        mutationFn: getPaymentStatus,
        onSuccess: (response) => {
            const paymentMethodExists =
                response?.data?.data?.hasPaymentMethod ||
                response?.data?.hasPaymentMethod
            setHasPaymentMethod(paymentMethodExists)

            // Auto-stop polling if payment method is confirmed
            if (paymentMethodExists && isPolling) {
                stopPolling()
            }
        },
        onError: (err: any) => {
            console.error("Failed to check payment status:", err.message)
        },
    })

    // Mutation for initiating payment
    const {
        mutate: initiatePaymentMutate,
        isPending: isInitiatingPayment,
        error: initiationError,
    } = useMutation({
        mutationFn: async (paymentDetails?: Record<string, any>) => {
            const response = await initiatePaystackPayment(paymentDetails)
            if (!response.data?.access_code) {
                throw new Error(
                    "Payment access code not found in the server response."
                )
            }
            return response.data
        },
        onSuccess: (data) => {
            const { access_code } = data
            const popup = new PaystackPop()

            popup.resumeTransaction(access_code, {
                onSuccess: (transaction: any) => {
                    console.log("Payment successful:", transaction)
                    // Start polling to verify on backend
                    startPolling()
                },
                onCancel: () => {
                    console.log("Payment cancelled by user")
                    // User closed the popup - stop any polling
                    stopPolling()
                    setHasPaymentMethod(false)
                },
                onError: (error: any) => {
                    console.error("Payment error:", error)
                    // Payment failed - stop polling
                    stopPolling()
                    setHasPaymentMethod(false)
                },
            })
        },
        onError: (err: any) => {
            console.error("Payment initiation failed:", err.message)
        },
    })

    // Start polling function
    const startPolling = useCallback(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
        }

        setIsPolling(true)

        // Initial check
        checkPaymentStatusMutate()

        // Poll every 3 seconds
        pollingInterval.current = setInterval(() => {
            checkPaymentStatusMutate()
        }, 3000)
    }, [checkPaymentStatusMutate])

    // Stop polling function
    const stopPolling = useCallback(() => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current)
            pollingInterval.current = undefined
        }
        setIsPolling(false)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current)
            }
        }
    }, [])

    const getErrorMessage = (error: any): string | null => {
        if (!error) return null
        return (
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred."
        )
    }

    const value: BillingContextType = {
        initiatePayment: initiatePaymentMutate,
        checkPaymentStatus: checkPaymentStatusMutate,
        startPolling,
        stopPolling,
        isInitiatingPayment,
        isCheckingStatus,
        hasPaymentMethod,
        isPolling,
        error: getErrorMessage(initiationError) || getErrorMessage(statusError),
        onPaymentEvent: () => {
            return () => {}
        },
    }

    return (
        <BillingContext.Provider value={value}>
            {children}
        </BillingContext.Provider>
    )
}

function useBilling() {
    const context = useContext(BillingContext)
    if (context === null) {
        throw new Error("useBilling must be used within a BillingProvider")
    }
    return context
}

export { BillingProvider, useBilling }
