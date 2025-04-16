import {
    Layout,
    InquiryTable,
    Button,
    Input,
    InquiryDetails,
    RespondModal,
    LoadingState,
    FilterModal,
    Radio,
} from "@components/index"
import { BiSearch } from "react-icons/bi"
import { IoFilter } from "react-icons/io5"
import { useState } from "react"
import { useGetInquiriesByTalentId } from "@hooks/useInquiry"
import { Data  } from "type/api/inquiry.types"
import { Link, useParams } from "react-router-dom"
import { countActiveFilters, dateRanges } from "@utils/helpers"

const AllInquiries = () => {
    const [openInquiryDetails, setOpenInquiryDetails] = useState(false)
    const [openRespondModal, setOpenRespondModal] = useState(false)
    const [inquiryDetails, setInquiryDetails] = useState<Data>()
    const { id } = useParams<string>()
    const [openFilter, setOpenFilter] = useState(false)
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        inquiryType: "",
    })
    const { today, lastWeek, lastMonth, lastYear } = dateRanges;
    const [queryFilters, setQueryFilters] = useState({
        startDate: "",
        endDate: "",
        inquiryType: "",
    })

    const { data, isLoading } = useGetInquiriesByTalentId({
        id:id||"", 
        filters:queryFilters
    })

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
            <FilterModal
                applyFilters={() => {
                    setQueryFilters(filters)
                }}
                clearFilters={() => {
                    setFilters({
                        startDate: "",
                        endDate: "",
                        inquiryType: "",
                    })
                    setQueryFilters({
                        startDate: "",
                        endDate: "",
                        inquiryType: "",
                    })
                }}
                opened={openFilter} 
                setOpened={setOpenFilter}>

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
                <p className="font-semibold text-[16px] leading-6 mt-7">Inquiry Type</p>
                <div className="flex mt-2 flex-wrap gap-4">
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${!filters.inquiryType && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={!filters.inquiryType}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                inquiryType: ""
                            })}
                        />{" "}
                        All
                    </label>
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.inquiryType === 'booking' && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={filters.inquiryType === 'booking'}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                inquiryType: "booking"
                            })}
                        />{" "}
                        Booking
                    </label>
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.inquiryType === 'proposal' && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={filters.inquiryType === 'proposal'}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                inquiryType: "proposal"
                            })}
                        />{" "}
                        Proposal
                    </label>
                    <label className={`!text-md border rounded-full px-6 py-3 flex gap-1 items-center cursor-pointer ${filters.inquiryType === 'collaboration' && "bg-black-100 text-white-100 transition-colors"}`}>
                        <Radio
                            checked={filters.inquiryType === 'collaboration'}
                            color="fff"
                            onChange={() => setFilters({ 
                                ...filters, 
                                inquiryType: "collaboration"
                            })}
                        />{" "}
                        Collaboration
                    </label>                   
                  </div>
                </FilterModal>
            {isLoading ? (
                <LoadingState />
            ) : (
                <div className="mt-24 p-4">
                    <div >
                        <p className="text-2md">
                            <span className="text-[#00000066]">
                            <Link to="/talents">Talents</Link>{" "}
                                &gt;{" "}
                            <Link to={`/talents/${id}`}>Talent Information</Link>
                            </span>{" "}
                            &gt; All inquiries
                        </p>
                        <div className="flex justify-between items-center mt-8">
                            <p className="text-3md sm:text-lg md:mb-0 mb-4">
                                Received Inquiries({data?.data.length})
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
                    </div>
                    <div className="bg-white-100 p-4 rounded-lg overflow-x-auto overflow-visible mt-4">
                        <InquiryTable
                            handleInquiryDetails={(val) => {
                                setOpenInquiryDetails(true)
                                setInquiryDetails(val)
                            }}
                            //setOpenRespond={setOpenRespondModal}
                            data={data?.data || []}
                            showTalent={false}

                        />
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default AllInquiries
