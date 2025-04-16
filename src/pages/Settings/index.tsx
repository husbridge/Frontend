import { Layout } from "@components/index"
import NotificationSettings from "./components/notificationSettings"
import AccountPreferences from "./components/accountPreferences"
import { useState } from "react"
import useAuth from "@hooks/auth/useAuth"
import { useNavigate } from "react-router-dom"
import { LuBell, LuLogOut, LuTrash2, LuUserCircle2 } from "react-icons/lu"

const Settings = () => {
    const navigate = useNavigate()
    const [settings, setSettings] = useState("accountPreference")

    const { dispatch, state } = useAuth()

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch({ type: "CLEAR_USER_DATA" })
        //removeAccessToken()
        navigate("/login")
    }

    return (
        <Layout>
            <div className="flex pt-24 ">
                {state.user?.userType !== "client" && <div className=" bg-[#F5F5F5] p-2 w-[40%] sm:w-[30%] sm:p-4 md:pl-8">
                    <p className="text-[20px] sm:text-lg mb-10 md:ml-[-8px]">Settings</p>
                    <div
                        className="flex cursor-pointer mb-10 items-center text-md sm:text-2md"
                        onClick={() => setSettings("accountPreference")}
                    >
                        <div>
                            <LuUserCircle2
                                size="24px"
                                color={`${settings === "accountPreference" ? "text-black-100" : "#00000099"}`}
                            />
                        </div>

                        <p
                            className={`${settings === "accountPreference" ? "text-black-100" : "text-[#00000099]"} ml-2`}
                        >
                            Account Preferences
                        </p>
                    </div>
                    <div
                        className="flex cursor-pointer mb-10 items-center sm:text-2md text-md"
                        onClick={() => setSettings("notificationsSettings")}
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
                    <div className="flex cursor-pointer mb-10 sm:text-2md text-md">
                        <LuTrash2 size="24px" color={`#00000099`} />
                        <p className=" ml-2 text-[#00000099]">Delete Account</p>
                    </div>
                </div>}
                <div className={`w-[60%] bg-white-100 md:p-4 h-full ${state.user?.userType === "client"? "w-full" : "sm:w-[70%]"}`}>
                    {settings === "accountPreference" ? (
                        <AccountPreferences />
                    ) : (
                        <NotificationSettings />
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default Settings
