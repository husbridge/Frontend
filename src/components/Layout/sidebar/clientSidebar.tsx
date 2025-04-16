import { NavLink } from "react-router-dom"
import logo from "@assets/icons/logo.svg"
import { routes } from "./utils/route"
import styles from "./sidebar.module.scss"
import LogoutIcon from "./assets/logOut"
// import Avatar from "@assets/icons/avatar.svg"
import { useNavigate } from "react-router-dom"
import useAuth from "@hooks/auth/useAuth"
import { useQueryClient } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode"
import Avatar from "../avatar"

export type DecodedUser = {
    fullName: string;
    email: string;
}

const ClientSidebar = () => {
    const navigate = useNavigate()
    const { state, dispatch } = useAuth()
    const queryClient = useQueryClient()
    const decoded = jwtDecode(state.user?.accessToken || "") as DecodedUser

    const handleLogout = () => {
        localStorage.removeItem("user")
        dispatch({ type: "CLEAR_USER_DATA" })
        //removeAccessToken()
        queryClient.resetQueries()
        navigate("/client-login")
    }

    return (
        <div className="bg-black-100 w-max-64">
            <div className="py-[1.63rem] px-3 hidden lg:block w-full mx-auto pl-8 bg-black-100">
                <img src={logo} alt="Project x" className="w-fit" />
                <div className="flex mt-10 w-fit items-center">
                    <Avatar alt={decoded.fullName || decoded.email} size={38} link="/settings" imageUrl={state.user?.profilePhotoUrl || undefined}/>
                    <div className="text-white-100 ml-2 ">
                        <p className="text-2md font-semibold w-[150px] break-words ">
                            {decoded.fullName || decoded.email || "-"}
                        </p>
                        <p className="text-sm">{state.user?.userType}</p>
                    </div>
                </div>
            </div>

            <div className="mt-4 ">
                <p className="text-sm font-semibold text-white-60  px-4 ml-4 mb-4">
                    MAIN MENU
                </p>
                {routes?.slice(3, 5).reverse().map((route, index) => (
                    <div
                        className="flex items-center text-grey-100 my-1 text-[14px] "
                        key={index}
                    >
                        <NavLink
                            //end
                            to={route?.link}
                            key={index}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.active}  flex items-center justify-between gap-4 py-4 px-4 w-full text-black-100 mx-4 bg-yellow-100 rounded-full outline-none`
                                    : `${styles.inactive} hover:text-white-60 flex items-center px-4 py-5 w-full outline-none
                                    text-white-100 justify-between ml-4`
                            }
                        >
                            <div className="flex items-center gap-5 w-full">
                                <route.Icon />
                                <span className=" body-regular font-normal">
                                    {route?.name}
                                </span>
                            </div>
                        </NavLink>
                    </div>
                ))}

                <p className="text-sm font-semibold text-white-60  px-4 ml-4 mb-4 mt-10">
                    OTHERS
                </p>
                {routes?.slice(7, 9).map((route, index) => (
                    <div
                        className="flex items-center text-grey-100 my-1 text-[14px] "
                        key={index}
                    >
                        <NavLink
                            //end
                            to={route.link}
                            key={index}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.active}  flex items-center justify-between gap-4 py-4 px-4 w-full text-black-100 mx-4 bg-yellow-100 rounded-full `
                                    : `${styles.inactive} hover:text-white-60 flex items-center px-4 py-5 w-full 
                                    text-white-100 justify-between ml-4`
                            }
                        >
                            <div className="flex items-center gap-5 w-full">
                                <route.Icon />
                                <span className=" body-regular font-normal">
                                    {route?.name}
                                </span>
                            </div>
                        </NavLink>
                    </div>
                ))}
                <div className="flex items-center text-grey-100 my-1 text-[14px] font-medium ml-4 px-4 py-5">
                    <div
                        className="flex items-center gap-5 w-full cursor-pointer "
                        onClick={() => handleLogout()}
                    >
                        <LogoutIcon />
                        <span className=" body-regular font-normal text-white-100">
                            Logout
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientSidebar
