import { useState } from "react"
import { Tooltip } from "@mantine/core"
import SupportModal from "@components/Modals/Support"
import { createSupportTicket } from "@services/support"
import { notifications } from "@mantine/notifications"

const SupportFab = () => {
    const [opened, setOpened] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (values: {
        email: string
        subject: string
        fullName: string
        message: string
    }) => {
        try {
            setIsSubmitting(true)
            await createSupportTicket({
                email: values.email,
                subject: values.subject,
                fullName: values.fullName,
                message: values.message,
            })
            notifications.show({
                message: "Support request sent",
                color: "green",
            })
            setOpened(false)
        } catch (error: any) {
            notifications.show({
                message:
                    error?.response?.data?.message ||
                    "Failed to send support request",
                color: "red",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <SupportModal
                opened={opened}
                setOpened={setOpened}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
            <Tooltip label="Contact support">
                <button
                    onClick={() => setOpened(true)}
                    aria-label="Contact support"
                    className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-yellow-100 text-black-100 shadow-lg hover:opacity-90 active:opacity-80 flex items-center justify-center"
                >
                    ?
                </button>
            </Tooltip>
        </>
    )
}

export default SupportFab
