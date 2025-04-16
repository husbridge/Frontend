import Close from "@assets/icons/close.svg"
import Copy from "@assets/icons/copy.svg"
import Gmail from "@assets/icons/gmail.svg"
import Share from "@assets/icons/share.svg"
import Whatsapp from "@assets/icons/whatsapp.svg"
import useAuth from "@hooks/auth/useAuth"
import { ShareResponse } from "@hooks/useAwsFile"
import { useGetInquiries, useGetPortalInquiries } from "@hooks/useInquiry"
import { Modal } from "@mantine/core"
import { Chats } from "@pages/Messaging/components/dialog"
import { DecodedUser, useSocket } from "@pages/Messaging/hooks/useSockiet"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"
import { Data } from "type/api/inquiry.types"

export interface ShareConversationModalProps {
    opened: boolean
    link: string
    shareViaGmail: () => Promise<ShareResponse>
    shareViaNavigator: () => Promise<ShareResponse>
    shareViaWhatsApp: () => Promise<ShareResponse>
    copyLinkToClipboard: () => Promise<ShareResponse>
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const ShareConversationModal = ({
    link,
    opened,
    setOpened,
    shareViaGmail,
    shareViaNavigator,
    shareViaWhatsApp,
    copyLinkToClipboard,
}: ShareConversationModalProps) => {
    const { state } = useAuth()
    const { sendMessage, joinGroup } = useSocket({})
    const decoded = jwtDecode(state.user?.accessToken || "") as DecodedUser
    const handleShare = async (shareFunction: () => Promise<ShareResponse>) => {
        try {
            const result = await shareFunction()
            if (!result.success) {
                // Handle error
                console.error(result.message)
            }
        } catch (error) {
            console.error("Share failed:", error)
        }
    }

    const {
        data: inquiryData,
        isLoading: isLoaingInquiryData,
        error: portalInquiryError,
    } = useGetPortalInquiries(state.user?.userType || "")

    const {
        isLoading,
        data,
        error: inquiryError,
    } = useGetInquiries({
        userType: state.user?.userType || "",
    })

    const chats =
        state.user?.userType === "client"
            ? inquiryData?.data || []
            : data?.data || []

    useEffect(() => {
        chats.map((chat) => {
            joinGroup(chat.chatGroupId)
        })
    }, [chats])

    const handleClick = (val: Data) => {
        setOpened(false)
        const user =
            state.user?.userType === "client"
                ? val.chatGroupId
                : state.user?.uniqueUsername

        sendMessage(link, user || "", val.chatGroupId || "", decoded.email)
    }

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <div>
                <div className="flex items-center mt-[-1]">
                    <p className="text-center font-semibold text-[20px] flex-1 leading-6">
                        Share Conversation
                    </p>
                    <img
                        src={Close}
                        alt=""
                        className="flex-none cursor-pointer"
                        onClick={() => setOpened(false)}
                    />
                </div>

                {isLoaingInquiryData || isLoading ? (
                    portalInquiryError || inquiryError ? (
                        <div>Error loading chats</div>
                    ) : (
                        <div>Loading chats...</div>
                    )
                ) : (
                    <Chats
                        handleClick={handleClick}
                        data={chats}
                        state={state}
                    />
                )}
                <div className="flex sm:space-x-10 space-x-5 mt-8 text-sm text-[#5F5E5E]">
                    <div
                        onClick={() => {
                            setOpened(false)
                            handleShare(() => shareViaGmail())
                        }}
                        className="cursor-pointer"
                    >
                        <img src={Gmail} alt="Gmail" className="mx-auto" />
                        <p className="ml-2 mt-2">Gmail</p>
                    </div>

                    <div
                        onClick={() => {
                            setOpened(false)
                            handleShare(() => shareViaWhatsApp())
                        }}
                        className="cursor-pointer"
                    >
                        <img
                            src={Whatsapp}
                            alt="WhatsApp"
                            className="mx-auto w-13"
                        />
                        <p className="mt-2">WhatsApp</p>
                    </div>

                    <div
                        onClick={() => {
                            setOpened(false)
                            handleShare(() => copyLinkToClipboard())
                        }}
                        className="cursor-pointer"
                    >
                        <img src={Copy} alt="Copy" className="mx-auto w-13" />
                        <p className="mt-2">Copy Link</p>
                    </div>

                    <div
                        onClick={() => handleShare(() => shareViaNavigator())}
                        className="cursor-pointer"
                    >
                        <img src={Share} alt="Share" className="mx-auto w-13" />
                        <p className="text-center mt-2">Share via...</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ShareConversationModal
