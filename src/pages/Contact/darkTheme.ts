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

// TWO separate, both-silent Tailwind failure modes produced the first two
// rounds of this bug, and every value below is written the way it is
// specifically to avoid both. Both were confirmed by building this app
// (`npm run build`) and grepping the compiled CSS in dist/assets/*.css
// for the EXACT class actually applied at runtime — not by re-reading
// the source and assuming it was fine, which is what let both slip
// through in the first place.
//
// 1. Bare `text-white` (no suffix, no opacity) generates NOTHING. This
//    app's Tailwind config defines `white` as a keyed object
//    (`{100: "#ffffff", 60: "rgba(...)"}`), which shadows Tailwind's own
//    built-in bare `white`. Only `text-white-100`/`text-white-60`
//    (the exact declared keys) or an arbitrary value (`text-[#ffffff]`)
//    resolve to anything. `text-white/NN` fails for the same root reason
//    — the opacity modifier needs a plain color to apply to, and a keyed
//    object isn't one.
// 2. A class built by TEMPLATE-LITERAL INTERPOLATION of another exported
//    constant (e.g. `` `!${darkTextSecondary}` ``) never appears as
//    literal text anywhere in this file — the source only contains the
//    characters `!${darkTextSecondary}`, and Tailwind's scanner matches
//    against raw file text, it doesn't evaluate JavaScript. So it never
//    sees the string `!text-[#ffffff]/70` this would actually produce at
//    runtime, and never generates a rule for it — even though the
//    variable it references (`darkTextSecondary`) is itself a valid,
//    separately-working class. This is exactly how `darkLabel` broke in
//    the second round: verifying that `text-[#ffffff]/70` existed in the
//    compiled CSS (true, from OTHER call sites using it unprefixed) was
//    mistaken for verifying that `!text-[#ffffff]/70` did — a different,
//    never-generated class the check never actually looked for. Every
//    class below is now written out in full, with no interpolation.
//
// Contrast (WCAG relative-luminance formula, computed against the actual
// page background #101214):
//   text-[#ffffff]      (100%) -> ~18.8:1
//   text-[#ffffff]/70   (secondary text) -> ~9.4:1
//   text-[#ffffff]/55   (placeholder)    -> ~6.2:1
// All clear WCAG AA's 4.5:1 body-text minimum with real margin.
export const darkTextPrimary = "text-[#ffffff]"
export const darkTextSecondary = "text-[#ffffff]/70"
export const darkPlaceholder = "text-[#ffffff]/55"

export const darkInput = {
    mainRoot:
        "!bg-[#ffffff]/5 !border !border-[#ffffff]/15 !rounded-[10px] !px-3",
    input: "!text-[#ffffff] placeholder:!text-[#ffffff]/55",
}

export const darkTextarea = {
    wrapper: "!bg-[#ffffff]/5 !border !border-[#ffffff]/15 !rounded-2xl",
    input: "!text-[#ffffff] placeholder:!text-[#ffffff]/55",
}

export const darkLabel = "!text-[#ffffff]/70"
export const darkStepCounter = "text-[#ffffff]/70"
export const darkFieldLabel = "text-[#ffffff]/70"
export const darkFieldValue = "text-[#ffffff]"
export const darkHelperText = "text-[#ffffff]/70"
