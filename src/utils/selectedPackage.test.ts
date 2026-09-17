import { describe, expect, it } from "vitest"
import { resolveSelectedPackage } from "./selectedPackage"
import { PublicPackage } from "type/api/auth.types"

function pkg(overrides: Partial<PublicPackage> = {}): PublicPackage {
    return {
        _id: "pkg1",
        category: "photography",
        label: "Wedding package",
        description: "",
        image: "",
        price: 15000000,
        currency: "NGN",
        deliverables: [],
        turnaroundDays: 5,
        revisions: 1,
        terms: "",
        sortOrder: 0,
        ...overrides,
    }
}

describe("resolveSelectedPackage", () => {
    it("finds the package matching the given id", () => {
        const packages = [pkg({ _id: "pkg1" }), pkg({ _id: "pkg2" })]
        expect(resolveSelectedPackage(packages, "pkg2")?._id).toBe("pkg2")
    })

    it("returns null when packageId is empty (the plain 'Book' CTA, no package chosen)", () => {
        const packages = [pkg({ _id: "pkg1" })]
        expect(resolveSelectedPackage(packages, "")).toBeNull()
    })

    it("returns null when no package matches (stale/removed packageId)", () => {
        const packages = [pkg({ _id: "pkg1" })]
        expect(resolveSelectedPackage(packages, "does-not-exist")).toBeNull()
    })

    it("returns null when packages is undefined (query hasn't resolved yet, or the profile has none)", () => {
        expect(resolveSelectedPackage(undefined, "pkg1")).toBeNull()
    })
})
