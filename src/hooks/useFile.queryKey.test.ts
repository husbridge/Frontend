import { describe, expect, it, vi } from "vitest"
import { QueryClient, QueryObserver } from "@tanstack/react-query"

// Same bug class as Contact/index.tsx's ["profile"] collision, found
// sweeping this codebase after that fix: useGetFileMetadata/
// useGetShareableUrl cached under a bare key while their queryFn closed
// over `path`. This reproduces the mechanism the same way — two
// "different attachments opened in the same session" queries sharing one
// cache key — rather than just asserting the key string changed.
describe("useFile query keys — two different attachments no longer collide", () => {
    it("OLD key (['fileMetadata']): the second attachment's query is served the first attachment's cached metadata", async () => {
        const queryClient = new QueryClient()

        const observerA = new QueryObserver(queryClient as any, {
            queryKey: ["fileMetadata"], // the bug: same literal key regardless of path
            queryFn: vi.fn(async () => ({ fileName: "inquiry-a-attachment.pdf" })) as any,
        })
        await new Promise<void>((resolve) => {
            const unsub = observerA.subscribe((r) => {
                if (r.isSuccess) {
                    unsub()
                    resolve()
                }
            })
        })
        observerA.destroy()

        // A second attachment, opened next in the same session (the modal
        // closed and reopened for a different inquiry) — same bare key.
        const observerB = new QueryObserver(queryClient as any, {
            queryKey: ["fileMetadata"],
            queryFn: vi.fn(async () => ({
                fileName: "inquiry-b-attachment.pdf",
            })) as any,
        })
        const firstResultB = observerB.getCurrentResult()

        // The defect: B's own fetch hasn't run yet, but the UI already has
        // "data" — A's file name, for what's supposed to be inquiry B.
        expect(firstResultB.isLoading).toBe(false)
        expect((firstResultB.data as any)?.fileName).toBe(
            "inquiry-a-attachment.pdf"
        )
        observerB.destroy()
    })

    it("NEW key (['fileMetadata', path]): each attachment gets its own cache entry", async () => {
        const queryClient = new QueryClient()

        const observerA = new QueryObserver(queryClient as any, {
            queryKey: ["fileMetadata", "path/to/a.pdf"],
            queryFn: vi.fn(async () => ({ fileName: "inquiry-a-attachment.pdf" })) as any,
        })
        await new Promise<void>((resolve) => {
            const unsub = observerA.subscribe((r) => {
                if (r.isSuccess) {
                    unsub()
                    resolve()
                }
            })
        })
        observerA.destroy()

        const observerB = new QueryObserver(queryClient as any, {
            queryKey: ["fileMetadata", "path/to/b.pdf"],
            queryFn: vi.fn(async () => ({
                fileName: "inquiry-b-attachment.pdf",
            })) as any,
        })
        const successPromise = new Promise<void>((resolve) => {
            const unsub = observerB.subscribe((r) => {
                if (r.isSuccess) {
                    unsub()
                    resolve()
                }
            })
        })
        const firstResultB = observerB.getCurrentResult()
        expect(firstResultB.isLoading).toBe(true) // correctly loading, not borrowing A's data

        await successPromise
        expect((observerB.getCurrentResult().data as any)?.fileName).toBe(
            "inquiry-b-attachment.pdf"
        )
        observerB.destroy()
    })
})
