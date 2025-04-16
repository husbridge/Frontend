import { useMutation } from "@tanstack/react-query"
import { type Error } from "../../type/api"
import { showNotification } from "@mantine/notifications"
import { requestForgotPassword } from "@services/auth"

export function useForgetPassword() {
    
    
    const mutation = useMutation({
        mutationFn: requestForgotPassword,
        
         onSuccess: (data) => {
            //navigate("/confirm_email_address", {state:{email: variables?.username, previous:"forgetPassword"}})
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })
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
