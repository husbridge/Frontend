import { FormControls, Button, Combobox } from "@components/index"
import { Formik, Form, FieldArray } from "formik"
import { GoPlus } from "react-icons/go"
import { eventValidationSchema } from "@utils/validationSchema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { createEvent } from "@services/calendar"
import axios from "axios"
import { useState, useEffect } from "react"
import { fetchTalents } from "@services/talents"
import useAuth from "@hooks/auth/useAuth"

interface Talent {
    _id: string
    fullName: string
    stageName: string
}

const SingleAddition = ({ onClose }: { onClose: () => void }) => {
    const [countries, setCountries] = useState([])
    const [isLoading, setIsloading] = useState(false)
    // const [cities, setCities] = useState([])
    const queryClient = useQueryClient()
    const { state } = useAuth()
    const userType = state.user?.userType

    const { isPending, mutate } = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "Event created successfully",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["events"] })
                .finally(() => false)
            onClose()
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message:
                    err.message ||
                    "Something went wrong, please try again later",
                color: "red",
            })
        },
    })

    const talentsQuery = useQuery({
        queryKey: ["talents"],
        staleTime: 1000 * 60 * 2,
        queryFn: () => fetchTalents(),
    })

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsloading(true)
                const response = await axios.get(
                    "https://countriesnow.space/api/v0.1/countries"
                )
                const countryOptions = response.data.data.map((item: any) => ({
                    value: item,
                    label: item.country,
                }))
                setCountries(countryOptions)
            } catch (error) {
                console.error("Error fetching countries:", error)
            } finally {
                setIsloading(false)
            }
        }

        fetchCountries()
    }, [])
    // const handleCountryChange = (country: string) => {
    //     //try {
    //     //@ts-expect-error
    //     const cityOptions = countries
    //         .find((item: any) => item.label === country)
    //         //@ts-expect-error
    //         .value.cities.map((city) => ({
    //             value: city,
    //             label: city,
    //         }))

    //     setCities(cityOptions)
    // }
    return (
        <Formik
            initialValues={{
                eventTitle: "",
                description: "",
                venue: [
                    {
                        eventVenue: "",
                        eventCity: "",
                        eventCountry: {} as { label: string; value: string },
                        date: "",
                        eventStartTime: "",
                        eventEndTime: "",
                    },
                ],
                talents: [] as Talent[],
            }}
            validationSchema={eventValidationSchema}
            onSubmit={(values) => {
                // console.log(
                //     "dff",
                //     dayjs(values.eventDate).format("YYYY-MM-DDTHH:mm:ss[Z]"),
                // )
                mutate({
                    eventTitle: values.eventTitle,
                    description: values.description,
                    eventDate: values.venue.map((item) => ({
                        date: item.date,

                        eventCountry: (
                            item.eventCountry as {
                                label: string
                                value: string
                            }
                        ).label,

                        eventCity: item.eventCity,
                        eventVenue: item.eventVenue,
                        eventStartTime: item.eventStartTime,
                        eventEndTime: item.eventEndTime,
                    })),
                    talents: values.talents.map((talent) => talent._id),
                    //values.venue,
                })
                // console.log("ggh", values)
            }}
            enableReinitialize
        >
            {({ values, setFieldValue }) => (
                <Form className="py-4 mt-4">
                    <div className="mb-6">
                        <FormControls
                            label="Event Title"
                            control="input"
                            name="eventTitle"
                            //placeholder="enter your email address"
                            classNames={{
                                mainRoot: " border  border-black-20 px-2",
                                input: "text-black-100 text-[14px]",
                            }}
                            labelClassName="text-[#000]"
                        />
                    </div>

                    <div className="mb-6">
                        <FormControls
                            label="Description"
                            control="textarea"
                            name="description"
                            classNames={{
                                mainRoot: " border  border-black-20 px-2",
                                input: "text-black-100 text-[14px]",
                            }}
                        />
                    </div>

                    {userType !== "talent" && (
                        <div className="mb-6">
                            <Combobox
                                label="Select Talents"
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
                                    values.talents.map((talent: Talent) => ({
                                        id: talent._id,
                                        name: talent.fullName,
                                    })) || []
                                }
                                onChange={(selectedTalents) => {
                                    const mappedTalents = selectedTalents.map(
                                        (talent) => ({
                                            _id: talent.id,
                                            fullName: talent.name,
                                        })
                                    )
                                    setFieldValue("talents", mappedTalents)
                                }}
                            />
                        </div>
                    )}

                    <FieldArray
                        name="venue"
                        render={(arrayHelpers) => (
                            <div>
                                {values.venue.map((_item, index) => (
                                    <div key={index}>
                                        <div className="mb-6">
                                            <FormControls
                                                label="Event Venue"
                                                control="input"
                                                name={`venue[${index}].eventVenue`}
                                                //placeholder="enter your password"

                                                classNames={{
                                                    mainRoot:
                                                        " border  border-black-20 px-2",
                                                    input: "text-black-100 text-[14px]",
                                                }}
                                                suffixIcon={
                                                    <svg
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            arrayHelpers.remove(
                                                                index
                                                            )
                                                        }
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                                                            stroke="#F44336"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M7.08301 4.14175L7.26634 3.05008C7.39967 2.25841 7.49967 1.66675 8.90801 1.66675H11.0913C12.4997 1.66675 12.608 2.29175 12.733 3.05841L12.9163 4.14175"
                                                            stroke="#F44336"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M15.7087 7.6167L15.167 16.0084C15.0753 17.3167 15.0003 18.3334 12.6753 18.3334H7.32533C5.00033 18.3334 4.92533 17.3167 4.83366 16.0084L4.29199 7.6167"
                                                            stroke="#F44336"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M8.6084 13.75H11.3834"
                                                            stroke="#F44336"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M7.91699 10.4167H12.0837"
                                                            stroke="#F44336"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                }
                                            />
                                        </div>
                                        <div className="mb-4 sm:flex w-full">
                                            <div className="w-full sm:mb-0 mb-6">
                                                <FormControls
                                                    label="Event Country"
                                                    control="customselect"
                                                    name={`venue[${index}]eventCountry`}
                                                    placeholder="Select a country"
                                                    options={countries}
                                                    isLoading={isLoading}
                                                    // onChange={(val) => {
                                                    //     //@ts-expect-error
                                                    //     handleCountryChange(
                                                    //         val.label
                                                    //     )
                                                    // }}
                                                    classNames={{
                                                        mainRoot:
                                                            " border  border-black-20 px-2",
                                                        input: "text-black-100 text-[14px]",
                                                    }}
                                                    labelClassName="text-[#000] text-[14px] mb-1"
                                                />
                                            </div>

                                            <div className="sm:ml-4 w-full">
                                                <div className="ml-4 w-full">
                                                    <FormControls
                                                        label="Event City"
                                                        control="input"
                                                        name={`venue[${index}]eventCity`}
                                                        // placeholder="Select a city"
                                                        classNames={{
                                                            mainRoot:
                                                                " border  border-black-20 px-2",
                                                            input: "text-black-100 text-[14px]",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <FormControls
                                                label="Event Date"
                                                control="date"
                                                name={`venue[${index}]date`}
                                                placeholder="00/00/00"
                                                classNames={{
                                                    mainRoot:
                                                        " border  border-black-20 px-4",
                                                    input: "text-black-100 text-[14px]",
                                                }}
                                                labelClassName="text-[#000]"
                                            />
                                        </div>
                                        <div className="sm:flex w-full mb-4">
                                            <div className="sm:mb-0 mb-6">
                                                <FormControls
                                                    label="Time"
                                                    control="date"
                                                    name={`venue[${index}]eventStartTime`}
                                                    placeholder="00:00"
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    dateFormat="h:mm aa"
                                                    timeCaption="Time"
                                                    classNames={{
                                                        mainRoot:
                                                            " border  border-black-20 px-4",
                                                        input: "text-black-100 text-[14px]",
                                                    }}
                                                />
                                            </div>
                                            <div className="sm:ml-4">
                                                <FormControls
                                                    label="Time"
                                                    control="date"
                                                    name={`venue[${index}]eventEndTime`}
                                                    placeholder="00:00"
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    dateFormat="h:mm aa"
                                                    timeCaption="Time"
                                                    classNames={{
                                                        mainRoot:
                                                            " border  border-black-20 px-4",
                                                        input: "text-black-100 text-[14px]",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    className="flex mb-6 cursor-pointer items-center mt-4"
                                    onClick={() => {
                                        arrayHelpers.push({
                                            eventVenue: "",
                                            eventCity: "",
                                            eventCountry: "",
                                            date: "",
                                            eventStartTime: "",
                                            eventEndTime: "",
                                        })
                                    }}
                                >
                                    <GoPlus color="#E8B006" size="24px" />{" "}
                                    <p className="text-[#E8B006] text-md ml-2 cursor-pointer">
                                        Add Another Venue
                                    </p>
                                </div>
                            </div>
                        )}
                    />
                    <Button
                        variant="primary"
                        className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                        type="submit"
                        disabled={isPending}
                    >
                        {isPending ? "Loading..." : "Proceed"}
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

export default SingleAddition
