import { Avatar, Tabs } from "@mantine/core"
import { useState } from "react"

import defaultAvatar from "@assets/icons/avatar.svg"
import Logo from "@assets/icons/logo.svg"
import ErrorComponent from "@components/errorComponent"
import { LoadingState } from "@components/index"
import { useMediaQuery } from "@mantine/hooks"
import { fetchPublicProfile } from "@services/auth"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import Booking from "./components/booking"
import Collaboration from "./components/collaboration"
import Proposal from "./components/proposal"

const Contact = () => {
    const [activeTab, setActiveTab] = useState<string | null>("booking")

    const matches = useMediaQuery("(min-width: 1100px)")
    const matches1 = useMediaQuery("(min-width: 800px)")
    const matches2 = useMediaQuery("(min-width: 460px)")
    const { uniqueName } = useParams<string>()

    const { data, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: () => fetchPublicProfile(uniqueName || ""),
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
                        {(data?.data.bio ||
                            (data?.data.portfolioMedia &&
                                data.data.portfolioMedia.length > 0) ||
                            (data?.data.socialLinks &&
                                Object.values(data.data.socialLinks).some(
                                    Boolean
                                ))) && (
                            <section className="px-8 mb-6">
                                {data?.data.bio && (
                                    <p className="text-md text-black-100 whitespace-pre-line mb-4">
                                        {data.data.bio}
                                    </p>
                                )}
                                {data?.data.socialLinks &&
                                    Object.values(data.data.socialLinks).some(
                                        Boolean
                                    ) && (
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {Object.entries(
                                                data.data.socialLinks
                                            )
                                                .filter(([, url]) => url)
                                                .map(([platform, url]) => (
                                                    <a
                                                        key={platform}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-[#475569] underline capitalize"
                                                    >
                                                        {platform}
                                                    </a>
                                                ))}
                                        </div>
                                    )}
                                {data?.data.portfolioMedia &&
                                    data.data.portfolioMedia.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {data.data.portfolioMedia.map(
                                                (item) => (
                                                    <img
                                                        key={item._id}
                                                        src={item.url}
                                                        alt={
                                                            item.caption ||
                                                            "Portfolio photo"
                                                        }
                                                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                            </section>
                        )}
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
                            </Tabs.List>
                            <Tabs.Panel value="booking">
                                <Booking id={data?.data._id || ""} />
                            </Tabs.Panel>

                            <Tabs.Panel value="proposal">
                                <Proposal id={data?.data._id || ""} />
                            </Tabs.Panel>
                            <Tabs.Panel value="collaboration">
                                <Collaboration id={data?.data._id || ""} />
                            </Tabs.Panel>
                        </Tabs>
                    </section>
                </section>
            )}
        </>
    )
}

export default Contact
