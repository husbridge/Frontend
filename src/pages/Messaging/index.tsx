/* eslint-disable react-hooks/exhaustive-deps */
import BackIcon from "@assets/icons/back.svg"
import SendIcon from "@assets/icons/sendIcon.svg"
import ErrorComponent from "@components/errorComponent"
import {
    Button,
    InquiryDetails,
    Layout,
    LoadingState,
    NewMessageModal,
} from "@components/index"
import useAuth from "@hooks/auth/useAuth"
import { useGetInquiries, useGetPortalInquiries } from "@hooks/useInquiry"
import { useGetChats } from "@hooks/useMessaging"
// import { Progress } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks"
import { groupBy, parseUTCDate } from "@utils/helpers"
import dayjs from "dayjs"
import {
    ChangeEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { Data } from "type/api/inquiry.types"
import { Data as ChatData } from "type/api/messaging.types"
import Dialog from "./components/dialog"
import DownloadFileButton from "./components/downloadButton"
import ImageWithAwsHook from "./components/imageWithAwsHook"
import ImagePreviewModal from "./components/ImagePreviewModal"
import ImageMessageSkeleton from "./components/ImageMessageSkeleton"
import { useSocket } from "./hooks/useSocket"

import Avatar from "@components/Layout/avatar"
import { useNotificationStore } from "@hooks/useNotificationStore"
import calendar from "dayjs/plugin/calendar"
import { jwtDecode } from "jwt-decode"
import { MdAttachFile } from "react-icons/md"
import { useMutation } from "@tanstack/react-query"
import { uploadChatFile } from "@services/storage"
import { showNotification } from "@mantine/notifications"
dayjs.extend(calendar)

export type DecodedUser = {
    id: string
    fullName: string
    email: string
}

export const EmptyState = () => {
    return (
        <div className="pt-[30%]">
            <p className="text-lg font-semibold text-center">
                Select a message
            </p>
            <p className="text-black-70 text-md my-4 text-center">
                Select from your existing conversation or start a new message
            </p>
            {/* <div className="flex justify-center">
                <Button variant="primary" className="" onClick={handleClick}>
                    New Message
                </Button>
            </div> */}
        </div>
    )
}

const Messaging = () => {
    const { state } = useAuth()
    const [message, setMessage] = useState("")
    const decoded = jwtDecode(state.user?.accessToken || "") as DecodedUser
    const [messages, setMessages] = useState<ChatData[]>([])
    const [activeGroup, setActiveGroup] = useState<Data>()
    const [showMessage, setShowMessage] = useState(false)
    const setMessageCount = useNotificationStore(
        (state) => state.setMessageCount
    )
    const removeChatGroupId = useNotificationStore(
        (state) => state.removeChatGroupId
    )

    // const reset = useNotificationStore((state) => state.reset)
    const [openNewMessage, setOpenNewMessage] = useState(false)
    const ref = useRef<HTMLInputElement | null>(null)
    const [showMobileChat, setShowMobileChat] = useState(false)
    const { sendMessage, joinGroup } = useSocket({ setMessages })

    // Image preview states
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [showImagePreview, setShowImagePreview] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showPreSendPreview, setShowPreSendPreview] = useState(false)

    // Upload progress states
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadingFileName, setUploadingFileName] = useState<string | null>(
        null
    )

    const [showInquiry, setShowInquiry] = useState(false)
    const {
        isLoading,
        data,
        error: inquiryError,
    } = useGetInquiries({
        userType: state.user?.userType || "",
    })

    const { data: chats, isLoading: isLoadingChats } = useGetChats(
        activeGroup?.chatGroupId || ""
    )

    const {
        data: inquiryData,
        isLoading: isLoadingInquiryData,
        error: portalInquiryError,
    } = useGetPortalInquiries(state.user?.userType || "")

    const userId = state.user?.id || ""

    const isUserMessage = (newItemUser: string) => {
        const identifiers = [
            activeGroup?._id,
            state.user?.uniqueUsername,
            userId,
        ]
        return identifiers.some((data) => data === newItemUser)
    }

    const { mutate: fileMutate } = useMutation({
        mutationFn: ({ formData }: { formData: FormData }) =>
            uploadChatFile(
                formData,
                activeGroup?.chatGroupId || "",
                (percent) => {
                    setUploadProgress(percent)
                }
            ),
        onSuccess: (data) => {
            console.log(`==Upload result ${data.data}`)
            setIsUploading(false)
            setUploadProgress(0)
            setUploadingFileName(null)
        },
        onError: (error) => {
            console.error("Upload failed:", error)
            setIsUploading(false)
            setUploadProgress(0)
            setUploadingFileName(null)
            showNotification({
                title: "Upload failed",
                message: "Failed to upload file. Please try again.",
                color: "red",
            })
        },
    })

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Prevent multiple uploads
        if (isUploading) {
            showNotification({
                title: "Upload in progress",
                message: "Please wait for the current upload to complete",
                color: "yellow",
            })
            return
        }

        // Check if it's an image
        if (file.type.startsWith("image/")) {
            setSelectedFile(file)
            setShowPreSendPreview(true)
        } else {
            // Handle non-image files with progress
            setIsUploading(true)
            setUploadingFileName(file.name)
            setUploadProgress(0)

            const formData = new FormData()
            formData.append("file", file)

            fileMutate({ formData })
        }

        e.target.value = ""
    }

    const isImage = (contentType: string) => {
        return contentType && contentType.startsWith("image/")
    }

    const matches = useMediaQuery("(min-width: 768px)")
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollToBottom = useCallback(() => {
        if (containerRef && containerRef.current) {
            const scrollHeight = containerRef.current.scrollHeight
            const height = containerRef.current.clientHeight
            const maxScrollTop = scrollHeight - height
            containerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
        }
    }, [containerRef, messages])

    const newMessages = useMemo(() => {
        return groupBy(messages, (i) => parseUTCDate(i.date))
    }, [messages])

    useEffect(() => {
        scrollToBottom()
    }, [containerRef, messages, showMessage, newMessages])

    const handleSendMessage = () => {
        const roomId = activeGroup?.chatGroupId || ""
        if (!message?.trim()) return
        if (!roomId) {
            console.error("No active roomId; select a chat first.")
            return
        }

        console.log(`=== userId - ${userId}`)
        sendMessage({
            message,
            userId,
            roomId,
            senderEmail: decoded.email,
        })
        setMessage("")
    }

    const handleClick = (item: Data) => {
        setShowMobileChat(true)
        setShowMessage(true)
        setActiveGroup(item)
        removeChatGroupId(item.chatGroupId)
        joinGroup(item.chatGroupId)
    }

    const handleSendImage = () => {
        if (!selectedFile || !activeGroup?.chatGroupId) return

        setIsUploading(true)
        setUploadingFileName(selectedFile.name)
        setUploadProgress(0)

        const formData = new FormData()
        formData.append("file", selectedFile)

        fileMutate({ formData })
        setSelectedFile(null)
        setShowPreSendPreview(false)
    }

    const handleImageClick = (imageUrl: string) => {
        setPreviewImage(imageUrl)
        setShowImagePreview(true)
    }

    useEffect(() => {
        if (chats?.data) {
            setMessages(chats?.data)
        }
    }, [chats?.data])

    useEffect(() => {
        if (showMessage) {
            const intervalId = setInterval(() => {
                if (activeGroup) removeChatGroupId(activeGroup?.chatGroupId)
            }, 1000)

            return () => clearInterval(intervalId)
        }
    }, [showMessage, setMessageCount, activeGroup])

    return (
        <Layout>
            <NewMessageModal
                opened={openNewMessage}
                setOpened={setOpenNewMessage}
            />
            {isLoading || isLoadingInquiryData ? (
                <LoadingState />
            ) : portalInquiryError || inquiryError ? (
                <ErrorComponent />
            ) : (
                <>
                    <InquiryDetails
                        opened={showInquiry}
                        setOpened={setShowInquiry}
                        data={activeGroup}
                        fromMessaging={true}
                    />
                    <div className=" pt-24 bg-[#FBFBFB] sm:bg-white-100 h-screen  ">
                        {(matches || !showMobileChat) && (
                            <div className="md:w-[20rem] w-full overflow-y-auto fixed h-[100%] sm:border-t border-[#0000001A]">
                                <Dialog
                                    handleClick={handleClick}
                                    setOpenNewMessage={setOpenNewMessage}
                                    chats={chats?.data}
                                    data={
                                        state.user?.userType === "client"
                                            ? inquiryData?.data || []
                                            : data?.data || []
                                    }
                                />
                            </div>
                        )}

                        {(matches || showMobileChat) && (
                            <div className="md:pl-[20rem] bg-[#FBFBFB] sm:bg-white-100   h-full ">
                                {isLoadingChats ? (
                                    <LoadingState />
                                ) : showMessage ? (
                                    <div className="h-full flex flex-col grow relative overflow-y-hidden">
                                        <div className="px-4 bg-white-100 sm:border-y border-[#0000001A] z-10 sticky top-0 flex justify-between gap-2 items-center  ">
                                            <div className="flex py-4 px-2 items-center z-10">
                                                <img
                                                    src={BackIcon}
                                                    alt=""
                                                    className="mr-4 sm:hidden block cursor-pointer"
                                                    onClick={() =>
                                                        setShowMobileChat(false)
                                                    }
                                                />
                                                <Avatar
                                                    size={40}
                                                    imageUrl={
                                                        activeGroup
                                                            ?.bookedForTalent
                                                            .profileUrl
                                                    }
                                                    alt={
                                                        state.user?.userType ===
                                                        "client"
                                                            ? activeGroup?.bookedForTalent.fullName
                                                                  .split("  ")
                                                                  .join(" ")
                                                            : activeGroup?.fullName.trim()
                                                    }
                                                />

                                                <div className="ml-2">
                                                    <p className="text-[#0F0E0E] text-2md sm:text-3md font-medium">
                                                        {state.user
                                                            ?.userType ===
                                                        "client"
                                                            ? activeGroup
                                                                  ?.bookedForTalent
                                                                  .fullName
                                                            : activeGroup?.fullName}
                                                    </p>
                                                    <p className="text-sm sm:text-md text-[#5F5E5E]">
                                                        {state.user
                                                            ?.userType ===
                                                        "client"
                                                            ? activeGroup
                                                                  ?.bookedForTalent
                                                                  .uniqueUsername
                                                            : activeGroup?.emailAddress}
                                                    </p>
                                                </div>
                                            </div>
                                            {state.user?.userStatus !==
                                                "client" && (
                                                <Button
                                                    variant="primary"
                                                    className="!text-sm break-keep sm:pl-1 lg:pl-3 hidden sm:block"
                                                    onClick={() =>
                                                        setShowInquiry(true)
                                                    }
                                                >
                                                    View Inquiry
                                                </Button>
                                            )}
                                        </div>
                                        <div className="relative order-2 shrink grow basis-0 -z-1000">
                                            <div
                                                className="absolute h-full top-0 left-0 w-full   sm:bg-white-100 bg-[#FBFBFB] overflow-y-scroll"
                                                ref={containerRef}
                                            >
                                                {Object.keys(newMessages).map(
                                                    (item, index) => (
                                                        <div key={index}>
                                                            <p className="flex justify-between mt-4 mx-auto bg-[#FCFCFC] p-2 rounded-full border border-[#F5F5F5] w-fit px-4 text-md">
                                                                {dayjs(
                                                                    new Date(
                                                                        newMessages[
                                                                            item
                                                                        ][0].date
                                                                    )
                                                                ).calendar(
                                                                    null,
                                                                    {
                                                                        sameDay:
                                                                            "[Today]",

                                                                        lastDay:
                                                                            "[Yesterday]",
                                                                        lastWeek:
                                                                            "DD/MM/YYYY",
                                                                        sameElse:
                                                                            "DD/MM/YYYY",
                                                                    }
                                                                )}
                                                            </p>
                                                            {newMessages[
                                                                item
                                                            ].map(
                                                                (
                                                                    newItem,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={`${
                                                                            isUserMessage(
                                                                                newItem.user
                                                                            )
                                                                                ? "lg:ml-64 ml-20 flex justify-end mr-6"
                                                                                : "ml-6 lg:mr-64 mr-20 "
                                                                        }`}
                                                                    >
                                                                        {/* <span className="text-xs">you:{user} -- other:{newItem.user}</span> */}
                                                                        <div
                                                                            className={`bg-black-5  max-w-fit rounded-[20px] p-4`}
                                                                        >
                                                                            <div
                                                                                className={`${
                                                                                    isUserMessage(
                                                                                        newItem.user
                                                                                    )
                                                                                        ? "text-[#FFC107] bg-black-100  rounded-[16px] p-4 rounded-tr-none"
                                                                                        : "text-[#01070E] rounded-tl-none rounded-[16px] bg-[#F5F5F5] p-4"
                                                                                } text-sm`}
                                                                            >
                                                                                {newItem.type ===
                                                                                "file" ? (
                                                                                    <div className="space-y-3">
                                                                                        {isImage(
                                                                                            newItem
                                                                                                .metadata
                                                                                                .contentType
                                                                                        ) ? (
                                                                                            <ImageWithAwsHook
                                                                                                newItem={
                                                                                                    newItem
                                                                                                }
                                                                                                onImageClick={
                                                                                                    handleImageClick
                                                                                                }
                                                                                            />
                                                                                        ) : (
                                                                                            <>
                                                                                                <DownloadFileButton
                                                                                                    newItem={
                                                                                                        newItem
                                                                                                    }
                                                                                                    opened={
                                                                                                        showMessage
                                                                                                    }
                                                                                                />
                                                                                                {
                                                                                                    newItem
                                                                                                        .metadata
                                                                                                        .key
                                                                                                }
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <>
                                                                                        {newItem.message.startsWith(
                                                                                            "https"
                                                                                        ) ? (
                                                                                            <a
                                                                                                target="_blank"
                                                                                                href={
                                                                                                    newItem.message
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    newItem.message
                                                                                                }
                                                                                            </a>
                                                                                        ) : (
                                                                                            newItem.message
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <p
                                                                                className={`${isUserMessage(newItem.user) ? "text-end pr-1.5" : "text-start pl-1.5"} text-[#07305F] text-[10px] mt-2`}
                                                                            >
                                                                                {dayjs(
                                                                                    newItem.date
                                                                                ).format(
                                                                                    "h:mm a"
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )
                                                )}

                                                {/* Uploading skeleton message */}
                                                {isUploading &&
                                                    uploadingFileName && (
                                                        <div className="mt-4">
                                                            <ImageMessageSkeleton
                                                                fileName={
                                                                    uploadingFileName
                                                                }
                                                                progress={
                                                                    uploadProgress
                                                                }
                                                                isUserMessage={
                                                                    true
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        <div className=" relative w-full z-2 sm:bg-white-100 bg-[#FBFBFB] botto order-3 pl-4 py-4 pr-8 ">
                                            {/* //w-[90%] md:w-[calc(70%-150px)] lg:w-[calc(60%-200px)] xl:w-[calc(70%-250px)] */}
                                            <div className="mx-4 overflow-x-hidden  w-full bg-[#F2F2F2]  rounded-[15px]  relative  pl-4 h-14 items-center flex">
                                                <div
                                                    className={`pr-2 ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                                    onClick={() => {
                                                        if (!isUploading) {
                                                            ref.current?.click()
                                                        }
                                                    }}
                                                >
                                                    <MdAttachFile
                                                        color={
                                                            isUploading
                                                                ? "#ccc"
                                                                : "#292D32"
                                                        }
                                                    />
                                                    <input
                                                        data-testid="file-upload"
                                                        // ref={fileInputRef}
                                                        type="file"
                                                        hidden
                                                        onChange={handleUpload}
                                                        ref={ref}
                                                        disabled={isUploading}
                                                    />
                                                </div>
                                                <div className="flex flex-1 justify-between w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a message"
                                                        className="focus:outline-none mr-6 bg-[#F2F2F2] w-full"
                                                        value={message}
                                                        onChange={(e) =>
                                                            setMessage(
                                                                e.currentTarget
                                                                    .value
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                    "Enter" &&
                                                                message
                                                            ) {
                                                                handleSendMessage()
                                                            }
                                                        }}
                                                    />

                                                    <button
                                                        className=" border-none mr-6 "
                                                        onClick={() =>
                                                            message &&
                                                            handleSendMessage()
                                                        }
                                                    >
                                                        <img
                                                            src={SendIcon}
                                                            alt=""
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Image Preview Modals */}
            <ImagePreviewModal
                opened={showPreSendPreview}
                onClose={() => {
                    setShowPreSendPreview(false)
                    setSelectedFile(null)
                }}
                imageUrl={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                onSend={handleSendImage}
                isPreview={true}
                isUploading={isUploading}
            />

            <ImagePreviewModal
                opened={showImagePreview}
                onClose={() => {
                    setShowImagePreview(false)
                    setPreviewImage(null)
                }}
                imageUrl={previewImage || ""}
                onSend={() => {}} // No send action for post-send viewing
                isPreview={false}
                isUploading={false}
            />
        </Layout>
    )
}

export default Messaging
