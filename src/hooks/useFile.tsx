import { useQuery } from "@tanstack/react-query";
import useAuth from "./auth/useAuth";
import {
    getChatDownloadUrl,
    getFileMetadata,
    getShareableUrl
} from "@services/messaging";

export const useGetChatFileUrl = (path: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: ['fileUrl'],
        queryFn: () => getChatDownloadUrl(path, state.user?.accessToken||"")
    });

    return result;
}

export const useGetFileMetadata = (path: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: ['fileMetadata'],
        queryFn: () => getFileMetadata(path, state.user?.accessToken||"")
    });

    return result;
}

export const useGetShareableUrl = (path: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: ['shareableUrl'],
        queryFn: () => getShareableUrl(path, state.user?.accessToken||"")
    });

    return result;
}