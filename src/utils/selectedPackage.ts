import { PublicPackage } from "type/api/auth.types"

// Resolves the ?packageId a buyer arrived with (Contact/index.tsx) against
// the fetched public profile's packages array. Pulled out to its own
// testable function per review — the fetch that produces `packages` and
// the lookup that consumes it are two separate boundaries, and a passing
// test at the lookup boundary is what proves this specific piece of logic
// (not the surrounding data fetching) is correct.
export function resolveSelectedPackage(
    packages: PublicPackage[] | undefined,
    packageId: string
): PublicPackage | null {
    if (!packageId || !packages) return null
    return packages.find((p) => p._id === packageId) || null
}
