import { useMutation } from "@tanstack/react-query"
import { signin, clientSignin } from "@services/auth"
import { type Error } from "../../type/api"
import { showNotification } from "@mantine/notifications"
import useAuth from "./useAuth"
import { setAccessToken } from "@services/api.services"
import { useNavigate, useLocation } from "react-router-dom"
import { initiatePayment, getPaymentStatus } from "@services/payment"
import { useState, useRef, useEffect } from "react"

export function useSignin() {
    const { dispatch } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'initiating' | 'pending' | 'success' | 'failed'>('idle')
    const [authorizationUrl, setAuthorizationUrl] = useState<string>('')
    const [pendingUserData, setPendingUserData] = useState<any>(null)
    const pollIntervalRef = useRef<NodeJS.Timeout>()

    const { mutate: initiatePaymentMutation, isPending: isInitiatingPayment } = useMutation({
        mutationFn: initiatePayment,
        onSuccess: (data) => {
            const url = data?.data?.data?.authorization_url

            if (url) {
                setAuthorizationUrl(url)
                setPaymentStatus('pending')
                window.open(url, '_blank', 'noopener,noreferrer')
                startPaymentPolling()
            } else {
                showNotification({
                    title: "Error",
                    message: "Failed to get payment authorization URL",
                    color: "red",
                })
                setPaymentStatus('failed')
            }
        },
        onError: (err: Error) => {
            showNotification({
                title: "Payment Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
            setPaymentStatus('failed')
        },
    })

    const startPaymentPolling = () => {
        pollIntervalRef.current = setInterval(() => {
            checkPaymentStatus()
        }, 3000)
    }

    const stopPaymentPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = undefined
        }
    }

    const checkPaymentStatus = async () => {
        try {
            const response = await getPaymentStatus()
            const status = response?.data.data.hasPaymentMethod
            if (status) {
                setPaymentStatus('success')
                stopPaymentPolling()
                
                if (pendingUserData) {
                    const userData = {
                        ...pendingUserData,
                        hasPaymentMethod: true // Update to reflect payment completion
                    }
                    
                    dispatch({
                        type: "SET_USER_DATA",
                        payload: userData,
                    })
                    localStorage.setItem("user", JSON.stringify(userData))
                    
                    const from = location.state?.from?.pathname || "/dashboard"
                    navigate(from, { replace: true })
                }
            }
        } catch (error) {
            console.error('Error checking payment status:', error)
        }
    }

    const retryPayment = async () => {
        try {
            const response = await getPaymentStatus()
            const hasPaymentMethod = response?.data.data.hasPaymentMethod

            if (hasPaymentMethod) {
                setPaymentStatus('success')
                if (pendingUserData) {
                    const userData = {
                        ...pendingUserData,
                        hasPaymentMethod: true
                    }
                    
                    dispatch({
                        type: "SET_USER_DATA",
                        payload: userData,
                    })
                    localStorage.setItem("user", JSON.stringify(userData))
                    
                    const from = location.state?.from?.pathname || "/dashboard"
                    navigate(from, { replace: true })
                }
            } else {
                setPaymentStatus('initiating')
                initiatePaymentMutation({ callback_url: `${window.location.origin}/payment-callback` })
            }
        } catch (error) {
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
                
                if (data.data.hasPaymentMethod) {
                    const userData = {
                        ...data.data,
                        hasPaymentMethod: data.data.hasPaymentMethod || false
                    }
                    
                    dispatch({
                        type: "SET_USER_DATA",
                        payload: userData,
                    })
                    localStorage.setItem("user", JSON.stringify(userData))
                    
                    const from = location.state?.from?.pathname || "/dashboard"
                    navigate(from, { replace: true })
                } else {
                    setPaymentStatus('initiating')
                    initiatePaymentMutation({ callback_url: `${window.location.origin}/payment-callback` })
                }
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

    // Cleanup effect
    useEffect(() => {
        return () => {
            stopPaymentPolling()
        }
    }, [])

    return {
        ...mutation,
        paymentStatus,
        authorizationUrl,
        isInitiatingPayment,
        retryPayment
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