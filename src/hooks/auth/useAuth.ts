import { useContext } from "react";
import { AuthContext } from "@contexts/authContext";

export default function useAuth(){
    const auth = useContext(AuthContext)
    return auth
}