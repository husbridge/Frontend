import { Combobox, FilterModal, Input, Layout, LoadingState } from "@components/index"
import ErrorComponent from "@components/errorComponent"
import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "@services/calendar"
import Calendar from "./calendar"
import { useState } from "react"
import useAuth from "@hooks/auth/useAuth"
import { dateRanges } from "@utils/helpers"
import { fetchTalents } from "@services/talents"
import { fetchCountries } from "@services/utils"
import { Select } from "@mantine/core"

interface Talent {
    _id: string;
    fullName: string;
    stageName?: string;
}

interface Filter {
    city: string;
    country: string;
    talentIDs: string[];
    startDate: string;
    endDate: string;
}

const CalendarManagement = () => {
    const { state } = useAuth()
    const userType = state.user?.userType;

    const [filters, setFilters] = useState<Filter>({
        city: "",
        country: "",
        talentIDs: [],
        startDate: "",
        endDate: "",
    });

    const [queryFilters, setQueryFilters] = useState<Filter>({
        city: "",
        country: "",
        talentIDs: [],
        startDate: "",
        endDate: "",
    });
    const [filteredTalents, setFilteredTalents] = useState<Talent[]>([])
    const [cities, setCities] = useState<any[]>([])

    const { data, isLoading, error } = useQuery({
        queryKey: ["events", queryFilters],
        queryFn: () => fetchEvents(queryFilters)
    })


    const { today, lastWeek, lastMonth, lastYear } = dateRanges;

    const talentsQuery = useQuery({
        queryKey: ["talents"],
        staleTime: 1000 * 60 * 2,
        queryFn: () => fetchTalents(),
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
                        talentIDs: [],
                        startDate: "",
                        endDate: "",
                    })
                    setFilteredTalents([])
                    setQueryFilters({
                        city: "",
                        country: "",
                        talentIDs: [],
                        startDate: "",
                        endDate: "",
                    })
                }}
                opened={openFilter} 
                setOpened={setOpenFilter}>
                { userType !== 'talent' && <div className="mb-6">
                    <p className="font-semibold text-[16px] leading-6 mb-2">Talents</p>
                    <Combobox
                        placeholder="Search your talents"
                        multiple
                        options={talentsQuery.data?.data.map((talent: Talent) => ({
                            id: talent._id,
                            name: talent.fullName,
                        })) || []}
                        value={filteredTalents.map((talent: Talent) => ({
                            id: talent._id,
                            name: talent.fullName,
                        })) || []}
                        onChange={(selectedTalents: any) => {
                            const mappedTalents: Talent[] = selectedTalents.map((talent: any) => ({
                                _id: talent.id,
                                fullName: talent.name,
                            }));
                            setFilteredTalents(mappedTalents)
                            setFilters({
                                ...filters,
                                talentIDs: mappedTalents.map(talent => talent._id)
                            })
                        }}
                        />
                    </div>}

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
            ) : error ? (
                <ErrorComponent />
            ) : (
                <div className="p-4 pt-32 lg:pt-28">
                    <Calendar 
                        setOpenFilter={setOpenFilter}
                        filters={queryFilters}
                        data={data} />
                </div>
            )}
        </Layout>
    )
}

export default CalendarManagement
