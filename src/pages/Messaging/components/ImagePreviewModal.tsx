import { Modal, Button, Group } from "@mantine/core"
import { IconX, IconDownload } from "@tabler/icons-react"

interface ImagePreviewModalProps {
    opened: boolean
    onClose: () => void
    imageUrl: string
    onSend: () => void
    isPreview?: boolean // true for pre-send preview, false for post-send viewing
    isUploading?: boolean
}

const ImagePreviewModal = ({
    opened,
    onClose,
    imageUrl,
    onSend,
    isPreview = false,
    isUploading = false,
}: ImagePreviewModalProps) => {
    const handleSend = () => {
        onSend()
        onClose()
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `image-${Date.now()}.jpg` // Default filename with timestamp
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Failed to download image:", error)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            centered
            withCloseButton={false}
        >
            <div className="relative">
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                    {/* Download button - only show for post-send viewing */}
                    {!isPreview && (
                        <button
                            onClick={handleDownload}
                            className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                            title="Download image"
                        >
                            <IconDownload size={20} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                        title="Close"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-auto max-h-96 object-contain rounded-lg"
                    />

                    {isPreview && (
                        <div className="space-y-3">
                            <Group justify="flex-end">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSend}
                                    loading={isUploading}
                                    disabled={isUploading}
                                >
                                    {isUploading
                                        ? "Uploading..."
                                        : "Send Image"}
                                </Button>
                            </Group>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default ImagePreviewModal
