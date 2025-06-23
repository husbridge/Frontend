import { useQuery } from "@tanstack/react-query";
import useAuth from "./auth/useAuth";
import {
    getDownloadUrl,
    getFileMetadata,
    getShareableUrl
} from "@services/messaging";

export const useGetFileUrl = (key: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: ['fileUrl'],
        queryFn: () => getDownloadUrl(key, state.user?.accessToken||"")
    });

    return result;
}

export const useGetFileMetadata = (key: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: ['fileMetadata'],
        queryFn: () => getFileMetadata(key, state.user?.accessToken||"")
    });

    return result;
}

export const useGetShareableUrl = (key: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: ['shareableUrl'],
        queryFn: () => getShareableUrl(key, state.user?.accessToken||"")
    });

    return result;
}