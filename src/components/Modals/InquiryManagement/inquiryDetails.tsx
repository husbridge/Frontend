import Close from "@assets/icons/close.svg"
import PdfIcon from "@assets/icons/pdf.svg"
import { Button } from "@components/index"
import { Drawer } from "@mantine/core"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { BiEditAlt } from "react-icons/bi"
import { FiShare2 } from "react-icons/fi"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { MdAttachFile, MdClose, MdVerified } from "react-icons/md"
import { RxDownload } from "react-icons/rx"
import Avatar from "@components/Layout/avatar"
import ShareConversationModal from "@components/Modals/InquiryManagement/shareConversation"
import useAuth from "@hooks/auth/useAuth"
import { showNotification } from "@mantine/notifications"
import { useSocket } from "@pages/Messaging/hooks/useSockiet"
import { createEvent } from "@services/calendar"
import { sendInquiryMail } from "@services/inquiry"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Data } from "type/api/inquiry.types"
import GenerateInvoiceModal from "./generateInvoice"
import useAwsFile from "@hooks/useAwsFile"
import { formatFileSize } from "@utils/helpers"
import { PiPlusBold } from "react-icons/pi"
import { useInvoiceStore } from "@hooks/useInvoiceStore"
export interface InquiryDetailsModalProps {
    opened: boolean
    setOpened: (isOpen: boolean) => void
    data?: Data
    fromMessaging?: boolean
}

export interface ShareConversationModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const InquiryDetails = ({
    opened,
    setOpened,
    data,
    fromMessaging,
}: InquiryDetailsModalProps) => {
    const {
        link,
        fileSize,
        fileName,
        downloadFile,
        fileProperties,
        shareViaGmail,
        shareViaNavigator,
        shareViaWhatsApp,
        copyLinkToClipboard,
    } = useAwsFile({
        opened: opened,
        attachDocument: data?.attachDocument || "",
    })
    const [openInput, setOpenInput] = useState(false)
    const [openCreateInvoice, setOpenCreateInvoice] = useState(false)
    const { sendMessage } = useSocket({})
    const { state } = useAuth()
    const [openPop, setOpenPop] = useState(false)
    // this handles the ref that gets triggered when the user clicks on the attach icon
    const ref = useRef<HTMLInputElement | null>(null)
    const invoice = useInvoiceStore((state) => state.invoice)
    const setInvoice = useInvoiceStore((state) => state.setInvoice)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [messageBody, setMessageBody] = useState("")
    const queryClient = useQueryClient()

    const [openShareConversationModal, setOpenShareConversationModal] =
        useState(false)

    const { isPending, mutate } = useMutation({
        mutationFn: sendInquiryMail,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message:
                    "Response sent! Follow up with the client in your messages!",
                color: "green",
            })
            setMessageBody("")
            setOpened(false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message:
                    err.message ||
                    "Something went wrong, please try again later",
                color: "red",
            })
        },
    })

    const onAddEvent = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "Event created successfully",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["events"] })
                .finally(() => false)
            setOpened(false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message:
                    err.message ||
                    "Something went wrong, please try again later",
                color: "red",
            })
        },
    })

    const user =
        state.user?.userType === "client"
            ? data?._id
            : state.user?.uniqueUsername
    const isClient = state.user?.userType === "client"

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setInvoice(file)
        }
    }
    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpenPop(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [wrapperRef])

    const handleRespond = async () => {
        // await joinGroup(item.chatGroupId)

        sendMessage(messageBody, user || "", data?.chatGroupId || "", "")

        mutate({
            email: data?.emailAddress || "",
            messageBody: messageBody,
            subject: data?.subject || "",
            isInquiryResponse: true,
            file: invoice,
        })
    }

    const handleAddtoCalendar = () => {
        const payload: any = {
            eventTitle: data?.eventTitle,
            eventDate: data?.eventDate,
            description: data?.description,
            talents: [data?.talentID],
        }
        onAddEvent.mutate(payload)
    }

    return (
        <Drawer
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            //centered
            position="right"
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            // overlayProps={{
            //     backgroundOpacity: 0.55,
            //     blur: 3,
            // }}
        >
            <GenerateInvoiceModal
                opened={openCreateInvoice}
                setOpened={setOpenCreateInvoice}
            />

            <ShareConversationModal
                link={link}
                shareViaGmail={shareViaGmail}
                shareViaNavigator={shareViaNavigator}
                shareViaWhatsApp={shareViaWhatsApp}
                copyLinkToClipboard={copyLinkToClipboard}
                opened={openShareConversationModal}
                setOpened={setOpenShareConversationModal}
            />
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center capitalize">
                    {isClient ? "Talent" : "Client"} {data?.inquiryType} details
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <div className="flex items-center">
                {/* <img src={Avatar} className="w-16" alt="" /> */}
                <Avatar
                    size={52}
                    alt={
                        isClient
                            ? data?.bookedForTalent.firstName
                            : data?.fullName
                    }
                    imageUrl={
                        isClient ? data?.bookedForTalent.profileUrl : undefined
                    }
                />
                <div className="ml-4">
                    <div className="flex items-center">
                        <p className="text-3md sm:text-lg font-medium">
                            {isClient
                                ? data?.bookedForTalent.firstName
                                : data?.fullName}
                        </p>
                        <MdVerified color="#D95B0E" className="ml-2" />
                    </div>
                    {!isClient && (
                        <p className="text-md text-[#5F5E5E] mt-2">
                            {data?.emailAddress}
                        </p>
                    )}
                </div>
            </div>

            <p className="bg-[#F7F7F7] mt-4 p-2 w-full text-[14px] font-semibold">
                Subject
            </p>
            <p className="text-3md font-semibold my-4">{data?.subject}</p>
            {openInput ? (
                <div className="border border-[#0000001A] rounded-[8px] p-2">
                    <textarea
                        name=""
                        id=""
                        rows={4}
                        className="outline-none w-full"
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.currentTarget.value)}
                    />
                    {invoice && (
                        <div className="">
                            <div className="flex bg-[#F7F7F7] p-2 items-between w-fit">
                                <p>{invoice.name}</p>{" "}
                                <MdClose
                                    size={22}
                                    className="ml-2 cursor-pointer"
                                    onClick={() => setInvoice(null)}
                                />
                            </div>

                            <div className="mt-6 mx-auto">
                                <a
                                    href={URL.createObjectURL(invoice)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-center"
                                >
                                    Preview Invoice
                                </a>
                            </div>
                        </div>
                    )}
                    {/*
                    <div className="flex justify-end items-between ">
                        <div className="relative">
                            <MdAttachFile
                                size={22}
                                className="mt-2 cursor-pointer"
                                onClick={() => setOpenPop(true)}
                            />
                            
                        </div>

                        <Button
                            variant="primary"
                            className="!text-md ml-4"
                            onClick={() =>
                                mutate({
                                    email: data?.emailAddress || "",
                                    messageBody: messageBody,
                                    subject: data?.subject || "",
                                })
                            }
                            disabled={isPending}
                        >
                            {isPending ? "Sending" : "Send"}
                        </Button>
                    </div> */}
                    {/* <div className="flex justify-end items-between ">
                        <Button
                            variant="primary"
                            className="!text-md ml-4"
                            onClick={handleRespond}
                            disabled={isPending}
                        >
                            {isPending ? "Sending" : "Send"}
                        </Button>
                    </div> */}
                    <div className="flex justify-end items-between">
                        <div className="relative">
                            <MdAttachFile
                                size={22}
                                className="mt-2 cursor-pointer"
                                onClick={() => setOpenPop(true)}
                            />
                            {openPop && (
                                <div
                                    className="absolute right-2 bg-white-100 rounded-lg p-4 w-[200px]"
                                    ref={wrapperRef}
                                >
                                    <div
                                        className="flex cursor-pointer"
                                        onClick={() =>
                                            setOpenCreateInvoice(true)
                                        }
                                    >
                                        {" "}
                                        <PiPlusBold size={22} color="#292D32" />
                                        <p className="text-[#373636] ml-2">
                                            Create invoice
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center mt-4 cursor-pointer"
                                        onClick={() => {
                                            ref.current?.click()
                                        }}
                                    >
                                        <MdAttachFile
                                            size={22}
                                            color="#000000"
                                        />
                                        <input
                                            data-testid="file-upload"
                                            // ref={fileInputRef}
                                            type="file"
                                            hidden
                                            onChange={handleUpload}
                                            ref={ref}
                                        />
                                        {/* </div> */}
                                        <p className="text-[#373636] ml-2">
                                            Attach a file
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            className="!text-md ml-4"
                            onClick={handleRespond}
                            disabled={isPending}
                        >
                            {isPending ? "Sending" : "Send"}
                        </Button>
                    </div>
                </div>
            ) : !isClient && !fromMessaging ? (
                <div className="flex gap-4 justify-end">
                    <Button
                        variant="primary"
                        className="!text-sm flex items-center !px-2"
                        onClick={() => setOpenInput(true)}
                    >
                        <BiEditAlt
                            color="#FFC107"
                            size="22px"
                            className="mr-2"
                            onClick={() => {}}
                        />{" "}
                        Respond
                    </Button>
                    <Button
                        variant="white"
                        className="!text-sm !px-2"
                        onClick={() => setOpened(false)}
                    >
                        <IoIosCloseCircleOutline
                            size="22px"
                            color="#292D32"
                            className="mr-2"
                        />{" "}
                        Ignore
                    </Button>
                </div>
            ) : null}

            <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                Overview
            </p>
            <p className="text-[#050505] text-md">{data?.description}</p>

            <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                Email Address
            </p>
            <p className="text-md">{data?.emailAddress}</p>
            <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                Phone Number
            </p>
            <p className="text-md">{data?.phoneNumber}</p>
            {data?.inquiryType !== "proposal" && (
                <div>
                    <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                        Event Title
                    </p>
                    <p className="text-md">{data?.eventTitle}</p>
                    <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                        Venue Information
                    </p>
                    {data?.eventDate.map((item, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex space-x-20 mt-4">
                                <div className="w-1/2">
                                    <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                        Event City
                                    </p>
                                    <p className="text-[#050505] text-md">
                                        {item.eventCity as string}
                                    </p>
                                </div>

                                <div className="w-1/2">
                                    {" "}
                                    <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                        Event Country
                                    </p>
                                    <p className="text-[#050505] text-md">
                                        {item.eventCountry as string}
                                    </p>
                                </div>
                            </div>
                            <div className="flex mt-4 space-x-20">
                                <div className="w-1/2">
                                    <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                        Event Venue
                                    </p>
                                    <p className="text-[#050505] text-md">
                                        {item.eventVenue}
                                    </p>
                                </div>

                                <div className="w-1/2">
                                    {" "}
                                    <p className=" font-medium sm:text-md text-sm text-[#475569]">
                                        Event Date
                                    </p>
                                    <p className="text-[#050505] text-md">
                                        {dayjs(item.date).format(
                                            "DD MMM, YYYY"
                                        ) +
                                            " at " +
                                            dayjs(item.eventStartTime).format(
                                                "h:mm"
                                            ) +
                                            "-" +
                                            dayjs(item.eventEndTime).format(
                                                "h:mm"
                                            )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center mt-5">
                        <Button
                            variant="primary"
                            className="!text-md mt-4"
                            onClick={handleAddtoCalendar}
                            disabled={onAddEvent.isPending}
                        >
                            {onAddEvent.isPending
                                ? "Loading"
                                : "Add to Calender"}
                        </Button>
                    </div>
                </div>
            )}

            {/* <p className="text-md">{}</p>
            <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                Budget Proposal
            </p> */}
            {/* <p className="">$200,000</p> */}
            <p className="bg-[#F7F7F7] my-4 p-2 w-full text-[14px] font-semibold">
                Attachments
            </p>

            {fileProperties && (
                <div className="flex border border-[#0000001A] rounded-[8px] p-2 justify-between flex-wrap">
                    <div className="flex flex-1">
                        <img src={PdfIcon} alt="" />
                        <div className="mx-2">
                            <p className="sm:text-md text-sm">{fileName}</p>
                            <p className="text-[#05050599] text-sm">
                                {formatFileSize(fileSize)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center flex-end  ">
                        <div
                            className="flex  items-center "
                            onClick={downloadFile}
                        >
                            <RxDownload
                                color="#D95B0E"
                                size={22}
                                style={{ marginRight: "5px" }}
                            />
                            <p className="cursor-pointer text-sm">Download</p>
                        </div>
                        <div className="flex px-2 items-center">
                            <FiShare2
                                color="#D95B0E"
                                size={22}
                                style={{ marginRight: "5px" }}
                            />
                            <a
                                href="#"
                                onClick={() => {
                                    setOpenShareConversationModal(true)
                                }}
                            >
                                <p className="cursor-pointer text-sm">Share</p>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </Drawer>
    )
}
export default InquiryDetails
