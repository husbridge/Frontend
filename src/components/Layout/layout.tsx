import logo from "@assets/icons/logo.svg"
import useAuth from "@hooks/auth/useAuth"
import { useGetInquiries, useGetPortalInquiries } from "@hooks/useInquiry"
import { Drawer } from "@mantine/core"
import { useSocket } from "@pages/Messaging/hooks/useSocket"
import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { LayoutProps } from "../../type/Layout/layout-interface"
import Navbar from "./navbar/navbar"
import Sidebar from "./sidebar/sidebar"

const Layout = ({ children, pageTitle, search }: LayoutProps) => {
    const { state } = useAuth()
    const [openSideBar, setOpenSideBar] = useState(false)
    const { isLoading, data, error } = useGetInquiries({
        userType: state.user?.userType || "",
    })
    const {
        data: inquiryData,
        isLoading: isLoadingInquiryData,
        error: portalInquiryError,
    } = useGetPortalInquiries(state.user?.userType || "")

    const { joinGroup } = useSocket({})

    useEffect(() => {
        const inquiries =
            state.user?.userType === "client"
                ? inquiryData?.data || []
                : data?.data || []
        if (
            !isLoading &&
            !isLoadingInquiryData &&
            !error &&
            !portalInquiryError
        ) {
            inquiries.map((inquiry) => {
                joinGroup(`messageNotification_${inquiry.chatGroupId}`)
            })
        }
    }, [isLoading, isLoadingInquiryData, error, portalInquiryError])

    return (
        <>
            <div className="h-screen relative font-inter bg-black-100">
                <div className="w-full lg:w-[calc(100%-256px)]  fixed right-0 z-20 bg-black-100 md:pb-0 ">
                    <Navbar
                        pageTitle={pageTitle}
                        setOpenSideBar={setOpenSideBar}
                        search={search}
                    />
                </div>
                <div className="relative lg:pl-64 h-full bg-black-100 ">
                    <div className="hidden lg:block fixed bg-black-100 left-0 w-64  h-[100%] overflow-y-auto no-scrollbar">
                        <Sidebar />
                    </div>

                    <>
                        <Drawer
                            opened={openSideBar}
                            onClose={() => setOpenSideBar(false)}
                            size="75%"
                            styles={{
                                content: {
                                    background: "black",
                                },
                            }}
                            withCloseButton={false}
                        >
                            <div className="px-4 mt-7 ">
                                <div className="flex items-center justify-end mb-6">
                                    <AiOutlineClose
                                        className="cursor-pointer"
                                        onClick={() => setOpenSideBar(false)}
                                        color="white"
                                        size="24px"
                                    />
                                </div>
                                <img
                                    src={logo}
                                    alt="Project x"
                                    className="w-fit"
                                />
                                <hr className="text-neutral-5 mt-5" />
                            </div>
                            <div className="w-full h-3/4 md:h-[500px] overflow-y-auto md:pt-[75px]">
                                <Sidebar />
                            </div>
                        </Drawer>
                    </>

                    <main
                        className={`w-full h-full overflow-y-auto      rounded-bl-[40px] bg-grey-90`}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}

export default Layout
