import { Modal, Button, Group } from "@mantine/core"
import { IconX } from "@tabler/icons-react"

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

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            centered
            withCloseButton={false}
        >
            <div className="relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                >
                    <IconX size={20} />
                </button>

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
