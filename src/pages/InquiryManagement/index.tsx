import {
    Layout,
    StatisticsCard,
    InquiryTable,
    Button,
    Input,
    InquiryDetails,
    RespondModal,
    EmptyState,
    LoadingState,
    FilterModal,
    Radio,
    Combobox,
} from "@components/index"
import { BiSearch } from "react-icons/bi"
import { IoFilter } from "react-icons/io5"
import Profile from "@assets/icons/profile.svg"
import InquiryIcon from "@assets/icons/inquiries.svg"
import Events from "@assets/icons/event.svg"
import { useState, useMemo, useEffect } from "react"
import useAuth from "@hooks/auth/useAuth"
import { useGetInquiries, useGetPortalInquiries } from "@hooks/useInquiry"
import { fetchDashboardStats } from "@services/inquiry"
import { useQuery } from "@tanstack/react-query"
import ErrorComponent from "@components/errorComponent"
import { countActiveFilters, dateRanges } from "@utils/helpers"
import { fetchTalents } from "@services/talents"
import useInquiryManagement from "@hooks/useInquiryManagement"

interface Talent {
    _id: string
    fullName: string
    stageName?: string
}
interface Filter {
    inquiryType: string
    talentIDs: string[]
    startDate: string
    endDate: string
}

const InquiryManagent = () => {
    const [openRespondModal, setOpenRespondModal] = useState(false)
    const {
        openInquiryDetails,
        inquiryDetails,
        setOpenInquiryDetails,
        setInquiryDetails,
        setInquiries,
    } = useInquiryManagement()

    const [filters, setFilters] = useState<Filter>({
        talentIDs: [],
        startDate: "",
        endDate: "",
        inquiryType: "",
    })
    const { today, lastWeek, lastMonth, lastYear } = dateRanges
    const [openFilter, setOpenFilter] = useState(false)

    const talentsQuery = useQuery({
        queryKey: ["talents"],
        staleTime: 1000 * 60 * 2,
        queryFn: () => fetchTalents(),
    })

    const [queryFilters, setQueryFilters] = useState<Filter>({
        talentIDs: [],
        startDate: "",
        endDate: "",
        inquiryType: "",
    })

    const { state } = useAuth()
    const userState = useMemo(() => {
        return state.user
    }, [state.user])
    const userType = userState?.userType

    const {
        isLoading,
        data,
        error: inquiryError,
    } = useGetInquiries({
        userType: userState?.userType || "",
        filters: queryFilters,
    })

    const {
        data: inquiryData,
        isLoading: isLoaingInquiryData,
        error: portalInquiryError,
    } = useGetPortalInquiries(userState?.userType || "")

    const {
        data: inquiryStats,
        isLoading: isLoadingStat,
        error: inquiryStatsError,
    } = useQuery({
        queryKey: ["stats"],
        queryFn: () => fetchDashboardStats(),
        enabled: userType !== "client",
    })

    const [filteredTalents, setFilteredTalents] = useState<Talent[]>([])

    const filteredPortalInquiries = inquiryData?.data.filter((inquiry) => {
        const { startDate, endDate, inquiryType, talentIDs } = filters

        const startFilter = startDate ? new Date(startDate) : null
        const endFilter = endDate ? new Date(endDate) : null

        if (endFilter) {
            endFilter.setHours(23, 59, 59, 999)
        }

        const createdAt = new Date(inquiry.createdAt)

        const matchesDateRange =
            (!startFilter || createdAt >= startFilter) &&
            (!endFilter || createdAt <= endFilter)

        const matchesInquiryType =
            !inquiryType || inquiry.inquiryType === inquiryType

        const matchesTalentIDs =
            !talentIDs?.length || talentIDs.includes(inquiry.talentID)

        return matchesDateRange && matchesInquiryType && matchesTalentIDs
    })

    useEffect(() => {
        setInquiries(
            userType === "client"
                ? filteredPortalInquiries || []
                : data?.data || []
        )
    }, [inquiryData, data?.data])

    return (
        <Layout>
            <RespondModal
                opened={openRespondModal}
                setOpened={setOpenRespondModal}
            />

            <FilterModal
                applyFilters={() => {
                    setQueryFilters(filters)
                }}
                clearFilters={() => {
                    setFilters({
                        talentIDs: [],
                        startDate: "",
                        endDate: "",
                        inquiryType: "",
                    })
                    setFilteredTalents([])
                    setQueryFilters({
                        talentIDs: [],
                        startDate: "",
                        endDate: "",
                        inquiryType: "",
                    })
                }}
                opened={openFilter}
                setOpened={setOpenFilter}
            >
                {!["talent", "client"].includes(userType || "") && (
                    <div className="mb-6">
                        <p className="font-semibold text-[16px] leading-6 mb-2">
                            Talents
                        </p>
                        <Combobox
                            placeholder="Search your talents"
                            multiple
                            options={
                                talentsQuery.data?.data.map(
                                    (talent: Talent) => ({
                                        id: talent._id,
                                        name: talent.fullName,
                                    })
                                ) || []
                            }
                            value={
                                filteredTalents.map((talent: Talent) => ({
                                    id: talent._id,
                                    name: talent.fullName,
                                })) || []
                            }
                            onChange={(selectedTalents: any) => {
                                const mappedTalents: Talent[] =
                                    selectedTalents.map((talent: any) => ({
                                        _id: talent.id,
                                        fullName: talent.name,
                                    }))
                                setFilteredTalents(mappedTalents)
                                setFilters({
                                    ...filters,
                                    talentIDs: mappedTalents.map(
                                        (talent) => talent._id
                                    ),
                                })
                            }}
                        />
                    </div>
                )}

                <p className="font-semibold text-[16px] leading-6 mt-7">
                    Date Created
                </p>
                <div className="flex items-center gap-2 flex-wrap justify-between mt-3">
                    <Input
                        type="date"
                        className="border border-[#382828] rounded-2xl basis-[45%] min-w-[200px] p-4 h-[50px] text-[12px] text-grey-100 font-medium"
                        value={filters.startDate}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                startDate: e.target.value,
                            })
                        }
                    />
                    <span className="text-[12px] text-grey-100">to</span>
                    <Input
                        type="date"
                        className="border border-[#E0E0E0] rounded-2xl basis-[45%] min-w-[200px] p-4 h-[50px] text-[12px] text-grey-100 font-medium"
                        value={filters.endDate}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                endDate: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="flex gap-2 flex-wrap items-center mt-4">
                    <button
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors"
                        onClick={() =>
                            setFilters({
                                ...filters,
                                startDate: today,
                                endDate: today,
                            })
                        }
                    >
                        Today
                    </button>
                    <button
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors"
                        onClick={() =>
                            setFilters({
                                ...filters,
                                startDate: lastWeek,
                                endDate: today,
                            })
                        }
                    >
                        Last week
                    </button>
                    <button
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors"
                        onClick={() =>
                            setFilters({
                                ...filters,
                                startDate: lastMonth,
                                endDate: today,
                            })
                        }
                    >
                        Last month
                    </button>
                    <button
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors"
                        onClick={() =>
                            setFilters({
                                ...filters,
                                startDate: lastYear,
                                endDate: today,
                            })
                        }
                    >
                        Last year
                    </button>
                    <button
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors"
                        onClick={() =>
                            setFilters({
                                ...filters,
                                startDate: "",
                                endDate: "",
                            })
                        }
                    >
                        Clear
                    </button>
                </div>
                <p className="font-semibold text-[16px] leading-6 mt-7">
                    Inquiry Type
                </p>
                <div className="flex mt-2 flex-wrap gap-4">
                    <label
                        className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${!filters.inquiryType && "bg-black-100 text-white-100 transition-colors"}`}
                    >
                        <Radio
                            checked={!filters.inquiryType}
                            color="fff"
                            onChange={() =>
                                setFilters({
                                    ...filters,
                                    inquiryType: "",
                                })
                            }
                        />{" "}
                        All
                    </label>
                    <label
                        className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.inquiryType === "booking" && "bg-black-100 text-white-100 transition-colors"}`}
                    >
                        <Radio
                            checked={filters.inquiryType === "booking"}
                            color="fff"
                            onChange={() =>
                                setFilters({
                                    ...filters,
                                    inquiryType: "booking",
                                })
                            }
                        />{" "}
                        Booking
                    </label>
                    <label
                        className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.inquiryType === "proposal" && "bg-black-100 text-white-100 transition-colors"}`}
                    >
                        <Radio
                            checked={filters.inquiryType === "proposal"}
                            color="fff"
                            onChange={() =>
                                setFilters({
                                    ...filters,
                                    inquiryType: "proposal",
                                })
                            }
                        />{" "}
                        Proposal
                    </label>
                    <label
                        className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.inquiryType === "collaboration" && "bg-black-100 text-white-100 transition-colors"}`}
                    >
                        <Radio
                            checked={filters.inquiryType === "collaboration"}
                            color="fff"
                            onChange={() =>
                                setFilters({
                                    ...filters,
                                    inquiryType: "collaboration",
                                })
                            }
                        />{" "}
                        Collaboration
                    </label>
                </div>
            </FilterModal>

            <InquiryDetails
                opened={openInquiryDetails}
                setOpened={setOpenInquiryDetails}
                data={inquiryDetails}
            />
            {isLoading || isLoaingInquiryData || isLoadingStat ? (
                <LoadingState />
            ) : inquiryStatsError || portalInquiryError || inquiryError ? (
                <ErrorComponent />
            ) : (
                <div className="pt-24 px-4">
                    {userType !== "client" && (
                        <div>
                            <p className="text-3md sm:text-lg md:mb-0 mb-4 py-4">
                                Inquiry Management (
                                {inquiryStats?.data.total || 0})
                            </p>
                            <div className="sm:flex gap-4  mt-4 w-full">
                                <StatisticsCard
                                    title={"Collaborations"}
                                    total={
                                        inquiryStats?.data.collaboration || 0
                                    }
                                    icon={Profile}
                                />
                                <StatisticsCard
                                    title={"Proposals"}
                                    total={inquiryStats?.data.proposal || 0}
                                    icon={InquiryIcon}
                                />
                                <StatisticsCard
                                    title={"Bookings"}
                                    total={inquiryStats?.data.booking || 0}
                                    icon={Events}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-10">
                        <p className="text-[20px] font-medium">
                            {userType === "client" ? "Sent" : "Received"}{" "}
                            Inquiries
                        </p>
                        <div className="sm:flex hidden">
                            <Button
                                variant="clear"
                                className={`rounded-[35px] flex gap-2 !justify-between`}
                                onClick={() => setOpenFilter(true)}
                            >
                                Filters
                                {countActiveFilters(queryFilters) > 0 ? (
                                    <span className="py-0.5 px-2 text-sm rounded-full bg-black-100 text-white-100">
                                        {countActiveFilters(queryFilters)}
                                    </span>
                                ) : (
                                    <IoFilter />
                                )}
                            </Button>
                            <Input
                                placeholder="Search Talent"
                                className=" border border-[#E0E0E0] rounded-2xl w-[200px] xl:w-[300px] p-4 h-[50px] text-[12px] text-grey-100 font-medium ml-4"
                                prefixIcon={
                                    <BiSearch
                                        size="30px"
                                        color="black"
                                        className="mr-2"
                                    />
                                }
                            />
                        </div>
                    </div>
                    <div className="flex sm:hidden justify-between mt-4">
                        <Button
                            variant="clear"
                            className={`rounded-[35px] flex gap-2 !justify-between`}
                            onClick={() => setOpenFilter(true)}
                        >
                            Filters
                            {countActiveFilters(queryFilters) > 0 ? (
                                <span className="py-0.5 px-2 text-sm rounded-full bg-black-100 text-white-100">
                                    {countActiveFilters(queryFilters)}
                                </span>
                            ) : (
                                <IoFilter />
                            )}
                        </Button>
                        <Input
                            placeholder="Search Talent"
                            className=" border border-[#E0E0E0] rounded-2xl w-[200px] xl:w-[300px] p-4 h-[50px] text-[12px] text-grey-100 font-medium ml-4"
                            prefixIcon={
                                <BiSearch
                                    size="30px"
                                    color="black"
                                    className="mr-2"
                                />
                            }
                        />
                    </div>

                    <div className="md:bg-white-100 md:p-4 rounded-lg overflow-x-auto overflow-visible mt-8 mb-4">
                        {(userType === "client" &&
                            filteredPortalInquiries &&
                            filteredPortalInquiries.length > 0) ||
                        (data?.data && data.data.length > 0) ? (
                            <InquiryTable
                                handleInquiryDetails={(val) => {
                                    setOpenInquiryDetails(true)
                                    setInquiryDetails(val)
                                }}
                                isClient={userType === "client"}
                                showTalent={userType !== "talent"}
                                //setOpenRespond={setOpenRespondModal}

                                data={
                                    userType === "client"
                                        ? filteredPortalInquiries || []
                                        : data?.data || []
                                }
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

export default InquiryManagent
