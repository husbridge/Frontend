import { useMutation } from "@tanstack/react-query"
import { signin, clientSignin } from "@services/auth"
import { type Error } from "../../type/api"
import { showNotification } from "@mantine/notifications"
import useAuth from "./useAuth"
import { setAccessToken } from "@services/api.services"
import { useNavigate, useLocation } from "react-router-dom"

export function useSignin() {
    const { dispatch } = useAuth()
    const location = useLocation()
    const navigate = useNavigate() 
    const from = location.state?.from?.pathname || "/dashboard"
    const mutation = useMutation({
        mutationFn: signin,

        onSuccess: async ({ data }) => {
            if (data.data !== null) {
                setAccessToken(data.data?.accessToken)
                dispatch({
                    type: "SET_USER_DATA",
                    payload: data.data,
                })

                localStorage.setItem("user", JSON.stringify(data.data))
                navigate(from, { replace: true })
                //return;
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
    return mutation
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
