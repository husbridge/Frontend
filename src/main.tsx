import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
//import "./index.css"
import AuthContextProvider from "@contexts/authContext.tsx"
import { BillingProvider } from "@contexts/payments/billing.tsx"
import { MantineProvider, createTheme } from "@mantine/core"
import "@mantine/core/styles.css"
import { Notifications } from "@mantine/notifications"
import "@mantine/notifications/styles.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import "./styles/global.scss"
// Husridge's real visual identity lives in Tailwind + global.scss
// (Montserrat body font; black-100/yellow-100 buttons via .btn--primary
// etc.; heavily rounded/pill inputs and buttons) — this theme was
// previously empty, so every Mantine component (Button, TextInput,
// Select, Modal, ...) rendered with Mantine's own defaults (a different
// font, Mantine's default blue, square-ish corners) instead. Fixing it
// here, once, is the single-source-of-truth fix for every current and
// future Mantine usage in the app, rather than patching each screen's
// Mantine components individually with one-off color/font props.
const theme = createTheme({
    fontFamily:
        '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    primaryColor: "brand",
    // Shade 9 (pure black) as the "filled" shade — matches .btn--black
    // (bg-black-100). Mantine auto-picks white text on a shade this dark.
    primaryShade: 9,
    defaultRadius: "xl",
    colors: {
        // A 10-shade scale ending in Husridge's exact black (#000000, aka
        // `black-100` in tailwind.config.js) — Mantine requires a full
        // 10-step array to compute hover/light-variant shades correctly.
        brand: [
            "#f5f5f5",
            "#e0e0e0",
            "#c2c2c2",
            "#a3a3a3",
            "#858585",
            "#666666",
            "#4d4d4d",
            "#333333",
            "#1a1a1a",
            "#000000",
        ],
    },
    components: {
        // Husridge buttons are true pills (Tailwind `rounded-full`) — a
        // numeric radius larger than any button's height renders as a
        // full pill, matching that exactly (defaultRadius above already
        // covers inputs/modals/etc. with a more modest rounded corner).
        Button: {
            defaultProps: { radius: 999 },
        },
    },
})
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthContextProvider>
                    <MantineProvider theme={theme}>
                        <BillingProvider>
                            <Notifications position="top-center" />
                            <App />
                        </BillingProvider>
                    </MantineProvider>
                </AuthContextProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
)
