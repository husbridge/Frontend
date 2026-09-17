import { Avatar, Tabs } from "@mantine/core"
import { useState } from "react"

import defaultAvatar from "@assets/icons/avatar.svg"
import Logo from "@assets/icons/logo.svg"
import ErrorComponent from "@components/errorComponent"
import { LoadingState } from "@components/index"
import { useMediaQuery } from "@mantine/hooks"
import { fetchProfileBookingContext } from "@services/auth"
import { useQuery } from "@tanstack/react-query"
import { useParams, useSearchParams } from "react-router-dom"
import Booking from "./components/booking"
import Collaboration from "./components/collaboration"
import Message from "./components/message"
import Proposal from "./components/proposal"
import { resolveSelectedPackage } from "@utils/selectedPackage"

const VALID_TABS = ["booking", "proposal", "collaboration", "message"]

const Contact = () => {
    const [searchParams] = useSearchParams()
    const requestedTab = searchParams.get("type")
    const [activeTab, setActiveTab] = useState<string | null>(
        requestedTab && VALID_TABS.includes(requestedTab) ? requestedTab : "booking"
    )
    // Additive, optional — set only when a buyer picked a package before
    // starting contact (Website's PackagesSection "Book this package").
    // Display-only here: resolved from the same public profile payload
    // already fetched below, purely to show a summary; the actual
    // packageId sent on submit is validated against the talent server-
    // side regardless (PortalService.createInquiries).
    const packageId = searchParams.get("packageId") || ""

    const matches = useMediaQuery("(min-width: 1100px)")
    const matches1 = useMediaQuery("(min-width: 800px)")
    const matches2 = useMediaQuery("(min-width: 460px)")
    const { uniqueName } = useParams<string>()

    // Was ["profile"] — the exact same literal key Dashboard/Settings/
    // TalentInformation use for fetchProfile() (a DIFFERENT endpoint,
    // returning a DIFFERENT, private shape, for the AUTHENTICATED caller's
    // own account). React Query caches by key alone: within one SPA
    // session (no hard reload — e.g. testing as the talent, then as a
    // buyer, in the same tab) those queries collided, and this page could
    // mount showing another query's cached data — including its packages
    // array — instead of a fresh fetch for the talent actually being
    // viewed. Scoped by uniqueName too, so switching between two
    // different talents' Contact pages in one session can't do the same
    // thing to each other.
    const { data, isLoading, error } = useQuery({
        queryKey: ["public-profile-booking-context", uniqueName],
        queryFn: () => fetchProfileBookingContext(uniqueName || ""),
    })

    return (
        <>
            {isLoading ? (
                <LoadingState />
            ) : error ? (
                <ErrorComponent />
            ) : (
                <section className="bg-[#F2F2F2]">
                    <section className="sm:w-[70%] min-h-screen mx-auto bg-white-100">
                        <section className="bg-black-100 p-8 rounded-b-2xl mb-6">
                            <img src={Logo} alt="" className="w-24" />
                            <div className="flex justify-center mt-2">
                                <Avatar
                                    src={
                                        data?.data.profileUrl.trim()
                                            ? data.data.profileUrl
                                            : defaultAvatar
                                    }
                                    alt={data?.data.fullName}
                                    className="size-20 rounded-full"
                                />
                            </div>
                            <p className="text-white-100 text-center sm:text-lg text-3md font-semibold mt-2">
                                Contact{" "}
                                {`${data?.data.fullName} ${data?.data.stageName && `(${data?.data.stageName})`}`}
                            </p>
                            {data?.data.manager && (
                                <p className="text-white-100 text-center text-md mt-2 font-normal">
                                    Managed by {data?.data.manager.fullName}
                                </p>
                            )}
                        </section>
                        <Tabs
                            variant="unstyled"
                            defaultValue="singleAddition"
                            onChange={setActiveTab}
                            value={activeTab}
                            styles={{
                                list: {
                                    backgroundColor: "#F7F7F7",
                                    borderRadius: 40,
                                    //width: "80%",
                                    margin: "auto",
                                    padding: 5,
                                },
                                tabLabel: {
                                    fontSize: "16px",
                                    //marginBottom: "20px",
                                },
                                tab: {},
                                root: {
                                    paddingRight: matches
                                        ? 150
                                        : matches1
                                          ? 100
                                          : matches2
                                            ? 50
                                            : 10,
                                    paddingLeft: matches
                                        ? 150
                                        : matches1
                                          ? 100
                                          : matches2
                                            ? 50
                                            : 10,
                                },
                            }}
                        >
                            <Tabs.List grow>
                                <Tabs.Tab
                                    value="booking"
                                    className={`${activeTab === "booking" ? "text-black-100 bg-white-100 rounded-[40px]" : "text-[#475569]"} p-4`}
                                >
                                    Booking
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="proposal"
                                    className={`${activeTab === "proposal" ? "text-black-100 bg-white-100 rounded-[40px]" : "text-[#475569]"} p-4`}
                                >
                                    Proposal
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="collaboration"
                                    className={`${activeTab === "collaboration" ? "text-black-100 bg-white-100 rounded-[40px]" : "text-[#475569]"} p-4`}
                                >
                                    Collaboration
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="message"
                                    className={`${activeTab === "message" ? "text-black-100 bg-white-100 rounded-[40px]" : "text-[#475569]"} p-4`}
                                >
                                    Message
                                </Tabs.Tab>
                            </Tabs.List>
                            <Tabs.Panel value="booking">
                                <Booking
                                    id={data?.data._id || ""}
                                    selectedPackage={resolveSelectedPackage(
                                        data?.data.packages,
                                        packageId
                                    )}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="proposal">
                                <Proposal id={data?.data._id || ""} />
                            </Tabs.Panel>
                            <Tabs.Panel value="collaboration">
                                <Collaboration id={data?.data._id || ""} />
                            </Tabs.Panel>
                            <Tabs.Panel value="message">
                                <Message id={data?.data._id || ""} />
                            </Tabs.Panel>
                        </Tabs>
                    </section>
                </section>
            )}
        </>
    )
}

export default Contact
