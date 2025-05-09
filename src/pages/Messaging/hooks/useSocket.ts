import useAuth from "@hooks/auth/useAuth"
import { useNotificationStore } from "@hooks/useNotificationStore"
import { showNotification } from "@mantine/notifications"
import { MESSAGING_BASE_URL } from "@services/api.services"
import { jwtDecode } from "jwt-decode"
import { useCallback, useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"
import { Data, MessageNotification } from "type/api/messaging.types"

const base = MESSAGING_BASE_URL

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
            //newSocket.emit("joinGroup", { roomId });
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
            roomId: string,
            senderEmail: string
        ) => {
            if (socket) {
                console.log(user, senderEmail, roomId)
                socket.emit(
                    "message",
                    { message, user, roomId, senderEmail },
                    (response: any) => {
                        console.log("sending ", message)
                        console.log("resp", response)
                        if (response.status === "ok") {
                            console.log("Message sent successfully!")
                        } else {
                            console.error(
                                "Message failed to send:",
                                response.error
                            )
                            showNotification({
                                title: "Error",
                                message: "Message failed to send.",
                                color: "red",
                            })
                        }
                    }
                )
            }
        },
        [socket]
    )

    const joinGroup = useCallback(
        (roomId: string) => {
            console.log(`Attempting to join group: ${roomId}`)
            if (socket) {
                socket.emit("joinGroup", { roomId }, (response: any) => {
                    if (response?.status === "success") {
                        console.log(`Successfully joined group ${roomId}`)
                    } else {
                        console.error(`Failed to join group ${roomId}`)
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
