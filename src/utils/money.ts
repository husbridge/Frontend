// Package price wire format is always an integer in the smallest unit of
// its currency (kobo for NGN) — never a float (PHASE2_DESIGN.md,
// husridge-server). These three functions are the only place that
// boundary gets crossed on this side: a human types/reads the major unit
// (naira), the wire format is always the minor unit. Previously
// duplicated inline in three places (PackageEditor's submit conversion,
// PackagesManagerBody's list display, booking.tsx's inquiry summary) —
// pulled out once so all three read the same arithmetic and can be
// tested once instead of three times.

// Naira -> kobo, rounded to the nearest whole kobo. Rounding (not
// truncating) matters here: a naira input can carry more precision than
// its currency's minor unit (e.g. a pasted 150000.505) and the price this
// produces is what gets billed — silently truncating loses a fraction of
// a kobo the wrong way more often than it loses none.
export function toMinorUnits(majorUnitValue: number): number {
    return Math.round(majorUnitValue * 100)
}

// kobo -> naira, for a human to read/edit. Not just the inverse divide —
// floating-point division can leave a value like 150000.49999999999997,
// which would round-trip back through toMinorUnits wrong if re-submitted
// unedited. Rounded to 2 decimal places to guarantee that never happens.
export function fromMinorUnits(minorUnitValue: number): number {
    return Math.round(minorUnitValue) / 100
}

// Display formatting, from the wire (minor-unit) value directly — every
// display site should call this, not fromMinorUnits() + its own
// Intl.NumberFormat, so a currency this doesn't support yet fails loudly
// in one place instead of formatting wrong in three.
export function formatMoney(minorUnitValue: number, currency: string): string {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(fromMinorUnits(minorUnitValue))
}
