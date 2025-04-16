import {
    Layout,
    Button,
    Input,
    EditTalentModal,
    //RemoveTalentModal,
    FilterModal,
    AddTalentModal,
    EmptyState,
    LoadingState,
    Radio,
} from "@components/index"
import { FaPlus } from "react-icons/fa"
import { BiSearch } from "react-icons/bi"
import TalentTable from "./components/talentTable"
import { useState } from "react"
import { IoFilter } from "react-icons/io5"
import { useQuery } from "@tanstack/react-query"
import { fetchIndustries, fetchTalents } from "@services/talents"
import ErrorComponent from "@components/errorComponent"
import { CgSpinner } from "react-icons/cg"
import { countActiveFilters, dateRanges } from "@utils/helpers"
import useAuth from "@hooks/auth/useAuth"

const MainTalents = () => {
    const [openEditTalent, setOpenEditTalent] = useState(false)
    const [openAddTalent, setOpenAddTalent] = useState(false)
    const { state } = useAuth()
    //const [openRemoveTalent, setOpenRemoveTalent] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
    const [activeId, setActiveId] = useState("")
    const [filters, setFilters] = useState({
        industry: "",
        startDate: "",
        endDate: "",
    })
    const { today, lastWeek, lastMonth, lastYear } = dateRanges;

    const [queryFilters, setQueryFilters] = useState({
        industry: "",
        startDate: "",
        endDate: "",
    })

    const { data, isLoading, error } = useQuery({
        queryKey: ["talents", queryFilters],
        queryFn: () => fetchTalents(queryFilters),
    })

    const industriesQuery = useQuery({
        queryKey: ["industries"],
        staleTime: 1000 * 60 * 4,
        queryFn: () => fetchIndustries(),
    })

    return (
        <Layout pageTitle="Talents">
            {/* <RemoveTalentModal
                opened={openRemoveTalent}
                setOpened={setOpenRemoveTalent}
            /> */}
            <AddTalentModal
                opened={openAddTalent}
                setOpened={setOpenAddTalent}
            />
            <EditTalentModal
                opened={openEditTalent}
                setOpened={setOpenEditTalent}
                activeId={activeId}
            />
            <FilterModal 
                applyFilters={() => {
                    setQueryFilters(filters)
                }}
                clearFilters={() => {
                    setFilters({
                        industry: "",
                        startDate: "",
                        endDate: "",
                    })
                    setQueryFilters({
                        industry: "",
                        startDate: "",
                        endDate: "",
                    })
                }}
                opened={openFilter} 
                setOpened={setOpenFilter}>
                <p className="font-semibold text-[16px] leading-6">Industry</p>
                <div className="flex mt-2 flex-wrap gap-4">
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${!filters.industry && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={!filters.industry}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                industry: ""
                            })}
                        />{" "}
                        All
                    </label>
                    {industriesQuery.isLoading && <CgSpinner className="animate-spin text-black-100 text-2lg " />}
                    {industriesQuery.data?.data.map((industry) => (
                        <label key={industry} className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center transition-colors cursor-pointer ${filters.industry === industry && "bg-black-100 text-white-100"}`}>
                            <Radio
                                checked={filters.industry === industry}
                                onChange={() => setFilters({ 
                                    ...filters, 
                                    industry
                                })}
                            />{" "}
                            {industry}
                        </label>
                    ))}
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
            {isLoading ? (
                <LoadingState />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <div className="p-4 pt-36 lg:pt-28">
                    <div className="flex justify-between items-center ">
                        <p className="text-3md sm:text-lg md:mb-0 mb-4">
                            Talents ({data?.data.length || 0})
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

                        <div className="flex">
                            {state.user?.userType !== "manager" && <Button
                                className="flex text-white-100"
                                variant="black"
                                onClick={() => setOpenAddTalent(true)}
                            >
                                <FaPlus color="white" className="mr-2" /> Add Talent
                            </Button>}
                        </div>
                    </div>
                    <div className="flex sm:hidden justify-between mt-8">
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

                    <div className="md:bg-white-100 md:p-4 rounded-lg overflow-x-auto overflow-visible mt-8">
                        {data?.data && data.data.length > 0 ? (
                            <TalentTable
                                data={data?.data || []}
                                setEditTalentModal={setOpenEditTalent}
                                //setRemoveTalentModal={setOpenRemoveTalent}
                                setFilterModal={setOpenFilter}
                                setActiveId={setActiveId}
                            />
                        ) : (
                            <EmptyState text="No talents found." />
                        )}
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default MainTalents
