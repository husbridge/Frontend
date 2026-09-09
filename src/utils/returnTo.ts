// Validates a "return to this page after auth" destination before it's
// ever passed to navigate(). This travels through a query param on a
// public-facing entry point (buyer signup/login reached from the public
// talent-profile page), so it must never be trusted as-is — an attacker
// could hand a buyer a crafted /client-login?returnTo=... link.
// Same-origin relative paths only, and only within a small allowlist of
// patterns this app actually uses as a post-auth landing spot.
const ALLOWED_RETURN_TO_PREFIXES = [
    "/contact/",
    "/inquiry-management",
    "/messaging",
]

export function isAllowedReturnTo(path: string | null | undefined): path is string {
    if (!path) return false
    // reject protocol-relative ("//evil.com"), absolute URLs, and
    // backslash tricks some browsers still normalize into a host
    if (!path.startsWith("/") || path.startsWith("//")) return false
    if (path.includes("://") || path.includes("\\")) return false

    return ALLOWED_RETURN_TO_PREFIXES.some(
        (prefix) => path === prefix || path.startsWith(prefix)
    )
}

export function safeReturnTo(
    path: string | null | undefined,
    fallback = "/inquiry-management"
): string {
    return isAllowedReturnTo(path) ? path : fallback
}
