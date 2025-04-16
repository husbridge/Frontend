import { FormControls, Button } from "@components/index"
import { FaArrowRight } from "react-icons/fa"
import { Formik, Form } from "formik"
import { useNavigate } from "react-router-dom"
import { agencySignup } from "@services/auth"
import { useMutation } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import { useState, useEffect } from "react"
import axios from "axios"
import { agencyValidationSchema } from "@utils/validationSchema"

const AgencyInformation = ({
    title,
    handleClick,
}: {
    title: string
    handleClick: () => void
}) => {
    const navigate = useNavigate()
    const [countries, setCountries] = useState([])
    const [isLoading, setIsloading] = useState(false)
    const [states, setStates] = useState([])

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsloading(true)
                const response = await axios.get(
                    "https://countriesnow.space/api/v0.1/countries/states"
                )
                const countryOptions = response.data.data.map((item: any) => ({
                    value: item,
                    label: item.name,
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

    const handleCountryChange = (country: string) => {
        //try {
        //@ts-expect-error
        const stateOptions = countries
            .find((item: any) => item.label === country)
            //@ts-expect-error
            .value.states.map((state) => ({
                value: state.name,
                label: state.name,
            }))

        setStates(stateOptions)
    }

    const { isPending, mutate } = useMutation({
        mutationFn: agencySignup,
        onSuccess: () => {
            handleClick()
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    return (
        <div className="mt-14 mb-4">
            <div
                className="mb-4 flex items-center cursor-pointer"
                onClick={() => navigate("/dashboard")}
            >
                <p className="underline text-yellow-100 text-[14px] mr-2">
                    Skip for now
                </p>
                <FaArrowRight color="#E8B006" />
            </div>

            <h3 className="font-semibold text-[28px] sm:text-2lg leading-8">
                {title}
            </h3>
            <p className="text-black-70 text-3md mt-2">
                Fill your account details below to proceed
            </p>

            <Formik
                initialValues={{
                    agencyName: "",
                    regNumber: "",
                    industry: "",
                    address: "",
                    state: {} as {
                        label: string
                        value: string
                    },
                    country: {} as {
                        label: string
                        value: string
                    },
                }}
                validationSchema={agencyValidationSchema}
                onSubmit={(values) => {
                    mutate({
                        agencyName: values.agencyName,
                        regNumber: values.regNumber,
                        industry: values.industry,
                        address: values.address,
                        state: values.state.label,
                        country: values.country.label,
                    })
                }}
            >
                {({ setFieldValue }) => (
                    <Form className="py-4 mt-4">
                        <div className="mb-6 ">
                            <FormControls
                                label={
                                    title === "Agency Information"
                                        ? "Agency Name"
                                        : "Company Name"
                                }
                                control="input"
                                name="agencyName"
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
                                label="Registration Number"
                                control="input"
                                name="regNumber"
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
                                label="Industry"
                                control="input"
                                name="industry"
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
                                label="Address"
                                control="input"
                                name="address"
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
                                label="Country"
                                control="customselect"
                                name="country"
                                options={countries}
                                isLoading={isLoading}
                                onChange={(val) => {
                                    //@ts-expect-error
                                    handleCountryChange(val.label)
                                    setFieldValue("state", {
                                        label: "",
                                        value: "",
                                    })
                                }}
                                //placeholder="enter your email address"
                                classNames={{
                                    mainRoot: " border  border-black-20 px-2",
                                    input: "text-black-100 text-[14px]",
                                }}
                                labelClassName="text-[#000]"
                            />
                        </div>
                        {states && (
                            <div className="mb-6">
                                <FormControls
                                    label="State"
                                    control="customselect"
                                    name="state"
                                    options={states}
                                    //placeholder="enter your email address"
                                    classNames={{
                                        mainRoot:
                                            " border  border-black-20 px-2",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000]"
                                />
                            </div>
                        )}

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
        </div>
    )
}

export default AgencyInformation
