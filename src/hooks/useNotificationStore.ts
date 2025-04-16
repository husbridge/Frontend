import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotificationStore {
    reset: () => void
    messageCount: number
    setMessageCount: (count: number) => void
    chatGroupIds: string[]
    setChatGroupIds: (id: string) => void
    removeChatGroupId: (id: string) => void
}

// Create the notification store
export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set) => ({
            messageCount: 0,
            chatGroupIds: [],
            reset: () => {
                set(() => ({ messageCount: 0 }))
            },
            setMessageCount: (count: number) => {
                set((state) => ({
                    messageCount: state.messageCount + (count || 0),
                })) // Increment message count
            },
            setChatGroupIds: (id: string) => {
                set((state) => ({
                    chatGroupIds: [...state.chatGroupIds, id],
                }))
            },
            removeChatGroupId: (id: string) => {
                set((state) => ({
                    chatGroupIds: state.chatGroupIds.filter((e) => e !== id),
                }))
            },
        }),
        {
            name: "message-notification-store",
            storage: {
                getItem: (key) => {
                    const value = localStorage.getItem(key)
                    return value ? JSON.parse(value) : null
                },
                setItem: (key, value) => {
                    localStorage.setItem(key, JSON.stringify(value))
                },
                removeItem: (key) => {
                    localStorage.removeItem(key)
                },
            },
        }
    )
)
