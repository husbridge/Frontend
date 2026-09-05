import { useCallback, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createPortfolioItem } from "@services/auth"
import { PortfolioItemRequest } from "type/api/auth.types"

export interface QueuedUpload {
    id: string
    title: string
    progress: number
    status: "uploading" | "done" | "error"
    errorMessage?: string
    // Retained so a failed upload can be retried without asking the user
    // to re-fill the form. Cleared (set to null) once the upload succeeds
    // — no reason to hold a file in memory after it's landed.
    data: PortfolioItemRequest
    file: File | null
}

// Background upload queue: enqueue() returns immediately so the caller
// (the portfolio grid) can keep rendering/accepting new items while each
// upload proceeds — multiple uploads run concurrently, each tracked by its
// own progress entry. On success the portfolio list query is invalidated
// so the new item appears without a manual refresh.
//
// Every item reaches exactly one terminal state: "done" (succeeded, then
// auto-clears) or "error" (a specific message, with retry/dismiss) — never
// left stuck on "uploading" indefinitely. Two things guarantee this:
// createPortfolioItem has a hard request timeout (see auth.ts), so a
// hung connection still eventually rejects; and every code path below
// that can execute the request (enqueue, retryUpload) has both a .then
// and a .catch.
export function useUploadQueue(userId: string | undefined) {
    const queryClient = useQueryClient()
    const [queue, setQueue] = useState<QueuedUpload[]>([])
    // Mirrors `queue` for retryUpload's lookup — reading state via a ref
    // instead of a setState updater keeps that lookup side-effect-free.
    // Firing the network request (a side effect) from inside a setState
    // updater is unsafe: React may invoke updaters more than once (e.g.
    // React 18 StrictMode does this deliberately in development to catch
    // exactly this), which previously caused a single Retry click to fire
    // the upload twice.
    const queueRef = useRef<QueuedUpload[]>([])
    queueRef.current = queue

    const runUpload = useCallback(
        (id: string, data: PortfolioItemRequest, file: File | null) => {
            setQueue((prev) =>
                prev.map((q) =>
                    q.id === id
                        ? { ...q, status: "uploading" as const, progress: 0, errorMessage: undefined }
                        : q
                )
            )

            createPortfolioItem(data, file, userId, (percent) => {
                setQueue((prev) =>
                    prev.map((q) => (q.id === id ? { ...q, progress: percent } : q))
                )
            })
                .then(() => {
                    setQueue((prev) =>
                        prev.map((q) =>
                            q.id === id
                                ? { ...q, progress: 100, status: "done" as const, file: null }
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
                                          err.code === "ECONNABORTED"
                                              ? "Upload timed out — check your connection and try again"
                                              : err.response?.data?.message ||
                                                err.message ||
                                                "Upload failed",
                                  }
                                : q
                        )
                    )
                })
        },
        [userId, queryClient]
    )

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
                    data,
                    file,
                },
            ])
            runUpload(id, data, file)
        },
        [runUpload]
    )

    const retryUpload = useCallback(
        (id: string) => {
            const item = queueRef.current.find((q) => q.id === id)
            if (item) runUpload(id, item.data, item.file)
        },
        [runUpload]
    )

    const dismiss = useCallback((id: string) => {
        setQueue((prev) => prev.filter((q) => q.id !== id))
    }, [])

    return { queue, enqueue, retryUpload, dismiss }
}
