import { CloseButton, Progress, Stack, Text } from "@mantine/core"
import { QueuedUpload } from "../useUploadQueue"

export interface UploadQueueListProps {
    queue: QueuedUpload[]
    onDismiss: (id: string) => void
}

const UploadQueueList = ({ queue, onDismiss }: UploadQueueListProps) => {
    if (queue.length === 0) return null

    return (
        <Stack gap={8} className="border border-gray-100 rounded-2xl p-4">
            <Text size="sm" fw={600}>
                Uploading
            </Text>
            {queue.map((upload) => (
                <div key={upload.id} className="flex items-center gap-3">
                    <div className="flex-1">
                        <Text size="xs" mb={2}>
                            {upload.title}
                        </Text>
                        <Progress
                            value={upload.progress}
                            color={upload.status === "error" ? "red" : "dark"}
                            size="sm"
                            animated={upload.status === "uploading"}
                        />
                        {upload.status === "error" && (
                            <Text size="xs" c="red" mt={2}>
                                {upload.errorMessage || "Upload failed"}
                            </Text>
                        )}
                    </div>
                    {upload.status !== "uploading" && (
                        <CloseButton
                            size="sm"
                            onClick={() => onDismiss(upload.id)}
                            aria-label="Dismiss"
                        />
                    )}
                </div>
            ))}
        </Stack>
    )
}

export default UploadQueueList
