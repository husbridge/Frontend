import { useMutation, useQuery } from "@tanstack/react-query";
import useAuth from "./auth/useAuth";
import { getChatDownloadUrl } from "@services/messaging";
import {
    getDownloadUrl,
    getFileMetadata,
    getShareableUrl
} from "@services/file";

export const useGetChatFileUrl = (path: string) => {
    const {state}=useAuth()
    const result = useQuery({
        queryKey: [`fileUrl_${path}`],
        queryFn: () => getChatDownloadUrl(path, state.user?.accessToken||"")
    });

    return result;
}

export const useGetFileMetadata = (path: string, opened: boolean = false) => {
    const {state}=useAuth();

    const result = useQuery({
        queryKey: ['fileMetadata'],
        queryFn: () => getFileMetadata(path, state.user?.accessToken||""),
        enabled: opened
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

// Hook for downloading files
export const useDownloadFile = () => {
    const { state } = useAuth();

    return useMutation ({
        mutationFn: async (path: string) => getDownloadUrl(path, state.user?.accessToken || ""),
        onSuccess: (url) => {
            // Create temporary link and trigger download
            const link = document.createElement("a");
            link.href = url;
            link.download = "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        onError: (error) => {
            console.error("Error downloading file:", error);
        }
    });
}

// Hook to get file information from API
export const useFileInfo = (path: string) => {
    const { state } = useAuth();

    const result = useQuery({
        queryKey: ['fileInfo', path],
        queryFn: () => getFileMetadata(path, state.user?.accessToken || ""),
        select: (data) => ({
            fileName: data.datafileName || "",
            fileSize: data.data.fileSize || 0
        })
    });

    return result;
};

// Hook for sharing via Gmail
export const useShareViaGmail = () => {
    const { state } = useAuth();

    return useMutation<any, Error, { path: string; fileName?: string }>({
        mutationFn: async ({ path, fileName = "Shared File" }) => {
            try {
                const shareableUrl = await getShareableUrl(path, state.user?.accessToken || "");
                const mailtoLink = `mailto:?subject=Shared File: ${fileName}&body=${shareableUrl}%0D%0A%0D%0ANote: This link will expire in 24 hours.`;

                window.open(mailtoLink, "_blank");

                return {
                    success: true,
                    message: "Gmail opened successfully",
                    url: shareableUrl,
                };
            } catch (error) {
                console.error("Error sharing via Gmail:", error);
                return {
                    success: false,
                    message: "Failed to share via Gmail",
                };
            }
        }
    });
};

// Hook for sharing via WhatsApp
export const useShareViaWhatsApp = () => {
    const { state } = useAuth();

    return useMutation({
        mutationFn: async (path: string) => {
            try {
                const shareableUrl = await getShareableUrl(path, state.user?.accessToken || "");
                const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`${shareableUrl}\n\nNote: This link will expire in 24 hours.`)}`;

                window.open(whatsappLink, "_blank");

                return {
                    success: true,
                    message: "WhatsApp opened successfully",
                    url: shareableUrl,
                };
            } catch (error) {
                console.error("Error sharing via WhatsApp:", error);
                return {
                    success: false,
                    message: "Failed to share via WhatsApp",
                };
            }
        }
    });
}

// Hook for sharing via Navigator API
export const useShareViaNavigator = () => {
    const { state } = useAuth();

    return useMutation<any, Error, { path: string; fileName?: string }>({
        mutationFn: async ({ path, fileName = "Shared File" }) => {
            try {
                const shareableUrl = await getShareableUrl(path, state.user?.accessToken || "");

                if (navigator.share) {
                    await navigator.share({
                        title: fileName,
                        text: "Here's your file link",
                        url: shareableUrl,
                    });

                    return {
                        success: true,
                        message: "Shared successfully",
                        url: shareableUrl,
                    };
                } else {
                    throw new Error("Web Share API not supported");
                }
            } catch (error) {
                console.error("Error sharing:", error);
                return {
                    success: false,
                    message: error instanceof Error && error.message === "Web Share API not supported"
                        ? "Sharing not supported on this device"
                        : "Failed to share",
                };
            }
        }
    });
}

// Hook for copying link to clipboard
export const useCopyLinkToClipboard = () => {
    const { state } = useAuth();

    return useMutation({
        mutationFn: async (path: string) => {
            try {
                const shareableUrl = await getShareableUrl(path, state.user?.accessToken || "");
                await navigator.clipboard.writeText(shareableUrl);

                // @todo show text copied notification

                return {
                    success: true,
                    message: "Link copied to clipboard",
                    url: shareableUrl,
                };
            } catch (error) {
                console.error("Error copying link:", error);
                return {
                    success: false,
                    message: "Failed to copy link",
                };
            }
        }
    });
}

interface UseFileProp {
    attachDocument: string;
    opened: boolean;
}

const useFile = ({ attachDocument, opened=false }: UseFileProp) => {
    const { data: fileInfo } = useFileInfo(attachDocument);
    const { data: link } = useGetShareableUrl(attachDocument);
    const { data: fileProperties } = useGetFileMetadata(attachDocument, opened);

    const downloadFile = useDownloadFile();
    const shareViaGmail = useShareViaGmail();
    const shareViaWhatsApp = useShareViaWhatsApp();
    const shareViaNavigator = useShareViaNavigator();
    const copyLinkToClipboard = useCopyLinkToClipboard();

    return {
        link,
        fileSize: fileInfo?.fileSize || '',
        fileName: fileInfo?.fileName || 0,
        downloadFile: () => downloadFile.mutateAsync(attachDocument),
        fileProperties,
        shareViaGmail: () => shareViaGmail.mutateAsync({
            path: attachDocument,
            fileName: fileInfo?.fileName
        }),
        shareViaNavigator: () => shareViaNavigator.mutateAsync({
            path: attachDocument,
            fileName: fileInfo?.fileName
        }),
        shareViaWhatsApp: () => shareViaWhatsApp.mutateAsync(attachDocument),
        copyLinkToClipboard: () => copyLinkToClipboard.mutateAsync(attachDocument),
    }
}

export default useFile;