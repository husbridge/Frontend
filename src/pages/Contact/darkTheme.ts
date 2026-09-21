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

// IMPORTANT — why every translucent-white color below is written as
// `text-[#ffffff]/NN` (an arbitrary hex value with an opacity suffix)
// and NEVER as `text-white/NN`: this app's Tailwind config
// (tailwind.config.js) defines `white` as a keyed object
// (`{100: "#ffffff", 60: "rgba(255,255,255,0.6)"}`), not a plain color
// string. Tailwind's opacity-modifier syntax (`color/opacity`) only
// works on a plain color value — against a keyed object it silently
// generates NOTHING (no error, no warning, the class just never appears
// in the compiled CSS), so `text-white/70` and every sibling class built
// the same way in the first version of this file rendered as pure
// no-ops. FormControls' own hardcoded `text-black-100` (or the browser's
// unstyled default) won by default instead, which is exactly the
// dark-text-on-dark-background bug reported against that first version.
// `text-[#ffffff]/NN` sidesteps this entirely — an arbitrary value isn't
// looked up in the theme at all, so the opacity suffix always applies.
// Verified by building this app (`npm run build`) and grepping the
// compiled CSS in dist/assets/*.css for each class used below, not by
// assuming the syntax is fine because it looks like valid Tailwind.
//
// Contrast (WCAG relative-luminance formula, computed against the actual
// page background #101214, not eyeballed):
//   text-[#ffffff]      (100%) -> ~18.8:1
//   text-[#ffffff]/70   (secondary text used below) -> ~9.4:1
//   text-[#ffffff]/55   (placeholder used below) -> ~6.2:1
// All comfortably clear WCAG AA's 4.5:1 body-text minimum, with margin
// for the slightly lighter surfaces (input fill, card background) some
// of this text sits on top of rather than the page background directly.
export const darkTextPrimary = "text-[#ffffff]"
export const darkTextSecondary = "text-[#ffffff]/70"
export const darkPlaceholder = "text-[#ffffff]/55"

export const darkInput = {
    mainRoot:
        "!bg-[#ffffff]/5 !border !border-[#ffffff]/15 !rounded-[10px] !px-3",
    input: `!${darkTextPrimary} placeholder:!${darkPlaceholder}`,
}

export const darkTextarea = {
    wrapper: "!bg-[#ffffff]/5 !border !border-[#ffffff]/15 !rounded-2xl",
    input: `!${darkTextPrimary} placeholder:!${darkPlaceholder}`,
}

export const darkSelect = {
    mainRoot: `!bg-[#ffffff]/5 !border !border-[#ffffff]/15 !${darkTextPrimary}`,
    input: `!${darkTextPrimary}`,
}

export const darkLabel = `!${darkTextSecondary}`
export const darkStepCounter = darkTextSecondary
export const darkFieldLabel = darkTextSecondary
export const darkFieldValue = darkTextPrimary
export const darkHelperText = darkTextSecondary
