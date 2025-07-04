import React, { useEffect, useReducer } from "react"
import { reducer } from "./utils/reducer"
import { AuthState, AuthActionType } from "../type/api/auth.types"
import { setAccessToken, setExpiryInterceptor } from "@services/api.services"
import { useNavigate } from "react-router-dom"
// import { showNotification } from "@mantine/notifications"
//import { useQueryClient } from "@tanstack/react-query"

//const storedJwt = localStorage.getItem("jwt")

const getStoredUser = () => {
    try {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Failed to parse stored user:", error);
        return null;
    }
}

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
    isAuthenticated: !!getStoredUser(),
    user: getStoredUser(),
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
