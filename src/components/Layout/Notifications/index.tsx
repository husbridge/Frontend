import { fetchNotifications } from "@services/auth"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { NotificationsResponse } from "type/api/auth.types"
import Notification from "./notification"

const Notifications = ({ isOpen }: { isOpen: boolean }) => {
    const [page, setPage] = useState(1)
    const limit = 3

    const [isInquiriesRefetching, setIsInquiriesRefetching] = useState(false)

    const { data, isLoading, isError, refetch, isRefetching } = useQuery({
        queryKey: ["in-app-notifications", page],
        staleTime: 1000 * 60 * 2,
        queryFn: () => fetchNotifications(page.toString(), limit.toString()),
    })

    const queryClient = useQueryClient()
    const refetchInquiries = async () => {
        setIsInquiriesRefetching(true)
        await queryClient.invalidateQueries({ queryKey: ["inquiries"] })
        setIsInquiriesRefetching(false)
    }

    useEffect(() => {
        if (isOpen) {
            refetch()
            refetchInquiries()
        }
    }, [isOpen])

    const notifications: NotificationsResponse[] = data?.data ?? []

    const handleNextPage = () => setPage((prev) => prev + 1)
    const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1))

    if (isLoading)
        return <p className="text-center my-4">Loading notifications...</p>
    if (isError)
        return <p className="text-center my-4">Failed to load notifications.</p>

    return (
        <div className="cursor-default">
            <p className="text-md text-center mb-6 font-semibold">
                Your Notifications
            </p>
            {notifications.length === 0 ? (
                <p className="text-[#475569] text-sm text-center my-4">
                    No notifications available.
                </p>
            ) : (
                notifications?.map((item) => (
                    <Notification key={item._id} item={item} />
                ))
            )}
            {(isRefetching || isInquiriesRefetching) && (
                <p className="text-center my-2">Updating notifications...</p>
            )}

            <div className="flex justify-between mt-4">
                {page > 1 ? (
                    <button
                        onClick={handlePreviousPage}
                        className="px-2.5 py-2 bg-neutral-10 text-[16px] font-semibold rounded-full cursor-pointer"
                    >
                        <LuChevronLeft />
                    </button>
                ) : (
                    <div />
                )}
                <span className="text-sm">{page}</span>
                {notifications.length === limit ? (
                    <button
                        onClick={handleNextPage}
                        className="px-2.5 py-2 bg-neutral-10 text-[16px] font-semibold rounded-full cursor-pointer"
                    >
                        <LuChevronRight />
                    </button>
                ) : (
                    <div />
                )}
            </div>
        </div>
    )
}

export default Notifications
