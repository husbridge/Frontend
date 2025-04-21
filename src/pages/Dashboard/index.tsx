import Events from "@assets/icons/event.svg"
import InquiryIcon from "@assets/icons/inquiries.svg"
import Profile from "@assets/icons/profile.svg"
import {
    AddTalentModal,
    Button,
    EmptyState,
    EventDetailsModal,
    InquiryDetails,
    InquiryTable,
    Layout,
    LoadingState,
    RespondModal,
    SetReminderModal,
    StatisticsCard,
    TalentMagicLinkModal,
} from "@components/index"
import useAuth from "@hooks/auth/useAuth"
import { fetchProfile } from "@services/auth"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { FaAngleRight } from "react-icons/fa6"
import { RiLinksFill } from "react-icons/ri"
import UpcomingEvents from "./components/upcomingEvents"
//import { Results } from "type/api/calendar.types"
import ErrorComponent from "@components/errorComponent"
import { useGetEvents } from "@hooks/useEvent"
import { Alert } from "@mantine/core"
import { fetchInquiries } from "@services/inquiry"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { BsFillInfoCircleFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import { Data as InquiryData } from "type/api/inquiry.types"
import { Data } from "../../type/api/event.types"
import { frontendUrl } from "@services/api.services"

const Dashboard = () => {
    const navigate = useNavigate()

    const [opened, setOpened] = useState(false)
    const [openSetReminder, setOpenSetReminder] = useState(false)
    const [openEventDetails, setOpenEventDetails] = useState(false)
    const [openInquiryDetails, setOpenInquiryDetails] = useState(false)
    const [openRespondModal, setOpenRespondModal] = useState(false)
    const [copied, setCopied] = useState(false)
    const [openAddTalent, setOpenAddTalent] = useState(false)
    const [event, setEvent] = useState<Data>()
    const [inquiryDetails, setInquiryDetails] = useState<InquiryData>()
    const { state } = useAuth()
    const {
        data,
        isLoading,
        error: profileError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: () => fetchProfile(),
    })
    const stage = data?.data.registrationStage
    const userType = state.user?.userType
    const [talentCount, setTalentCount] = useState(0)
    const {
        data: eventData,
        isLoading: isLoadingEvents,
        error: eventError,
    } = useGetEvents()

    const {
        data: inquiryData,
        isLoading: isLoadingInquiry,
        error: inquiryError,
    } = useQuery({
        queryKey: ["inquiries"],
        queryFn: () => fetchInquiries(),
    })
    const userState = useMemo(() => {
        return state.user
    }, [state.user])

    if (userState?.userType === "client") {
        navigate("/inquiry-management")
    }
    useEffect(() => {
        if (userType === "agency") {
            setTalentCount(
                data?.data?.agency?.staffs.filter(
                    (item) => item.userType === "talent"
                ).length || 0
            )
        } else if (userType === "manager") {
            setTalentCount(data?.data?.managing?.length || 0)
        }
    }, [userType, data])
    return (
        <>
            {isLoading || isLoadingInquiry || isLoadingEvents ? (
                <LoadingState />
            ) : profileError || eventError || inquiryError ? (
                <ErrorComponent />
            ) : (
                <Layout pageTitle="Dashboard" search>
                    <AddTalentModal
                        opened={openAddTalent}
                        setOpened={setOpenAddTalent}
                    />
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
                    <TalentMagicLinkModal
                        opened={opened}
                        setOpened={setOpened}
                    />
                    <div className="p-4 pt-44 lg:pt-28">
                        {data?.data?.registrationStage !== "completed" && (
                            <div className="flex  bg-[#FFF4D9] px-2  mb-2">
                                <BsFillInfoCircleFill
                                    size={50}
                                    className="text-[#FFB400] mt-3"
                                />

                                <p className="text-md sm:text-2md md:text-[14px] font-normal p-2 leading-6 tracking-[0.5px]">
                                    You are yet to complete your account
                                    registration.
                                    <span
                                        className="font-bold cursor-pointer"
                                        onClick={() => {
                                            stage === "agency"
                                                ? navigate("/agency-signup", {
                                                      state: { key: 1 },
                                                  })
                                                : stage == "manager"
                                                  ? navigate(
                                                        "/manager-signup",
                                                        {
                                                            state: { key: 1 },
                                                        }
                                                    )
                                                  : stage == "profile" &&
                                                      userType === "agency"
                                                    ? navigate(
                                                          "/agency-signup",
                                                          {
                                                              state: { key: 2 },
                                                          }
                                                      )
                                                    : stage == "profile" &&
                                                        userType === "manager"
                                                      ? navigate(
                                                            "/manager-signup",
                                                            {
                                                                state: {
                                                                    key: 2,
                                                                },
                                                            }
                                                        )
                                                      : stage == "profile" &&
                                                          userType ===
                                                              "talent" &&
                                                          state.user
                                                              ?.firstName === ""
                                                        ? navigate(
                                                              "/talent-signup",
                                                              {
                                                                  state: {
                                                                      key: 1,
                                                                  },
                                                              }
                                                          )
                                                        : navigate(
                                                              "/talent-signup",
                                                              {
                                                                  state: {
                                                                      key: 2,
                                                                  },
                                                              }
                                                          )
                                        }}
                                    >
                                        {" "}
                                        Click here
                                    </span>{" "}
                                    to complete it and begin to enjoy Husridge
                                    management software.
                                </p>
                            </div>
                        )}

                        <div className="sm:flex justify-between items-center pt-2 ">
                            <p className="text-3md sm:text-lg md:mb-0 mb-4">
                                Hello{" "}
                                {state.user?.firstName || state.user?.fullName}
                            </p>
                            <div className="flex">
                                {!["talent", "client", "manager"].includes(
                                    userType || ""
                                ) && (
                                    <Button
                                        className="flex text-white-100"
                                        variant="black"
                                        onClick={() => setOpenAddTalent(true)}
                                    >
                                        <FaPlus
                                            color="white"
                                            className="mr-2"
                                        />{" "}
                                        Add Talent
                                    </Button>
                                )}
                                {userType === "talent" ? (
                                    <CopyToClipboard
                                        onCopy={() => {
                                            setCopied(true)
                                            setTimeout(() => {
                                                setCopied(false)
                                            }, 2000)
                                        }}
                                        text={`${frontendUrl()}/contact/${data?.data.uniqueUsername}`}
                                    >
                                        <Button
                                            className="flex ml-4"
                                            variant="clear"
                                        >
                                            <RiLinksFill
                                                className="mr-2"
                                                size={24}
                                            />{" "}
                                            Magic Link
                                        </Button>
                                    </CopyToClipboard>
                                ) : (
                                    <Button
                                        className="flex ml-4"
                                        variant="clear"
                                        onClick={() => setOpened(true)}
                                    >
                                        <RiLinksFill
                                            className="mr-2"
                                            size={24}
                                        />{" "}
                                        Magic Link
                                    </Button>
                                )}
                            </div>
                            {copied && (
                                <div className="absolute right-0 mt-10">
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
                        <div className="sm:flex gap-4  mt-4 w-full">
                            {userType !== "talent" && (
                                <StatisticsCard
                                    title={"Total Talents"}
                                    total={talentCount}
                                    icon={Profile}
                                />
                            )}

                            <StatisticsCard
                                title={"Total Inquiries"}
                                total={inquiryData?.data.length || 0}
                                icon={InquiryIcon}
                            />
                            <StatisticsCard
                                title={"Total Events"}
                                total={eventData?.data.total || 0}
                                icon={Events}
                            />
                        </div>
                        <div className="flex justify-between mb-4 mt-10">
                            <p className="sm:text-[20px] text-[16px] font-medium">
                                Upcoming Events
                            </p>
                            <div
                                className="flex items-center cursor-pointer"
                                onClick={() => navigate("/calendar")}
                            >
                                <p className="text-black-50 text-md flex">
                                    See full{" "}
                                    <span className="md:block hidden ml-1">
                                        events
                                    </span>
                                </p>
                                <FaAngleRight
                                    opacity={0.5}
                                    color="#00000080"
                                    className="ml-2"
                                />
                            </div>
                        </div>
                        <div className="md:flex gap-4 w-full">
                            {eventData?.data.events &&
                            eventData.data.events.length > 0 ? (
                                eventData.data.events
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
                                onClick={() => navigate("/inquiry-management")}
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
                                    className="ml-2"
                                />
                            </div>
                        </div>
                        <div className="md:bg-white-100 md:p-4 rounded-lg overflow-x-auto overflow-visible">
                            {inquiryData !== undefined &&
                            inquiryData.data.length > 0 ? (
                                <InquiryTable
                                    handleInquiryDetails={(val) => {
                                        setOpenInquiryDetails(true)
                                        setInquiryDetails(val)
                                    }}
                                    //setOpenRespond={setOpenRespondModal}
                                    data={inquiryData.data.slice(0, 4) || []}
                                />
                            ) : (
                                <EmptyState text="No inquiries" />
                            )}
                        </div>
                    </div>
                </Layout>
            )}
        </>
    )
}

export default Dashboard
