import { Layout } from "@components/index"
// import NotificationSettings from "./components/notificationSettings"
import AccountInformation from "./components/accountInformation"
import ProfileSetupBody from "@pages/ProfileSetup/components/ProfileSetupBody"
import PortfolioManagerBody from "@pages/PortfolioManager/components/PortfolioManagerBody"
import { useState } from "react"
import useAuth from "@hooks/auth/useAuth"
import { useNavigate } from "react-router-dom"
import { LuLayers, LuLogOut } from "react-icons/lu"
import { BiUserCircle } from "react-icons/bi"
import { HiOutlineSparkles } from "react-icons/hi2"

const Settings = () => {
    const navigate = useNavigate()
    const [settings, setSettings] = useState("accountInformation")

    const { state, dispatch } = useAuth()
    // Profile setup/portfolio are talent/agency self-service concerns — a
    // manager's own account has no public profile (see
    // isPublishableUserType in husridge-server); they manage a roster
    // talent's profile/portfolio from that talent's page instead (Phase 1
    // Step 5).
    const canSetUpProfile =
        state.user?.userType === "talent" || state.user?.userType === "agency"

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch({ type: "CLEAR_USER_DATA" })
        //removeAccessToken()
        navigate("/login")
    }

    return (
        <Layout>
            <div className="flex pt-24 ">
                {
                    <div className=" bg-[#F5F5F5] p-2 w-[40%] sm:w-[30%] sm:p-4 md:pl-8">
                        <p className="text-[20px] sm:text-lg mb-10 md:ml-[-8px]">
                            Settings
                        </p>
                        <div
                            className="flex cursor-pointer mb-10 items-center text-md sm:text-2md"
                            onClick={() => setSettings("accountInformation")}
                        >
                            <div>
                                <BiUserCircle
                                    size="24px"
                                    color={`${settings === "accountInformation" ? "text-black-100" : "#00000099"}`}
                                />
                            </div>

                            <p
                                className={`${settings === "accountInformation" ? "text-black-100" : "text-[#00000099]"} ml-2`}
                            >
                                Account Information
                            </p>
                        </div>
                        {/* {state.user?.userType !== "client" && (
                            <div
                                className="flex cursor-pointer mb-10 items-center sm:text-2md text-md"
                                onClick={() =>
                                    setSettings("notificationsSettings")
                                }
                            >
                                <div>
                                    <LuBell
                                        size="24px"
                                        color={`${settings === "notificationsSettings" ? "text-black-100" : "#00000099"}`}
                                    />
                                </div>

                                <p
                                    className={`${settings === "notificationsSettings" ? "text-black-100" : "text-[#00000099]"} ml-2`}
                                >
                                    Notifications Settings
                                </p>
                            </div>
                        )} */}
                        {canSetUpProfile && (
                            <div
                                className="flex cursor-pointer mb-10 items-center text-md sm:text-2md"
                                onClick={() => setSettings("profileSetup")}
                            >
                                <div>
                                    <HiOutlineSparkles
                                        size="24px"
                                        color={`${settings === "profileSetup" ? "text-black-100" : "#00000099"}`}
                                    />
                                </div>
                                <p
                                    className={`${settings === "profileSetup" ? "text-black-100" : "text-[#00000099]"} ml-2`}
                                >
                                    Profile Setup
                                </p>
                            </div>
                        )}
                        {canSetUpProfile && (
                            <div
                                className="flex cursor-pointer mb-10 items-center text-md sm:text-2md"
                                onClick={() => setSettings("portfolio")}
                            >
                                <div>
                                    <LuLayers
                                        size="24px"
                                        color={`${settings === "portfolio" ? "text-black-100" : "#00000099"}`}
                                    />
                                </div>
                                <p
                                    className={`${settings === "portfolio" ? "text-black-100" : "text-[#00000099]"} ml-2`}
                                >
                                    Portfolio
                                </p>
                            </div>
                        )}
                        <div
                            className="flex cursor-pointer mb-10 items-center sm:text-2md text-md pl-0.5"
                            onClick={() => handleLogout()}
                        >
                            <LuLogOut
                                size="24px"
                                color={`${settings === "notificationsSettings" ? "text-black-100" : "#00000099"}`}
                            />
                            <p className=" ml-2 text-[#00000099]">Log Out</p>
                        </div>
                        {/* <div className="flex cursor-pointer mb-10 sm:text-2md text-md">
                            <LuTrash2 size="24px" color={`#00000099`} />
                            <p className=" ml-2 text-[#00000099]">
                                Delete Account
                            </p>
                        </div> */}
                    </div>
                }
                <div
                    className={`w-[60%] bg-white-100 md:p-4 h-full ${"sm:w-[70%]"}`}
                >
                    {settings === "accountInformation" ? (
                        <AccountInformation />
                    ) : settings === "profileSetup" && canSetUpProfile ? (
                        <ProfileSetupBody />
                    ) : settings === "portfolio" && canSetUpProfile ? (
                        <PortfolioManagerBody />
                    ) : (
                        <>
                            {/* {state.user?.userType !== "client" && (
                                // <NotificationSettings />
                                <></>
                            )} */}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Settings
