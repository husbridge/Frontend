// Shared classNames for Contact/:uniqueName's forms — the page this app
// hands off to from Website's public profile (husridge.com/t/:uniqueName,
// dark background + yellow accent). The forms here were built against
// FormControls' own light-theme defaults (white backgrounds, near-black
// text) and never restyled after the surface-consolidation pass removed
// the display block that used to sit above them, leaving a dark header
// on a light form — two different products stitched together.
//
// FormControls hardcodes some colors internally (e.g. label text is
// `text-black-100` unless overridden) rather than exposing a theme prop,
// so every override here uses Tailwind's `!` important modifier — the
// only way a per-instance classNames/labelClassName override reliably
// wins against a class baked into the shared component itself. Scoped to
// this one page's own files, not the shared FormControls component or
// its Tailwind config tokens — the rest of this app is a light-themed
// authenticated dashboard and stays that way.
//
// Palette matches Website's exact tokens (src/app/globals.css):
// primary-black #101214, primary-gray #171A1E, primary-yellow #FEC009,
// primary-dark-yellow #FFC107 (identical to this app's own yellow-100).
export const darkPageBg = "bg-[#101214]"
export const darkCardBg = "bg-[#171A1E]"

export const darkInput = {
    mainRoot: "!bg-white/5 !border !border-white/10 !rounded-[10px] !px-3",
    input: "!text-white placeholder:!text-white/40",
}

export const darkTextarea = {
    wrapper: "!bg-white/5 !border !border-white/10 !rounded-2xl",
    input: "!text-white placeholder:!text-white/40",
}

export const darkSelect = {
    mainRoot: "!bg-white/5 !border !border-white/10 !text-white",
    input: "!text-white",
}

export const darkLabel = "!text-white/70"
export const darkStepCounter = "text-white/40"
export const darkFieldLabel = "text-white/50"
export const darkFieldValue = "text-white"
export const darkHelperText = "text-white/50"
