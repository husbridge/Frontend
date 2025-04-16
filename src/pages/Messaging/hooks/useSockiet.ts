import io, { Socket } from "socket.io-client"
import { useEffect, useState, useCallback } from "react"
import useAuth from "@hooks/auth/useAuth"
//import { showNotification } from "@mantine/notifications"
import { Data, MessageNotification } from "type/api/messaging.types"
import { useNotificationStore } from "@hooks/useNotificationStore"
import { jwtDecode } from "jwt-decode"

const base = "https://messaging-chat.onrender.com" //import.meta.env.VITE_MESSAGING_BASE_URL
// const base = "http://localhost:3000"

export type DecodedUser = {
    id: string
    fullName: string
    email: string
}

export const useSocket = ({
    setMessages,
}: {
    setNotificationBadge?: React.Dispatch<
        React.SetStateAction<MessageNotification>
    >
    setMessages?: React.Dispatch<React.SetStateAction<Data[]>>
}) => {
    const { state } = useAuth()
    const currentUser = jwtDecode(state.user?.accessToken || "") as DecodedUser

    const [socket, setSocket] = useState<Socket | null>(null)

    const setChatGroupIds = useNotificationStore(
        (state) => state.setChatGroupIds
    )

    const initializeSocket = useCallback(() => {
        const newSocket = io(base, {
            auth: {
                token: state.user?.accessToken,
            },
        })

        newSocket.on("connect", () => {
            console.log("Connected to the server")
            //newSocket.emit("joinGroup", { groupId });
        })
        newSocket.on("data", (data) => {
            console.log("dat", data)
        })
        newSocket.io.on("error", (error) => {
            console.error("Connection error:", error)
        })
        newSocket.on("disconnect", () => {
            console.log("Disconnected from the server")
        })

        newSocket.on("connect_error", (err) => {
            console.error("Connection error:", err)
        })

        newSocket.on("message", (msg: Data) => {
            setMessages && setMessages((prev) => [...prev, msg])
        })

        newSocket.on("messageNotification", (data: MessageNotification) => {
            if (data.senderEmail !== currentUser.email) {
                setChatGroupIds(data.chatGroupIds)
            }
        })

        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
            newSocket.off("connect")
            newSocket.off("disconnect")
            newSocket.off("connect_error")
            newSocket.off("message")
        }
    }, [state.user?.accessToken])

    useEffect(() => {
        initializeSocket()
    }, [initializeSocket])

    const sendMessage = useCallback(
        (
            message: string,
            user: string,
            groupId: string,
            senderEmail: string
        ) => {
            if (socket) {
                socket.emit(
                    "message",
                    { message, user, groupId, senderEmail },
                    (response: any) => {
                        console.log("resp", response)
                        if (response.status === "ok") {
                            console.log("Message sent successfully!")
                        } else {
                            console.error(
                                "Message failed to send:",
                                response.error
                            )
                        }
                    }
                )
            }
        },
        [socket]
    )
    const joinGroup = useCallback(
        (groupId: string) => {
            console.log(`Attempting to join group: ${groupId}`)
            if (socket) {
                socket.emit("joinGroup", { groupId }, (response: any) => {
                    if (response?.status === "success") {
                        console.log(`Successfully joined group ${groupId}`)
                    } else {
                        console.error(`Failed to join group ${groupId}`)
                    }
                })
            } else {
                console.error("Socket is not initialized.")
            }
        },
        [socket]
    )

    if (socket) {
        socket.on("message_received", (data) => {
            console.log("Server confirmed receipt of the message:", data)
        })
    }

    return { sendMessage, joinGroup }
}
