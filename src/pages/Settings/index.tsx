import { Layout } from "@components/index"
// import NotificationSettings from "./components/notificationSettings"
import AccountInformation from "./components/accountInformation"
import { useNavigate } from "react-router-dom"
import useAuth from "@hooks/auth/useAuth"
import { LuLogOut } from "react-icons/lu"
import { BiUserCircle } from "react-icons/bi"

// Settings is account-only (name, email, phone, password, notifications) —
// nothing profile/portfolio-related lives here. That all moved to "My
// Page" (Identity/About/Portfolio/Reach/Track record — see
// src/pages/MyPage), reached via its own top-level nav item, not from
// Settings. See PHASE1_AUDIT.md Step 5.
const Settings = () => {
    const navigate = useNavigate()
    const { dispatch } = useAuth()

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
                        <div className="flex cursor-pointer mb-10 items-center text-md sm:text-2md">
                            <div>
                                <BiUserCircle
                                    size="24px"
                                    color="text-black-100"
                                />
                            </div>

                            <p className="text-black-100 ml-2">
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
                        <div
                            className="flex cursor-pointer mb-10 items-center sm:text-2md text-md pl-0.5"
                            onClick={() => handleLogout()}
                        >
                            <LuLogOut size="24px" color="#00000099" />
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
                    <AccountInformation />
                </div>
            </div>
        </Layout>
    )
}

export default Settings
