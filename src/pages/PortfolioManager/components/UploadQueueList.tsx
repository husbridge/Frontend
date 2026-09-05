import { Button, CloseButton, Progress, Stack, Text } from "@mantine/core"
import { QueuedUpload } from "../useUploadQueue"

export interface UploadQueueListProps {
    queue: QueuedUpload[]
    onDismiss: (id: string) => void
    onRetry: (id: string) => void
}

// Every item here is in exactly one of three states — uploading (with
// live progress), done (about to auto-clear), or error (a specific
// message plus Retry/Dismiss) — never stuck indefinitely. See
// useUploadQueue's top comment for how that's guaranteed.
const UploadQueueList = ({ queue, onDismiss, onRetry }: UploadQueueListProps) => {
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
                    {upload.status === "error" && (
                        <Button
                            size="xs"
                            variant="outline"
                            color="dark"
                            onClick={() => onRetry(upload.id)}
                        >
                            Retry
                        </Button>
                    )}
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
