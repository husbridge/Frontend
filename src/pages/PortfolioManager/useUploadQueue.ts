import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createPortfolioItem } from "@services/auth"
import { PortfolioItemRequest } from "type/api/auth.types"

export interface QueuedUpload {
    id: string
    title: string
    progress: number
    status: "uploading" | "done" | "error"
    errorMessage?: string
}

// Background upload queue: enqueue() returns immediately so the caller
// (the portfolio grid) can keep rendering/accepting new items while each
// upload proceeds — multiple uploads run concurrently, each tracked by its
// own progress entry. On success the portfolio list query is invalidated
// so the new item appears without a manual refresh.
export function useUploadQueue(userId: string | undefined) {
    const queryClient = useQueryClient()
    const [queue, setQueue] = useState<QueuedUpload[]>([])

    const enqueue = useCallback(
        (data: PortfolioItemRequest, file: File | null) => {
            const id = `${Date.now()}-${Math.random()}`
            setQueue((prev) => [
                ...prev,
                {
                    id,
                    title: data.title || "Untitled",
                    progress: 0,
                    status: "uploading",
                },
            ])

            createPortfolioItem(data, file, userId, (percent) => {
                setQueue((prev) =>
                    prev.map((q) => (q.id === id ? { ...q, progress: percent } : q))
                )
            })
                .then(() => {
                    setQueue((prev) =>
                        prev.map((q) =>
                            q.id === id
                                ? { ...q, progress: 100, status: "done" as const }
                                : q
                        )
                    )
                    queryClient
                        .invalidateQueries({
                            queryKey: ["portfolioItems", userId ?? "self"],
                        })
                        .finally(() => false)
                    // Clear the finished entry after a moment so the queue
                    // list doesn't grow unbounded across a long session.
                    setTimeout(() => {
                        setQueue((prev) => prev.filter((q) => q.id !== id))
                    }, 2000)
                })
                .catch((err: any) => {
                    setQueue((prev) =>
                        prev.map((q) =>
                            q.id === id
                                ? {
                                      ...q,
                                      status: "error" as const,
                                      errorMessage:
                                          err.response?.data?.message ||
                                          err.message,
                                  }
                                : q
                        )
                    )
                })
        },
        [userId, queryClient]
    )

    const dismiss = useCallback((id: string) => {
        setQueue((prev) => prev.filter((q) => q.id !== id))
    }, [])

    return { queue, enqueue, dismiss }
}
