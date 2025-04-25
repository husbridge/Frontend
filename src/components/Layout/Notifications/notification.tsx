import ConsultationIcon from "@assets/icons/consultation.svg"
import PaymentFailedIcon from "@assets/icons/paymenetFailed.svg"
import PaymentMadeIcon from "@assets/icons/paymentMade.svg"
import useAuth from "@hooks/auth/useAuth"
import { useGetInquiries } from "@hooks/useInquiry"
import useInquiryManagement from "@hooks/useInquiryManagement"
import { markNotificationAsRead } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { formatShortDateTime } from "@utils/helpers"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationsResponse } from "type/api/auth.types"

const ICONS = {
    paymentMade: PaymentMadeIcon,
    paymentFailed: PaymentFailedIcon,
    inquiry: ConsultationIcon,
}

const Notification = ({ item }: { item: NotificationsResponse }) => {
    const navigate = useNavigate()

    const setOpenInquiryDetails = useInquiryManagement(
        (state) => state.setOpenInquiryDetails
    )
    const setInquiryDetails = useInquiryManagement(
        (state) => state.setInquiryDetails
    )

    const { state } = useAuth()
    const userState = useMemo(() => {
        return state.user
    }, [state.user])

    const { data } = useGetInquiries({
        userType: userState?.userType || "",
    })

    const inquiries = data?.data || []

    const handleClick = (item: NotificationsResponse) => {
        if (item.type === "inquiry") {
            setInquiryDetails(
                inquiries.find((i) => i._id === item.metadata.inquiryId)
            )
            setOpenInquiryDetails(true)
            navigate("/inquiry-management")
        }
        if (!item.isRead) {
            onReadNotification.mutate(item._id)
        }
    }

    const onReadNotification = useMutation({
        mutationFn: markNotificationAsRead,
    })

    useEffect(() => {
        if (!item.isRead) {
            const timer = setTimeout(() => {
                onReadNotification.mutate(item._id)
            }, 1200)
            return () => clearTimeout(timer)
        }
    }, [item._id, item.isRead, onReadNotification])

    const inquiry = inquiries.find((i) => i._id === item.metadata.inquiryId)
    if (item.type === "inquiry" && !inquiry) {
        return null
    }

    return (
        <div
            onClick={() => handleClick(item)}
            className={`flex animate-fadeIn cursor-pointer border-b border-[#CBD5E14D] py-4 px-2 rounded ${!item.isRead && "bg-neutral-5"}`}
        >
            <img
                src={
                    item.type === "paymentMade"
                        ? ICONS.paymentMade
                        : item.type === "paymentFailed"
                          ? ICONS.paymentFailed
                          : ConsultationIcon
                }
                alt=""
            />
            <div className="ml-4">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-md">{item.title}</p>
                    <span className="text-[#475569] text-[10px]">
                        {formatShortDateTime(item.createdAt)}
                    </span>
                </div>
                <p className="text-[#475569] text-md">{item.content}</p>
            </div>
        </div>
    )
}

export default Notification
