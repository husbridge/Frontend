/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        // Matches Mantine's default breakpoints exactly (Mantine uses em
        // units internally: 36em/48em/62em/75em/88em at a 16px root font
        // size == these px values) so a Tailwind `sm:`/`md:`/`lg:`/`xl:`
        // class and a Mantine component's responsive prop switch at the
        // same viewport width instead of silently disagreeing. This
        // REPLACES Tailwind's own defaults (sm:640/md:768/lg:1024/xl:1280)
        // — every existing sm:/md:/lg:/xl: class in the app (182/98/23/13
        // usages respectively, `2xl:` and `xs:` unused) now triggers at a
        // different width. See the Phase 1 Step 4 PR description.
        screens: {
            xs: "576px",
            sm: "768px",
            md: "992px",
            lg: "1200px",
            xl: "1408px",
        },
        extend: {
            colors: {
                primary: {
                    50: "#eceef8",
                    100: "#c3c9e8",
                },
                black: {
                    30: "rgba(0, 0, 0, 0.30)",
                    50: "rgba(0, 0, 0, 0.50)",
                    60: "rgba(0, 0, 0, 0.6)",
                    70: "rgba(0, 0, 0, 0.7)",
                    100: "#000000",
                    600: "rgba(5, 5, 5, 0.6)",
                },
                yellow: {
                    100: "#FFC107",
                },
                white: {
                    100: "#ffffff",
                    60: "rgba(255, 255, 255, 0.6)",
                },
                grey: {
                    100: "#4F4F4F",
                    90: "rgba(245, 245, 246, 1)",
                    80: "rgba(241, 241, 241, 1)",
                },
                red: {
                    100: "rgba(255, 64, 64, 1)",
                },
                neutral: {
                    2: "rgba(19, 32, 19, 0.02)",
                    5: "rgba(19, 32, 19, 0.05)",
                    10: "rgba(19, 32, 19, 0.1)",
                    20: "rgba(19, 32, 19, 0.2)",
                    30: "rgba(19, 32, 19, 0.3)",
                    40: "rgba(19, 32, 19, 0.4)",
                    50: "rgba(19, 32, 19, 0.5)",
                    60: "rgba(19, 32, 19, 0.6)",
                    70: "rgba(19, 32, 19, 0.7)",
                    80: "rgba(19, 32, 19, 0.8)",
                    90: "rgba(19, 32, 19, 0.9)",
                    100: "rgba(19, 32, 19, 1)",
                    110: "rgba(23, 40, 24, 0.1)",
                },
            },
            fontSize: {
                "4xl": ["72px", "80px"],
                "3xl": ["60px", "72px"],
                "2xl": ["48px", "56px"],
                xl: ["39px", "47px"],
                "2lg": ["32px", "24px"],
                lg: ["24px", "24px"],
                "3md": ["18px", "24px"],
                "2md": ["16px", "150%"],
                md: ["14px", "20px"],
                sm: ["12px", "18px"],
                xs: ["8px", "10px"],
            },
            fontFamily: {
                Montserrat: ["Montserrat", "sans-serif"],
            },
            keyframes: {
                "fade-in": {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "1",
                    },
                },
                "fade-out": {
                    "0%": {
                        opacity: "1",
                    },
                    "100%": {
                        opacity: "0",
                    },
                },
            },
            animation: {
                fadeIn: "fade-in 0.3s ease-in",
                fadeOut: "fade-out 0.3s ease-out",
            },
        },
    },
    plugins: [],
}
