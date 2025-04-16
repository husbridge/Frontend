import { AuthState, AuthActionType } from "../../type/api/auth.types"
import { Data } from "../../type/api/auth.types"

const reducer = (state: AuthState, action: AuthActionType): AuthState => {
    switch (action.type) {
        case "SET_USER_DATA":
            return {
                ...state,
                isAuthenticated: true,
                user: action?.payload as Data,
            
            }
            case "REFRESH_TOKEN":
            return {
                ...state,
                isAuthenticated: true,
                user: action?.payload as Data,
            }
        case "UPDATE_USER_DATA":
            return {
                ...state,
                isAuthenticated: true,
                user: action?.payload as Data,
            }

        case "CLEAR_USER_DATA":
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }

        default:
            return state
    }
}

export  {reducer}