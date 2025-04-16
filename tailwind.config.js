/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
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
