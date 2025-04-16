import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "@services/messaging";
import useAuth from "./auth/useAuth";

export const useGetChats=(id: string)=>{
    const {state}=useAuth()
    const result= useQuery({
         queryKey:["chats", id],
         queryFn:()=> fetchChats(id, state.user?.accessToken||""),
         enabled: id? true:false
    })
    return result;
}
