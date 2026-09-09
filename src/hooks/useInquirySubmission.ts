import useAuth from "@hooks/auth/useAuth"
import { showNotification } from "@mantine/notifications"
import { sendPortalOTP } from "@services/auth"
import { createInquiry } from "@services/inquiry"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { type Error } from "type/api"
import { CreateInquiryRequest } from "type/api/inquiry.types"

// Booking/Proposal/Collaboration all build the same CreateInquiryRequest
// shape and then need to get it submitted — historically always via the
// anonymous OTP-email-verification hop (stage in sessionStorage, send
// OTP, navigate to /confirm-inquiry). A buyer who arrived here already
// signed in (via /inquiry/start after signup/login) has already proven
// their email; making them re-verify it to send one inquiry is exactly
// the friction buyer self-signup was meant to remove. husridge-server's
// POST /portal/inquires already accepts an authenticated request and
// auto-stamps buyerUserId (optionalAuthMiddleware) — no server change
// needed, just skip the OTP hop when we already have a session.
export function useInquirySubmission() {
    const { state } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const isAuthenticatedBuyer =
        state.isAuthenticated && state.user?.userType === "client"

    const onCreateInquiry = useMutation({
        mutationFn: createInquiry,
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["inquiries"] })
                .finally(() => false)
            showNotification({
                title: "Success",
                message: "Your inquiry has been sent",
                color: "green",
            })
            navigate("/inquiry-management")
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.message || "Something went wrong, please try again!",
                color: "red",
            })
        },
    })

    const onSendOtp = useMutation({
        mutationFn: sendPortalOTP,
        onSuccess: () => {
            navigate("/confirm-inquiry")
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message:
                    err.message || "Something went wrong, please try again later",
                color: "red",
            })
        },
    })

    const submit = (inquiry: CreateInquiryRequest) => {
        if (isAuthenticatedBuyer) {
            onCreateInquiry.mutate(inquiry)
        } else {
            sessionStorage.setItem("inquiry", JSON.stringify(inquiry))
            onSendOtp.mutate({
                email: inquiry.emailAddress,
                name: inquiry.fullName,
            })
        }
    }

    return {
        submit,
        isPending: onCreateInquiry.isPending || onSendOtp.isPending,
        isAuthenticatedBuyer,
    }
}
