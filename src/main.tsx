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
const theme = createTheme({
    /** Put your mantine theme override here */
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
