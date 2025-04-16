import { useEffect, useState } from "react"
import {
    GetObjectCommand,
    HeadObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { showNotification } from "@mantine/notifications"

const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
    },
    maxAttempts: 3,
})

export interface ShareResponse {
    success: boolean
    message: string
    url?: string
}

interface S3ObjectProperties {
    url: string
    contentType?: string
    contentLength?: number
    lastModified?: Date
    metadata?: Record<string, string>
    eTag?: string
}

interface Props {
    opened: boolean
    attachDocument: string
}

const useAwsFile = ({ opened, attachDocument }: Props) => {
    const [link, setLink] = useState("")
    const [fileProperties, setFileProperties] =
        useState<S3ObjectProperties | null>(null)
    const fileName = attachDocument.split("~~").pop()?.split(".").shift()
    const parts = attachDocument.split("~~")
    const fileSize = Number(parts[parts.length - 2]) || 0

    const getS3ObjectProperties = async () => {
        const objectKey = attachDocument

        if (!objectKey) return null
        try {
            // Get object metadata using HeadObject
            const headCommand = new HeadObjectCommand({
                Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
                Key: objectKey,
            })

            const headResponse = await s3Client.send(headCommand)
            // Generate view URL
            const viewCommand = new GetObjectCommand({
                Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
                Key: objectKey,
                ResponseContentDisposition: "inline",
            })

            const url = await getSignedUrl(s3Client, viewCommand, {
                expiresIn: 1000 * 60, // 60 seconds
            })

            setFileProperties({
                url,
                contentType: headResponse.ContentType,
                contentLength: headResponse.ContentLength,
                lastModified: headResponse.LastModified,
                metadata: headResponse.Metadata,
                eTag: headResponse.ETag,
            })
        } catch (error) {
            console.error("Error getting S3 object properties:", error)
            throw new Error("Failed to get object properties")
        }
    }

    const downloadFile = async () => {
        const objectKey = attachDocument
        if (!objectKey) return

        try {
            // Generate download URL
            const downloadCommand = new GetObjectCommand({
                Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
                Key: objectKey,
                ResponseContentDisposition: `attachment; filename="${objectKey.split("/").pop()}"`,
            })

            const downloadUrl = await getSignedUrl(s3Client, downloadCommand, {
                expiresIn: 1000 * 60, // 60 seconds
            })

            // Create temporary link and trigger download
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = objectKey.split("/").pop() || "download"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error downloading file:", error)
            throw new Error("Failed to download file")
        }
    }

    const getShareableUrl = async (objectKey: string): Promise<string> => {
        const shareCommand = new GetObjectCommand({
            Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
            Key: objectKey,
            ResponseContentDisposition: "inline",
        })

        return await getSignedUrl(s3Client, shareCommand, {
            expiresIn: 86400, // 24 hours
        })
    }

    useEffect(() => {
        const getLink = async () => {
            const shareableUrl = await getShareableUrl(attachDocument)
            setLink(shareableUrl)
        }
        getLink()
    }, [attachDocument])

    const shareViaGmail = async (): Promise<ShareResponse> => {
        try {
            const shareableUrl = await getShareableUrl(attachDocument)
            const mailtoLink = `mailto:?subject=Shared File: ${fileName}&body=${shareableUrl}%0D%0A%0D%0ANote: This link will expire in 24 hours.`

            window.open(mailtoLink, "_blank")

            return {
                success: true,
                message: "Gmail opened successfully",
                url: shareableUrl,
            }
        } catch (error) {
            console.error("Error sharing via Gmail:", error)
            return {
                success: false,
                message: "Failed to share via Gmail",
            }
        }
    }

    const shareViaWhatsApp = async (): Promise<ShareResponse> => {
        try {
            const shareableUrl = await getShareableUrl(attachDocument)
            const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`${shareableUrl}\n\nNote: This link will expire in 24 hours.`)}`

            window.open(whatsappLink, "_blank")

            return {
                success: true,
                message: "WhatsApp opened successfully",
                url: shareableUrl,
            }
        } catch (error) {
            console.error("Error sharing via WhatsApp:", error)
            return {
                success: false,
                message: "Failed to share via WhatsApp",
            }
        }
    }

    const copyLinkToClipboard = async (): Promise<ShareResponse> => {
        try {
            const shareableUrl = await getShareableUrl(attachDocument)
            await navigator.clipboard.writeText(shareableUrl)

            showNotification({
                title: "Copied",
                message: "Linked copied to clipboard",
                color: "green",
            })
            return {
                success: true,
                message: "Link copied to clipboard",
                url: shareableUrl,
            }
        } catch (error) {
            console.error("Error copying link:", error)
            return {
                success: false,
                message: "Failed to copy link",
            }
        }
    }

    const shareViaNavigator = async (
        fileName: string = "Shared File"
    ): Promise<ShareResponse> => {
        try {
            const shareableUrl = await getShareableUrl(attachDocument)

            if (navigator.share) {
                await navigator.share({
                    title: fileName,
                    text: "Here's your file link",
                    url: shareableUrl,
                })

                return {
                    success: true,
                    message: "Shared successfully",
                    url: shareableUrl,
                }
            } else {
                throw new Error("Web Share API not supported")
            }
        } catch (error) {
            console.error("Error sharing:", error)
            return {
                success: false,
                message:
                    error instanceof Error &&
                    error.message === "Web Share API not supported"
                        ? "Sharing not supported on this device"
                        : "Failed to share",
            }
        }
    }

    useEffect(() => {
        if (opened) {
            getS3ObjectProperties()
        } else {
            setFileProperties(null)
        }
    }, [attachDocument, opened])

    return {
        link,
        fileSize,
        fileName,
        shareViaGmail,
        downloadFile,
        fileProperties,
        shareViaNavigator,
        shareViaWhatsApp,
        copyLinkToClipboard,
    }
}

export default useAwsFile
