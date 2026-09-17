import { LoadingState } from "@components/index"
import useAuth from "@hooks/auth/useAuth"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

// Entry point for the Book/Message CTAs on husridge.com/t/:uniqueName —
// those are a different origin (Website, Next.js) from this app, so they
// can't read this app's localStorage session before deciding where to
// send the buyer. Instead they always land here with just `talent` +
// `type`, and THIS page (on app.husridge.com, where the session actually
// lives) decides: already signed in → straight into the inquiry, pre-
// filled; otherwise → signup, with the same pre-filled destination
// carried through as returnTo.
//
// Deliberately builds the internal returnTo path itself from validated
// pieces (talent uniqueName + a fixed inquiryType enum, and now an
// optional packageId) rather than accepting a path/URL from the Website
// redirect — nothing here ever trusts a raw redirect target from that
// query string.
const ALLOWED_TYPES = ["booking", "message"] as const
// A Mongo ObjectId's actual shape — same validation-by-lookup husridge-
// server does isn't possible client-side (no DB access here), so this is
// the cheapest real check: reject anything that couldn't possibly be one
// rather than forwarding arbitrary query-string content unchecked.
const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/

const InquiryStart = () => {
    const navigate = useNavigate()
    const { state } = useAuth()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const talent = searchParams.get("talent") || ""
        const rawType = searchParams.get("type") || ""
        const type = (ALLOWED_TYPES as readonly string[]).includes(rawType)
            ? rawType
            : "booking"
        const rawPackageId = searchParams.get("packageId") || ""
        const packageId = OBJECT_ID_RE.test(rawPackageId) ? rawPackageId : ""

        const packageParam = packageId ? `&packageId=${packageId}` : ""
        const returnTo = talent
            ? `/contact/${encodeURIComponent(talent)}?type=${type}${packageParam}`
            : "/inquiry-management"

        if (state.isAuthenticated) {
            navigate(returnTo, { replace: true })
        } else {
            navigate(
                `/client-signup?redirect_url=${encodeURIComponent(returnTo)}`,
                { replace: true }
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <LoadingState />
}

export default InquiryStart
