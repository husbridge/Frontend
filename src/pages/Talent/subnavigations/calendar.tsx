import { FilterModal, Input, Layout, LoadingState } from "@components/index"

import { useGetEventsByTalentId } from "@hooks/useEvent"
import { Link, useParams } from "react-router-dom"
import Calendar from "@pages/CalendarManagement/calendar"
import { fetchCountries } from "@services/utils"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { dateRanges } from "@utils/helpers"
import { Select } from "@mantine/core"

const { today, lastWeek, lastMonth, lastYear } = dateRanges;

const TalentCalendar = () => {
    const { id } = useParams<string>()
    const [cities, setCities] = useState<any[]>([])

    const [filters, setFilters] = useState({
        city: "",
        country: "",
        startDate: "",
        endDate: "",
    });

    const [queryFilters, setQueryFilters] = useState({
        city: "",
        country: "",
        startDate: "",
        endDate: "",
    });

    const { data, isLoading } = useGetEventsByTalentId({ 
        talentID: id || "",
        filters: queryFilters
     })

    const countryQuery = useQuery({
        queryKey: ["countries"],
        staleTime: Infinity,
        queryFn: () => fetchCountries(),
    })

    const onSelectCountry = (country: any) => {
        setFilters({
            ...filters,
            country,
        });
    
        const cityOptions = countryQuery?.data
            .find((item: any) => item.label === country)
            .value.cities
            .filter((city: string, index: number, self: string[]) => self.indexOf(city) === index) // Remove duplicates
            .map((city: any) => ({
                value: city,
                label: city,
            }));
    
        setCities(cityOptions);
    };
    const uniqueCountryOptions = Array.from(new Set(countryQuery.data?.map((item: any) => item.label)));
    
    const onSelectCity = (city: any) => {
        setFilters({
            ...filters,
            city,
        })
    }

    const [openFilter, setOpenFilter] = useState(false)

    return (
        <Layout>
              <FilterModal
                applyFilters={()=>{
                    setQueryFilters(filters)
                }}
                clearFilters={() =>{ 
                    setFilters({
                        city: "",
                        country: "",
                        startDate: "",
                        endDate: "",
                    })
                    setQueryFilters({
                        city: "",
                        country: "",
                        startDate: "",
                        endDate: "",
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
                <div className="flex items-center gap-2 mt-6 justify-between flex-wrap">
                <Select
                    label="Event Country"
                    placeholder="Select a country"
                    data={uniqueCountryOptions?.map((item: any) => ({
                        value: item, 
                        label: item,
                    })) || []}
                    value={filters.country}
                    onChange={onSelectCountry}
                    searchable
                    clearable
                    styles={{
                        input: {
                        borderRadius: "80px",
                        padding: "16px",
                        height: "50px",
                        marginTop: "10px",
                        },
                        label:{
                            fontSize:"15px",
                            fontWeight:"600"
                        }
                    }}
                    style={{ flexBasis: "48%", minWidth: "200px" }}
                    />
                    <Select
                        label="Event City"
                        placeholder={!filters.country ? "Select country first" : "Select a city"}
                        readOnly={!filters.country}
                        data={cities.map((city: any) => ({
                            value: city.value, 
                            label: city.label,
                        })) || []}
                        value={filters.city}
                        onChange={onSelectCity}
                        searchable
                        clearable
                        styles={{
                            input: {
                            borderRadius: "80px",
                            padding: "16px",
                            height: "50px",
                            marginTop: "10px",
                            },
                            label:{
                                fontSize:"15px",
                                fontWeight:"600"
                            }
                        }}
                        style={{ flexBasis: "48%", minWidth: "200px" }}
                        />                   
                    </div>
                </FilterModal>
            {isLoading ? (
                <LoadingState />
            ) : (
                <div className="mt-24 p-4">
                    <p className="text-2md">
                        <span className="text-[#00000066]">
                            <Link to="/talents">Talents</Link> &gt;{" "}
                            <Link to={`/talents/${id}`}>
                                Talent Information
                            </Link>
                        </span>{" "}
                        &gt; Calendar
                    </p>
                    <div>
                        <div className=" mt-4">
                            <Calendar 
                                filters={queryFilters}
                                setOpenFilter={setOpenFilter}
                                data={data} />
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default TalentCalendar
