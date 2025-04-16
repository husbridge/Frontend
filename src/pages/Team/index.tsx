import {
    Layout,
    Button,
    StatisticsCard,
    Input,
    AddManager,
    TeamMemberDetails,
    ReactivateManagerModal,
    SuspendManagerModal,
    DeactivateManagerModal,
    AccountDeactivated,
    AccountSuspendedModal,
    AccountReactivated,
    LoadingState,
    AssignManagerModal,
    FilterModal,
    Radio,
} from "@components/index"
import { FaPlus } from "react-icons/fa"
import { useState } from "react"
import Profile from "@assets/icons/profile.svg"
import InquiryIcon from "@assets/icons/inquiries.svg"
import Events from "@assets/icons/event.svg"
import { BiSearch } from "react-icons/bi"
import TeamTable from "./components/teamTable"
import { IoFilter } from "react-icons/io5"
import { useMediaQuery } from "@mantine/hooks"
import { fetchManagers, fetchManagerStats } from "@services/manager"
import { useQuery } from "@tanstack/react-query"
import ErrorComponent from "@components/errorComponent"
import { countActiveFilters, dateRanges } from "@utils/helpers"

const Team = () => {
    const [openAddManager, setOpenAddManager] = useState(false)
    const [openTeamMemberDetails, setOpenTeamMemberDetails] = useState(false)
    const [openReactivateManager, setOpenReactivateManager] = useState(false)
    const [openSuspendManager, setOpenSuspendManager] = useState(false)
    const [openSuspendedManager, setOpenSuspendedManager] = useState(false)
    const [openDeactivateManager, setOpenDeactivateManager] = useState(false)
    const [openDeactivatedManager, setOpenDeactivatedManager] = useState(false)
    const [openReactivatedManager, setOpenReactivatedManager] = useState(false)
    const [openAssignManager, setOpenAssignManager] = useState(false)

    const [activeId, setActiveId] = useState("")

    const {
        data: managersStat,
        isLoading: isLoadingStat,
        error: managerStatsError,
    } = useQuery({
        queryKey: ["managerStat"],
        queryFn: () => fetchManagerStats(),
    })
    const stats = [
        {
            title: "Active Managers",
            total: managersStat?.data.activeManagers,
            icon: Profile,
        },
        {
            title: "Suspended Managers",
            total: managersStat?.data.suspendManagers,
            icon: InquiryIcon,
        },
        {
            title: "Deactivated Managers",
            total: managersStat?.data.deactivatedManagers,
            icon: Events,
        },
    ]
    const [filters, setFilters] = useState({
        status: "",
        startDate: "",
        endDate: "",
    })

    const [queryFilters, setQueryFilters] = useState({
        status: "",
        startDate: "",
        endDate: ""
    })

    const { data, isLoading, error } = useQuery({
        queryKey: ["managers", queryFilters],
        queryFn: () => fetchManagers(queryFilters),
    })
    const [openFilter, setOpenFilter] = useState(false)
    const { today, lastWeek, lastMonth, lastYear } = dateRanges;
    

    const matches = useMediaQuery("(min-width: 480px)")

    return (
        <Layout>
            <AddManager opened={openAddManager} setOpened={setOpenAddManager} />
            <TeamMemberDetails
                opened={openTeamMemberDetails}
                setOpened={setOpenTeamMemberDetails}
                id={activeId}
            />

            <ReactivateManagerModal
                opened={openReactivateManager}
                setOpened={setOpenReactivateManager}
                setOpenReactivatedModal={setOpenReactivatedManager}
                id={activeId}
            />

            <SuspendManagerModal
                opened={openSuspendManager}
                setOpened={setOpenSuspendManager}
                setOpenSuspendedModal={setOpenSuspendedManager}
                id={activeId}
            />

            <DeactivateManagerModal
                opened={openDeactivateManager}
                setOpened={setOpenDeactivateManager}
                setOpenDeactivatedModal={setOpenDeactivatedManager}
                id={activeId}
            />
            <AccountDeactivated
                opened={openDeactivatedManager}
                setOpened={setOpenDeactivatedManager}
            />
            <AccountSuspendedModal
                opened={openSuspendedManager}
                setOpened={setOpenSuspendedManager}
            />
            <AccountReactivated
                opened={openReactivatedManager}
                setOpened={setOpenReactivatedManager}
            />
            <AssignManagerModal
                activeId={activeId}
                opened={openAssignManager}
                setOpened={setOpenAssignManager}
            />

            <FilterModal 
                applyFilters={()=> {
                    setQueryFilters(filters)
                }}
                clearFilters={() => {
                    setFilters({
                        status: "",
                        startDate: "",
                        endDate: "",
                    })
                    setQueryFilters({
                        status: "",
                        startDate: "",
                        endDate: "",
                    })
                }}
                opened={openFilter} 
                setOpened={setOpenFilter}>
                <p className="font-semibold text-[16px] leading-6">Manager Status</p>
                <div className="flex mt-2 flex-wrap gap-4">
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${!filters.status && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={!filters.status}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                status: ""
                            })}
                        />{" "}
                        All
                    </label>

                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.status ==="active" && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={filters.status === "active"}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                status: "active"
                            })}
                        />{" "}
                        Active
                    </label>
                    
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.status ==="suspend" && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={filters.status === "suspend"}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                status: "suspend"
                            })}
                        />{" "}
                        Suspended
                    </label>

                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.status ==="deactivated" && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={filters.status === "deactivated"}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                status: "deactivated"
                            })}
                        />{" "}
                        Deactivated
                    </label>
                   
                  </div>

                  <p className="font-semibold text-[16px] leading-6 mt-7">Date Added</p>
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
                        onClick={() => setFilters({
                            ...filters,
                            startDate: today,
                            endDate: today,
                        })}
                    >
                        Today
                    </button>
                    <button 
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors" 
                        onClick={() => setFilters({
                            ...filters,
                            startDate:  lastWeek,
                            endDate: today,
                        })}
                    >
                        Last week
                    </button>
                    <button 
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors" 
                        onClick={() => setFilters({
                            ...filters,
                            startDate: lastMonth,
                            endDate: today,
                        })}
                    >
                        Last month
                    </button>
                    <button 
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors" 
                        onClick={() => setFilters({
                            ...filters,
                            startDate: lastYear,
                            endDate: today,
                        })}
                    >
                        Last year
                    </button>
                    <button 
                        className="!text-md border rounded-full px-4 py-2 hover:bg-[#00000022] transition-colors" 
                        onClick={() => setFilters({
                            ...filters,
                            startDate: "",
                            endDate: "",
                        })}
                    >
                        Clear
                    </button>
                  </div>
                 
                                                
            </FilterModal>
            {isLoading || isLoadingStat ? (
                <LoadingState />
            ) : error || managerStatsError ? (
                <ErrorComponent />
            ) : (
                <div className="p-4 pt-28 ">
                    <div
                        className={`${matches && "flex"} justify-between items-center mt-8`}
                    >
                        <p className="text-3md sm:text-lg md:mb-0 mb-4">
                            Management Team
                        </p>

                        <div className="flex">
                            <Button
                                className="flex text-white-100"
                                variant="black"
                                onClick={() => setOpenAddManager(true)}
                            >
                                <FaPlus color="white" className="mr-2" /> Add
                                Manager
                            </Button>
                        </div>
                    </div>
                    <div className="sm:flex gap-4  mt-4 w-full">
                        {stats.map((item, index) => (
                            <StatisticsCard
                                key={index}
                                title={item.title}
                                total={item.total || 0}
                                icon={item.icon}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center my-8">
                        <p className="text-3md sm:text-lg md:mb-0 mb-4">
                            Team members
                        </p>
                        <div className="sm:flex hidden">
                            <Button
                                variant="clear"
                                className={`rounded-[35px] flex gap-2 !justify-between`}
                                onClick={() => !!setOpenFilter && setOpenFilter(true)}
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
                                placeholder="Search manager"
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
                    <div className="flex sm:hidden justify-between my-8">
                        <Button
                            variant="clear"
                            className={`rounded-[35px] flex gap-2 !justify-between`}
                            onClick={() => !!setOpenFilter && setOpenFilter(true)}
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
                    <div className="bg-white-100 p-4 rounded-lg overflow-x-auto overflow-visible">
                        {data?.data && data?.data.length > 0 ?
                            <TeamTable
                                setTeamMemberDetails={setOpenTeamMemberDetails}
                                setReactivateManagerModal={setOpenReactivateManager}
                                setDeactivateManagerModal={setOpenDeactivateManager}
                                setSuspendManagerModal={setOpenSuspendManager}
                                data={data?.data || []}
                                setActiveId={setActiveId}
                                setAssignManager={setOpenAssignManager}
                            /> : <p className="text-center ">
                                    No results found
                                </p>
                            }
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Team
