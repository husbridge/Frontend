import { describe, expect, it, vi } from "vitest"
import { QueryClient, QueryObserver } from "@tanstack/react-query"
import { resolveSelectedPackage } from "@utils/selectedPackage"

// Reproduces the actual mechanism, not just the plausible one — per
// review: "confirm causation rather than plausibility." QueryObserver is
// the exact machinery useQuery is built on (no React/DOM needed to
// exercise it), so this drives the real cache-read/fetch-triggering logic
// Contact/index.tsx runs through, not an approximation of it.
//
// The scenario: some earlier page in the same SPA session (Dashboard,
// Settings, TalentInformation — anything using fetchProfile()) already
// populated the cache under key ["profile"]. Contact/index.tsx mounts
// next, in the same session, for a DIFFERENT talent's public profile.

function seedStaleProfileCache(queryClient: QueryClient, key: unknown[]) {
    // Shaped like a real fetchProfile() response for a DIFFERENT account
    // than the one Contact is about to render — this is what a prior
    // Dashboard/Settings visit in the same session actually leaves behind.
    queryClient.setQueryData(key, {
        data: { _id: "some-other-account-id", packages: [] },
    })
}

async function observeUntilSuccess(observer: QueryObserver<any, any, any, any, any>) {
    return new Promise<void>((resolve) => {
        const unsubscribe = observer.subscribe((result) => {
            if (result.isSuccess) {
                unsubscribe()
                resolve()
            }
        })
    })
}

describe("query key collision — reproducing the mechanism, not just describing it", () => {
    it("OLD key (['profile']): stale cross-endpoint data is served with isLoading already false — the actual defect", async () => {
        const queryClient = new QueryClient()
        seedStaleProfileCache(queryClient, ["profile"])

        const freshFetchForThisTalent = vi.fn(async () => ({
            data: {
                _id: "the-actual-talent-being-viewed",
                packages: [{ _id: "pkg1", label: "Wedding package" }],
            },
        }))

        const observer = new QueryObserver(queryClient as any, {
            queryKey: ["profile"], // the bug: same literal key as Dashboard/Settings
            queryFn: freshFetchForThisTalent as any,
        })

        // This is the render Contact/index.tsx would produce on mount,
        // before React even has a chance to paint a loading state.
        const firstResult = observer.getCurrentResult()

        expect(firstResult.isLoading).toBe(false) // looks "ready" —
        expect((firstResult.data as any)?.data._id).toBe(
            "some-other-account-id" // — but it's the WRONG account entirely
        )

        // The concrete, reported symptom: resolving packageId against this
        // wrong data finds nothing, so it's silently omitted from the
        // submitted inquiry — exactly what was observed in production.
        const packageId = resolveSelectedPackage(
            (firstResult.data as any)?.data.packages,
            "pkg1"
        )
        expect(packageId).toBeNull()

        observer.destroy()
    })

    it("NEW key (['public-profile', uniqueName]): no collision is possible — isLoading starts true, resolves to the correct data", async () => {
        const queryClient = new QueryClient()
        // Same stale entry still sitting under the OLD key from some other
        // page — proving the fix works by not colliding, not by the stale
        // entry happening to be absent.
        seedStaleProfileCache(queryClient, ["profile"])

        const freshFetchForThisTalent = vi.fn(async () => ({
            data: {
                _id: "the-actual-talent-being-viewed",
                packages: [{ _id: "pkg1", label: "Wedding package" }],
            },
        }))

        const observer = new QueryObserver(queryClient as any, {
            queryKey: ["public-profile", "the-actual-talent-being-viewed"],
            queryFn: freshFetchForThisTalent as any,
        })

        // Subscribing is what actually starts the fetch — the same thing
        // useQuery's own effect does on mount. Reading getCurrentResult()
        // before that only tells you whether a cache entry already exists,
        // not whether this key is really being fetched.
        const successPromise = observeUntilSuccess(observer)
        const firstResult = observer.getCurrentResult()
        expect(firstResult.isLoading).toBe(true) // correctly loading — no
        expect(firstResult.data).toBeUndefined() //   borrowed data from elsewhere

        await successPromise
        const finalResult = observer.getCurrentResult()

        expect((finalResult.data as any)?.data._id).toBe(
            "the-actual-talent-being-viewed"
        )
        const packageId = resolveSelectedPackage(
            (finalResult.data as any)?.data.packages,
            "pkg1"
        )
        expect(packageId?._id).toBe("pkg1")

        observer.destroy()
    })
})
