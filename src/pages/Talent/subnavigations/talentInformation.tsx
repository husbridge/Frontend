import {
    Button,
    StatisticsCard,
    UpcomingEvents,
    EventDetailsModal,
    SetReminderModal,
    InquiryTable,
    Layout,
    EditTalentModal,
    TalentMagicLinkModal,
    InquiryDetails,
    RespondModal,
    EmptyState,
    LoadingState,
} from "@components/index"
import { RiLinksFill } from "react-icons/ri"
// import Avatar from "@assets/images/avatar.png"
import Profile from "@assets/icons/profile.svg"
import InquiryIcon from "@assets/icons/inquiries.svg"
import Events from "@assets/icons/event.svg"
import Booking from "@assets/icons/booking.svg"
import { FaAngleRight } from "react-icons/fa6"
import { useEffect, useState } from "react"
import VerifiedIcon from "@assets/icons/verified.svg"
import { Link, useNavigate, useParams } from "react-router-dom"
import { fetchSingleUser } from "@services/manager"
import { useQuery } from "@tanstack/react-query"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Alert } from "@mantine/core"
import useAuth from "@hooks/auth/useAuth"
import { fetchProfile } from "@services/auth"
import { useGetEvents, useGetEventsByTalentId } from "@hooks/useEvent"
import { useGetInquiriesByTalentId, useGetInquiries } from "@hooks/useInquiry"
import { Data } from "../../../type/api/event.types"
import { Data as InquiryData } from "type/api/inquiry.types"
import Avatar from "@components/Layout/avatar"

const TalentInformation = () => {
    const [username, setUsername] = useState("")
    const [statsData, setStatsData] = useState({
        events: 0,
        bookings: 0,
        proposals: 0,
        collaborations: 0,
    })

    const stats = [
        { title: "Total Events", total: statsData.events, icon: Events },
        { title: "Total Bookings", total: statsData.bookings, icon: Booking },
        {
            title: "Total Proposals",
            total: statsData.proposals,
            icon: InquiryIcon,
        },
        {
            title: "Total Collaborations",
            total: statsData.collaborations,
            icon: Profile,
        },
    ]
    const { state } = useAuth()
    const userType = state.user?.userType

    const navigate = useNavigate()
    const { id } = useParams<string>()
    const [openSetReminder, setOpenSetReminder] = useState(false)
    const [openEventDetails, setOpenEventDetails] = useState(false)
    const [openEditTalent, setOpenEditTalent] = useState(false)
    const [opened, setOpened] = useState(false)
    const [openInquiryDetails, setOpenInquiryDetails] = useState(false)
    const [openRespondModal, setOpenRespondModal] = useState(false)
    const [copied, setCopied] = useState(false)
    const [event, setEvent] = useState<Data>()
    const [inquiryDetails, setInquiryDetails] = useState<InquiryData>()

    const { data, isLoading } = useQuery({
        queryKey: ["singleUser", id],
        queryFn: () => fetchSingleUser({ id: id || "" }),
        enabled: id ? true : false,
    })

    const { data: profileData, isLoading: isLoadingProfile } = useQuery({
        queryKey: ["profile"],
        queryFn: () => fetchProfile(),
        enabled: !id ? true : false,
    })

    // todo: write one single endpoint for profile stats
    const { data: inquiries, isLoading: isLoadingInquiries } =
        useGetInquiriesByTalentId({ id: id || "" })
    const { data: inquiriesData, isLoading: isLoadingInquiriesData } =
        useGetInquiries({ id })
    const { data: eventsData, isLoading: isLoadingEvents } = useGetEvents(id)
    const { data: eventsById, isLoading: isLoadingEventsById } =
        useGetEventsByTalentId({ talentID: id || "" })

    useEffect(() => {
        const totalEvents =
            userType !== "talent"
                ? eventsById?.data.events?.length
                : eventsData?.data.events?.length

        const allInquiries =
            userType !== "talent" ? inquiries?.data : inquiriesData?.data

        const totalBookings = allInquiries?.filter(
            (inquiry) => inquiry.inquiryType === "booking"
        ).length

        const totalProposals = allInquiries?.filter(
            (inquiry) => inquiry.inquiryType === "proposal"
        ).length

        const totalCollaborations = allInquiries?.filter(
            (inquiry) => inquiry.inquiryType === "collaborations"
        ).length

        setStatsData({
            events: totalEvents || 0,
            bookings: totalBookings || 0,
            proposals: totalProposals || 0,
            collaborations: totalCollaborations || 0,
        })
    }, [userType, id, inquiries, inquiriesData, eventsData, eventsById])

    useEffect(() => {
        setUsername(
            id
                ? `${data?.data.firstName.trim()} ${data?.data.lastName.trim()}`
                : `${profileData?.data.firstName.trim()} ${profileData?.data.lastName.trim()}`
        )

        console.log(username)
    }, [id, data, profileData])

    return (
        <Layout>
            <RespondModal
                opened={openRespondModal}
                setOpened={setOpenRespondModal}
            />
            <InquiryDetails
                opened={openInquiryDetails}
                setOpened={setOpenInquiryDetails}
                data={inquiryDetails}
            />
            <SetReminderModal
                opened={openSetReminder}
                setOpened={setOpenSetReminder}
            />
            <EventDetailsModal
                opened={openEventDetails}
                setOpened={setOpenEventDetails}
                handleSetReminder={() => {
                    setOpenEventDetails(false)
                    setOpenSetReminder(true)
                }}
                event={event}
            />
            <EditTalentModal
                opened={openEditTalent}
                setOpened={setOpenEditTalent}
                activeId={id || ""}
            />
            <TalentMagicLinkModal opened={opened} setOpened={setOpened} />
            {isLoading ||
            isLoadingProfile ||
            isLoadingInquiries ||
            isLoadingInquiriesData ||
            isLoadingEvents ||
            isLoadingEventsById ? (
                <LoadingState />
            ) : (
                <div className="p-4 pt-28 ">
                    {userType !== "talent" ? (
                        <p className="text-2md">
                            <Link
                                to={"/talents"}
                                className="text-[#00000066] mr-1"
                            >
                                Talents{" "}
                            </Link>{" "}
                            &gt; Talent Information
                        </p>
                    ) : (
                        <p>
                            <span className="text-[#000000e4] mr-1">
                                Your Profile
                            </span>
                        </p>
                    )}
                    <div className="flex mt-8 items-center">
                        <Avatar
                            size={98}
                            alt={username}
                            imageUrl={
                                id
                                    ? data?.data.profileUrl
                                    : profileData?.data.profileUrl
                            }
                        />
                        <div className="ml-4">
                            <div className="flex">
                                <p className=" sm:text-lg mr-1">
                                    {id
                                        ? data?.data.firstName
                                        : profileData?.data.firstName}
                                </p>
                                <img src={VerifiedIcon} alt="" />
                            </div>
                            <p className="text-[#5F5E5E] text-md mb-2">
                                {id
                                    ? data?.data.emailAddress
                                    : profileData?.data.emailAddress}
                            </p>
                            <div className="flex gap-2">
                                <CopyToClipboard
                                    onCopy={() => {
                                        setCopied(true)
                                        setTimeout(() => {
                                            setCopied(false)
                                        }, 3000)
                                    }}
                                    text={`https://projectx-gamma.vercel.app/contact/${id ? data?.data.uniqueUsername : profileData?.data.uniqueUsername}`}
                                    //text={`http://localhost:5173/contact/${data?.data.uniqueUsername}`}
                                >
                                    <Button
                                        className="flex !text-sm !px-1"
                                        variant="clear"
                                        //onClick={() => setOpened(true)}
                                    >
                                        <RiLinksFill
                                            className="mr-2"
                                            size={18}
                                        />{" "}
                                        Magic Link
                                    </Button>
                                </CopyToClipboard>
                                <Button
                                    className="flex ml-2 !text-sm !text-white-100"
                                    variant="primary"
                                    onClick={() => setOpenEditTalent(true)}
                                >
                                    Edit Profile
                                </Button>
                                {copied && (
                                    <div className="absolute left-30 mt-10">
                                        <Alert
                                            variant="light"
                                            color="blue"
                                            //title="Alert title"
                                        >
                                            Copied
                                        </Alert>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4  mt-8 w-full">
                        {stats.map((item, index) => (
                            <StatisticsCard
                                key={index}
                                title={item.title}
                                total={item.total || 0}
                                icon={item.icon}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mb-4 mt-10">
                        <p className="sm:text-[20px] text-[14px] font-medium">
                            Upcoming Events{" "}
                            {id && `for ${data?.data.firstName}`}
                        </p>
                        <div className="flex items-center cursor-pointer whitespace-nowrap">
                            <p
                                className="text-black-50 text-md whitespace-nowrap"
                                onClick={() => {
                                    state.user?.userType === "talent"
                                        ? navigate("/calendar")
                                        : navigate(`/talents/events/${id}`)
                                }}
                            >
                                See full events
                            </p>
                            <div>
                                <FaAngleRight opacity={0.5} color="#00000080" />
                            </div>
                        </div>
                    </div>

                    <div className="md:flex gap-4 w-full">
                        {userType !== "talent" ? (
                            eventsById?.data.events &&
                            eventsById?.data.events.length > 0 ? (
                                eventsById?.data.events
                                    .slice(0, 3)
                                    .map((item, index) => (
                                        <UpcomingEvents
                                            setOpenModal={() => {
                                                setEvent(item)
                                                setOpenEventDetails(true)
                                            }}
                                            key={index}
                                            event={item}
                                        />
                                    ))
                            ) : (
                                <EmptyState text="No upcoming Events" />
                            )
                        ) : eventsData?.data.events &&
                          eventsData?.data.events.length > 0 ? (
                            eventsData?.data.events
                                .slice(0, 3)
                                .map((item, index) => (
                                    <UpcomingEvents
                                        setOpenModal={() => {
                                            setEvent(item)
                                            setOpenEventDetails(true)
                                        }}
                                        key={index}
                                        event={item}
                                    />
                                ))
                        ) : (
                            <EmptyState text="No upcoming Events" />
                        )}
                    </div>
                    <div className="flex justify-between mb-4 mt-10">
                        <p className="sm:text-[20px] text-[16px] font-medium">
                            Recent Inquiries
                        </p>
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => {
                                state.user?.userType === "talent"
                                    ? navigate("/inquiry-management")
                                    : navigate(`/talents/inquiries/${id}`)
                            }}
                        >
                            <p className="text-black-50 text-md flex">
                                See all{" "}
                                <span className="md:block hidden ml-1">
                                    inquiries
                                </span>
                            </p>
                            <FaAngleRight
                                opacity={0.5}
                                color="#00000080"
                                className="ml-1"
                            />
                        </div>
                    </div>
                    <div className="md:bg-white-100 md:p-4 rounded-lg overflow-x-auto overflow-visible">
                        {(inquiries && inquiries.data.length) ||
                        (inquiriesData && inquiriesData.data.length > 0) ? (
                            <InquiryTable
                                handleInquiryDetails={(val) => {
                                    setOpenInquiryDetails(true)
                                    setInquiryDetails(val)
                                }}
                                //setOpenRespond={setOpenRespondModal}
                                data={
                                    id
                                        ? inquiries?.data.slice(0, 5) || []
                                        : inquiriesData?.data.slice(0, 5) || []
                                }
                                showTalent={false}
                            />
                        ) : (
                            <EmptyState text="No inquiries" />
                        )}
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default TalentInformation
