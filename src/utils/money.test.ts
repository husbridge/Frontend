import { describe, expect, it } from "vitest"
import { formatMoney, fromMinorUnits, toMinorUnits } from "./money"

// Proves the money round-trip end to end for the two display paths this
// repo owns (the management form and the inquiry summary). The third
// display path — the public profile on Website — is a separate repo and
// tests the same wire value against its own formatMoney in its own suite;
// see Website's src/lib/money.test.ts.
//
// ₦150,000.50 is deliberately not a round number — a formatting bug
// (naira/kobo confusion, a stray *100 or /100, float rounding) tends to
// hide behind round values and only shows up once the minor unit isn't
// zero.
describe("money round-trip — a non-round value survives input -> storage -> both display paths", () => {
    const NAIRA_INPUT = 150000.5
    const EXPECTED_KOBO = 15000050

    it("input (naira, typed into PackageEditor's price field) -> storage (kobo, the wire value POSTed)", () => {
        expect(toMinorUnits(NAIRA_INPUT)).toBe(EXPECTED_KOBO)
    })

    it("storage -> management-form display (PackageEditor re-opening an existing package, PackagesManagerBody's list)", () => {
        expect(fromMinorUnits(EXPECTED_KOBO)).toBe(NAIRA_INPUT)
    })

    it("storage -> inquiry-summary display (booking.tsx's selected-package chip)", () => {
        expect(formatMoney(EXPECTED_KOBO, "NGN")).toBe("₦150,001")
    })

    it("a round value doesn't accidentally rely on the non-round test to catch a bug", () => {
        expect(toMinorUnits(150000)).toBe(15000000)
        expect(fromMinorUnits(15000000)).toBe(150000)
        expect(formatMoney(15000000, "NGN")).toBe("₦150,000")
    })
})
