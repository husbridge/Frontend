import { useMutation } from "@tanstack/react-query"
import { signin, clientSignin } from "@services/auth"
import { type Error } from "../../type/api"
import { showNotification } from "@mantine/notifications"
import useAuth from "./useAuth"
import { setAccessToken } from "@services/api.services"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useBilling } from "@contexts/payments/billing"

export function useSignin() {
    const { dispatch } = useAuth()
    const {
        initiatePayment,
        checkPaymentStatus,
        isInitiatingPayment,
        isCheckingStatus,
        hasPaymentMethod,
        isPolling,
        stopPolling,
        error,
    } = useBilling()
    const location = useLocation()
    const navigate = useNavigate()
    const [paymentStatus, setPaymentStatus] = useState<
        "idle" | "initiating" | "pending" | "success" | "failed"
    >("idle")

    const [pendingUserData, setPendingUserData] = useState<any>(null)

    // Watch for hasPaymentMethod changes during polling
    useEffect(() => {
        if (
            hasPaymentMethod &&
            pendingUserData &&
            paymentStatus === "pending"
        ) {
            setPaymentStatus("success")

            const userData = {
                ...pendingUserData,
                hasPaymentMethod: true,
            }

            dispatch({
                type: "SET_USER_DATA",
                payload: userData,
            })
            localStorage.setItem("user", JSON.stringify(userData))

            showNotification({
                title: "Payment Successful",
                message: "Your payment has been confirmed!",
                color: "green",
            })

            const from = location.state?.from?.pathname || "/dashboard"
            navigate(from, { replace: true })
        }
    }, [
        hasPaymentMethod,
        pendingUserData,
        paymentStatus,
        dispatch,
        location,
        navigate,
    ])

    const retryPayment = async () => {
        try {
            setPaymentStatus("pending")
            checkPaymentStatus()

            // Wait a bit for the status to update
            setTimeout(() => {
                if (hasPaymentMethod && pendingUserData) {
                    setPaymentStatus("success")
                    const userData = {
                        ...pendingUserData,
                        hasPaymentMethod: true,
                    }

                    dispatch({
                        type: "SET_USER_DATA",
                        payload: userData,
                    })
                    localStorage.setItem("user", JSON.stringify(userData))

                    const from = location.state?.from?.pathname || "/dashboard"
                    navigate(from, { replace: true })
                } else {
                    setPaymentStatus("initiating")
                    initiatePayment({
                        callback_url: `${window.location.origin}/payment-callback`,
                    })
                    setPaymentStatus("pending")
                }
            }, 1000)
        } catch (error) {
            setPaymentStatus("failed")
            showNotification({
                title: "Error",
                message: "Failed to check payment status",
                color: "red",
            })
        }
    }

    const mutation = useMutation({
        mutationFn: signin,
        onSuccess: async ({ data }) => {
            if (data.data !== null) {
                setAccessToken(data.data?.accessToken)
                setPendingUserData(data.data)

                // Check payment status first
                checkPaymentStatus()

                // Wait for the status check to complete
                setTimeout(() => {
                    const userData = {
                        ...data.data,
                        hasPaymentMethod: hasPaymentMethod || false,
                    }

                    // For non-talent users, allow access to the dashboard
                    if (data.data.userType !== "talent") {
                        dispatch({
                            type: "SET_USER_DATA",
                            payload: userData,
                        })
                        localStorage.setItem("user", JSON.stringify(userData))

                        const from =
                            location.state?.from?.pathname || "/dashboard"
                        navigate(from, { replace: true })
                        return
                    }

                    // For talent users, only allow access if they have a payment method
                    if (hasPaymentMethod) {
                        dispatch({
                            type: "SET_USER_DATA",
                            payload: userData,
                        })
                        localStorage.setItem("user", JSON.stringify(userData))

                        const from =
                            location.state?.from?.pathname || "/dashboard"
                        navigate(from, { replace: true })
                    } else {
                        // If talent user doesn't have a payment method, initiate payment
                        setPaymentStatus("initiating")
                        initiatePayment({
                            callback_url: `${window.location.origin}/payment-callback`,
                        })
                        setPaymentStatus("pending")
                    }
                }, 500)
            }
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (isPolling) {
                stopPolling()
            }
        }
    }, [isPolling, stopPolling])

    return {
        ...mutation,
        paymentStatus,
        retryPayment,
        isInitiatingPayment,
        isCheckingStatus,
        isPolling,
        error,
    }
}

export function useClientSignin() {
    const mutation = useMutation({
        mutationFn: clientSignin,
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    return mutation
}
