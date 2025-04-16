import ConsultationIcon from "@assets/icons/consultation.svg"
import PaymentFailedIcon from "@assets/icons/paymenetFailed.svg"
import PaymentMadeIcon from "@assets/icons/paymentMade.svg"
import useInquiryManagement from "@hooks/useInquiryManagement"
import { markNotificationAsRead } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { formatShortDateTime } from "@utils/helpers"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NotificationsResponse } from "type/api/auth.types"

const Notification = ({ item }: { item: NotificationsResponse }) => {
    const navigate = useNavigate()
    const inquiries = useInquiryManagement((state) => state.inquiries)
    const setOpenInquiryDetails = useInquiryManagement(
        (state) => state.setOpenInquiryDetails
    )
    const setInquiryDetails = useInquiryManagement(
        (state) => state.setInquiryDetails
    )

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
    }, [])

    const inquiry = inquiries.find((i) => i._id === item.metadata.inquiryId)
    if (!inquiry) {
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
                        ? PaymentMadeIcon
                        : item.type === "paymentFailed"
                          ? PaymentFailedIcon
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
