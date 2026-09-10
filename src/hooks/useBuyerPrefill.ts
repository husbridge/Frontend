import useAuth from "@hooks/auth/useAuth"
import { fetchOwnPortalProfile } from "@services/auth"
import { useQuery } from "@tanstack/react-query"

// An authenticated buyer already proved who they are by logging in — the
// Booking/Proposal/Collaboration forms shouldn't make them retype their
// own name/email/phone. Fetched once, before the form's initialValues are
// built (not via Formik's enableReinitialize), so there's no risk of
// clobbering something the buyer has already typed if this resolves
// slightly late.
export function useBuyerPrefill() {
    const { state } = useAuth()
    const isAuthenticatedBuyer =
        state.isAuthenticated && state.user?.userType === "client"

    const { data, isLoading } = useQuery({
        queryKey: ["buyer-own-profile"],
        queryFn: fetchOwnPortalProfile,
        enabled: isAuthenticatedBuyer,
    })

    const profile = data?.data
    return {
        prefill: isAuthenticatedBuyer && profile
            ? {
                  fullName: profile.name || "",
                  emailAddress: profile.email || "",
                  phoneNumber: profile.phoneNumber || "",
              }
            : null,
        // Only meaningfully "loading" for an authenticated buyer — an
        // anonymous visitor's query is disabled entirely (isLoading would
        // otherwise be true for a query that will never run).
        isLoading: isAuthenticatedBuyer && isLoading,
    }
}
