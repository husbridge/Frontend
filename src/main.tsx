import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
//import "./index.css"
import "@mantine/core/styles.css"
import { MantineProvider, createTheme } from "@mantine/core"
import "./styles/global.scss"
import { BrowserRouter } from "react-router-dom"
import { Notifications } from "@mantine/notifications"
import "@mantine/notifications/styles.css"
import AuthContextProvider from "@contexts/authContext.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BillingProvider } from "@contexts/payments/billing.tsx"
const theme = createTheme({
    /** Put your mantine theme override here */
})
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
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
