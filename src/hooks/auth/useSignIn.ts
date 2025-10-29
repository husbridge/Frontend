import { showNotification } from "@mantine/notifications"
import { setAccessToken } from "@services/api.services"
import { clientSignin, signin } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { type Error } from "../../type/api"
import useAuth from "./useAuth"

export function useSignin() {
    const { dispatch } = useAuth()

    const location = useLocation()
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: signin,
        onSuccess: async ({ data }) => {
            if (data.data !== null) {
                setAccessToken(data.data?.accessToken)

                // Wait for the status check to complete
                setTimeout(() => {
                    const userData = {
                        ...data.data,
                        // hasPaymentMethod: hasPaymentMethod || false,
                    }

                    // For non-talent users, allow access to the dashboard
                    // if (data.data.userType !== "talent") {
                    dispatch({
                        type: "SET_USER_DATA",
                        payload: userData,
                    })
                    localStorage.setItem("user", JSON.stringify(userData))

                    const from = location.state?.from?.pathname || "/dashboard"
                    navigate(from, { replace: true })
                    return
                    // }
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

    return { ...mutation }
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
