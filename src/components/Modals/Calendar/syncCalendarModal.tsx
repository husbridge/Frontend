import Close from "@assets/icons/close.svg"
import { Button } from "@components/index"
import { Modal } from "@mantine/core"
import { fetchCalendarFeed } from "@services/calendar"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { CopyToClipboard as BaseCopyToClipboard } from "react-copy-to-clipboard"
import React from "react"
const CopyToClipboard: React.FC<any> = (props) =>
    React.createElement(BaseCopyToClipboard as unknown as any, props)
import { IoCopyOutline } from "react-icons/io5"
import { CgSpinner } from "react-icons/cg"

export interface SyncCalendarModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const SyncCalendarModal = ({ opened, setOpened }: SyncCalendarModalProps) => {
    const [copied, setCopied] = useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ["calendar-feed"],
        queryFn: () => fetchCalendarFeed(),
        enabled: opened,
    })

    const feedUrl = data?.data.feedUrl || ""

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{ body: "p-4 py-10" }}
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Sync Your Calendar
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-8">
                    <CgSpinner className="animate-spin text-black-100 text-2lg" />
                </div>
            ) : (
                <>
                    <p className="text-md text-[#475569] mb-4">
                        Copy this link and add it as a subscribed/URL calendar
                        in Google Calendar, Apple Calendar, Outlook, or any
                        other calendar app. Your Husridge events will appear
                        there automatically (updates every few hours).
                    </p>
                    <div className="border border-[#E0E0E0] rounded-2xl p-3 mb-4 break-all text-sm">
                        {feedUrl}
                    </div>
                    <CopyToClipboard
                        text={feedUrl}
                        onCopy={() => {
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }}
                    >
                        <Button
                            type="button"
                            variant="primary"
                            className="w-full mb-4"
                        >
                            <IoCopyOutline size={16} className="mr-2" />
                            {copied ? "Copied!" : "Copy Link"}
                        </Button>
                    </CopyToClipboard>
                    <div className="text-sm text-[#475569]">
                        <p className="font-semibold mb-1">Google Calendar</p>
                        <p className="mb-3">
                            Settings → Add calendar → From URL → paste the
                            link above.
                        </p>
                        <p className="font-semibold mb-1">Apple Calendar</p>
                        <p className="mb-3">
                            File → New Calendar Subscription → paste the link
                            above.
                        </p>
                        <p className="font-semibold mb-1">Outlook</p>
                        <p>
                            Add calendar → Subscribe from web → paste the link
                            above.
                        </p>
                    </div>
                </>
            )}
        </Modal>
    )
}

export default SyncCalendarModal
