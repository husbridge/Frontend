import React, { useEffect, useReducer } from "react"
import { reducer } from "./utils/reducer"
import { AuthState, AuthActionType } from "../type/api/auth.types"
import { setAccessToken, setExpiryInterceptor } from "@services/api.services"
import { useNavigate } from "react-router-dom"
// import { showNotification } from "@mantine/notifications"
//import { useQueryClient } from "@tanstack/react-query"

//const storedJwt = localStorage.getItem("jwt")
const storedUser = localStorage.getItem("user")
export const AuthContext = React.createContext<{
    state: AuthState
    dispatch: React.Dispatch<AuthActionType>
}>({
    state: {
        isAuthenticated: false,
        user: null,
    },
    dispatch: () => {},
})

const initialState: AuthState = {
    isAuthenticated: !!storedUser,
    user: storedUser ? JSON.parse(storedUser) : null,
}

export default function AuthContextProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const navigate = useNavigate()
    //const queryClient = useQueryClient()
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (state.user?.accessToken) {
            setAccessToken(state.user?.accessToken)
        }
        setExpiryInterceptor(async () => {
            // A 401 only means "your session expired" when there was a
            // session to begin with. Without this guard, ANY 401 from
            // ANY anonymous request anywhere in the app — e.g. the
            // anonymous-inquiry flow's POST /portal/inquires, now
            // authenticated via a token minted right after OTP
            // verification rather than a login — would redirect an
            // anonymous visitor to /login and clear a session that never
            // existed, silently discarding whatever they were doing
            // (their inquiry, in that case) with no visible connection
            // between the redirect and the failure.
            if (!state.user) return
            if (state.user?.userType === "client") {
                navigate("/client-login")
            } else {
                navigate("/login")
            }
            dispatch({ type: "CLEAR_USER_DATA" })
            localStorage.removeItem("user")
        })
    }, [state.user?.accessToken, setAccessToken])

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
