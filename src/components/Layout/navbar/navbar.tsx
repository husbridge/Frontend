import { NavBarInterface } from "../../../type/Layout/layout-interface"
import notificationIcon from "@assets/icons/notification.svg"
import { Input } from "@components/index"
import { BiSearch } from "react-icons/bi"
// import Avatar from "@assets/icons/avatar.svg"
//import { FiChevronDown } from "react-icons/fi"
import { HiMenuAlt2 } from "react-icons/hi"
import MessageIcon from "@assets/icons/message.svg"
//import { useState } from "react"
//import { useMediaQuery } from "@mantine/hooks"
import Notifications from "../Notifications"
import { Popover } from "@mantine/core"
import { fetchNotifications } from "@services/auth"
import { useQuery } from "@tanstack/react-query"
import { NotificationsResponse } from "type/api/auth.types"
import { useState } from "react"
import Avatar from "../avatar"
import useAuth from "@hooks/auth/useAuth"
import { jwtDecode } from "jwt-decode"
import { DecodedUser } from "@components/Layout/sidebar/clientSidebar"
import { Link } from "react-router-dom"
import { useNotificationStore } from "@hooks/useNotificationStore"

const Navbar = ({ setOpenSideBar, search }: NavBarInterface) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    //const [openNotification, setOpenNotification] = useState(false)
    //const [openProfile, setOpenProfile] = useState(false)
    // const matches = useMediaQuery("(min-width: 650px)")

    const { state } = useAuth()
    const isClient = state.user?.userType === "client"
    const decoded = isClient
        ? (jwtDecode(state.user?.accessToken || "") as DecodedUser)
        : null
    const { data } = useQuery({
        queryKey: ["in-app-notifications"],
        staleTime: 3000,
        enabled: !isClient,
        queryFn: () => fetchNotifications(),
    })
    // const reset = useNotificationStore((state) => state.reset)
    const chatGroupIds = useNotificationStore((state) => state.chatGroupIds)
    const newMessageCount = new Set(chatGroupIds).size

    const notifications: NotificationsResponse[] = data?.data ?? []
    const unreadCount = notifications.filter((item) => !item.isRead).length
    const [showCount, setShowCount] = useState(true)
    const username = !isClient
        ? state.user?.fullName
            ? state.user?.fullName
            : state.user?.firstName
        : decoded?.fullName

    return (
        <div className="bg-white-100 rounded-tl-[40px] border-b">
            <nav className={`w-full px-4 sm:px-10 py-6  `}>
                <div
                    className={`sm:flex ${search ? "justify-between" : "justify-end"}  items-center  hidden`}
                >
                    <HiMenuAlt2
                        size={28}
                        onClick={() => setOpenSideBar(true)}
                        className={`lg:hidden ${!search && "absolute left-6"}`}
                    />
                    {search && (
                        <Input
                            placeholder="Search Husridge"
                            className=" border border-[#E0E0E0] rounded-2xl w-[200px] xl:w-[300px] p-4 h-[50px] text-[12px] text-grey-100 font-medium"
                            prefixIcon={
                                <BiSearch
                                    size="30px"
                                    color="black"
                                    className="mr-2"
                                />
                            }
                        />
                    )}

                    <div className="flex place-self-end gap-x-6 cursor-pointer">
                        <Link
                            to="/messaging"
                            className="relative"
                            // onClick={() => reset()}
                        >
                            {newMessageCount > 0 && (
                                <span className="bg-yellow-100 rounded-full py-1 px-2 text-xs font-bold absolute top-0 right-0">
                                    {newMessageCount}
                                </span>
                            )}
                            <img
                                src={MessageIcon}
                                alt="Message"
                                //onClick={() =>
                                //setOpenNotification(true)}
                            />
                        </Link>
                        {!isClient && (
                            <Popover
                                width={450}
                                position="bottom-end"
                                withArrow
                                shadow="md"
                                withinPortal={false}
                                onOpen={() => setIsPopoverOpen(true)}
                                onClose={() => setIsPopoverOpen(false)}
                                styles={{
                                    dropdown: { right: 10, marginRight: 50 },
                                }}
                            >
                                <Popover.Target>
                                    <div
                                        onClick={() => setShowCount(false)}
                                        className="relative flex"
                                    >
                                        {showCount && unreadCount > 0 && (
                                            <span className="bg-yellow-100 rounded-full py-1 px-2 text-xs font-bold absolute top-0 right-0">
                                                {unreadCount}
                                            </span>
                                        )}
                                        <img
                                            src={notificationIcon}
                                            className="my-auto"
                                            alt="Notification"
                                        />
                                    </div>
                                </Popover.Target>
                                <Popover.Dropdown className="mr-2">
                                    <Notifications isOpen={isPopoverOpen} />
                                </Popover.Dropdown>
                            </Popover>
                        )}
                        <Avatar
                            alt={username}
                            size={38}
                            link={"/settings"}
                            imageUrl={state.user?.profilePhotoUrl}
                        />
                    </div>
                </div>
                <div className="sm:hidden block">
                    <div className="flex justify-between items-center">
                        <div className=" cursor-pointer">
                            <HiMenuAlt2
                                size={28}
                                onClick={() => setOpenSideBar(true)}
                            />
                        </div>
                        <div className="flex  gap-x-6 cursor-pointer">
                            <Link
                                to="/messaging"
                                className="relative"
                                // onClick={() => reset()}
                            >
                                {newMessageCount > 0 && (
                                    <span className="bg-yellow-100 rounded-full py-1 px-2 text-xs font-bold absolute top-0 right-0">
                                        {newMessageCount}
                                    </span>
                                )}
                                <img
                                    src={MessageIcon}
                                    alt="Message"
                                    //onClick={() =>
                                    //setOpenNotification(true)}
                                />
                            </Link>
                            {!isClient && (
                                <Popover
                                    //classNames={{dropdown:"w-full"}}
                                    width={"100%"}
                                    position="bottom-end"
                                    withArrow
                                    shadow="md"
                                    withinPortal={false}
                                    styles={{
                                        dropdown: {
                                            right: 10,
                                            marginRight: 50,
                                        },
                                    }}
                                >
                                    <Popover.Target>
                                        <div
                                            onClick={() => setShowCount(false)}
                                            className="relative flex"
                                        >
                                            {showCount && unreadCount > 0 && (
                                                <span className="bg-yellow-100 rounded-full py-1 px-2 text-xs font-bold absolute top-0 right-0">
                                                    {unreadCount}
                                                </span>
                                            )}
                                            <img
                                                className="my-auto"
                                                src={notificationIcon}
                                                alt="Notification"
                                            />
                                        </div>
                                    </Popover.Target>
                                    <Popover.Dropdown className="mr-2">
                                        <Notifications isOpen={isPopoverOpen} />
                                    </Popover.Dropdown>
                                </Popover>
                            )}
                            <Avatar
                                alt={username}
                                size={38}
                                link={"/settings"}
                                imageUrl={state.user?.profilePhotoUrl}
                            />
                        </div>
                    </div>
                    {search && (
                        <Input
                            placeholder="Search Husridge"
                            className=" border border-[#E0E0E0] rounded-2xl w-[200px] xl:w-[300px] p-4 h-[50px] text-[12px] text-grey-100 font-medium mt-4"
                            prefixIcon={
                                <BiSearch
                                    size="30px"
                                    color="black"
                                    className="mr-2"
                                />
                            }
                        />
                    )}
                </div>
            </nav>
        </div>
    )
}

export default Navbar
