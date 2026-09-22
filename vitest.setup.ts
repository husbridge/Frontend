import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

// @testing-library/react's auto-cleanup relies on a global afterEach,
// which this repo doesn't enable (test.globals isn't set) — without this,
// a component left mounted by one test is still in the DOM for the next.
afterEach(() => {
    cleanup()
})

// Mantine's hooks (useMediaQuery, used by Drawer et al.) call
// window.matchMedia, which jsdom doesn't implement.
if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })
}
