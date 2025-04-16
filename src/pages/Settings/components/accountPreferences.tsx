// import Avatar from "@assets/icons/avatar.svg"
import { BiEdit } from "react-icons/bi"
import { ChangeName, LoadingState } from "@components/index"
import { useState, useRef, ChangeEvent, useMemo } from "react"
import { fetchProfile, uploadProfileImage } from "@services/auth"
import { useQuery } from "@tanstack/react-query"
import useAuth from "@hooks/auth/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import { LuPenSquare } from "react-icons/lu"
import Avatar from "@components/Layout/avatar"
import { jwtDecode } from "jwt-decode"
import { DecodedUser } from "@components/Layout/sidebar/clientSidebar"


const passwordRep = '•'.repeat(10);

const AccountPreferences = () => {
    const [openChangeName, setOpenChangeName] = useState(false)
    const [defaultValue, setDefaultValue] = useState("");    
    const [name, setName] = useState("")
    const { state, dispatch } = useAuth();
    const userType = state.user?.userType;
    const isClient = userType === "client";
    const decoded = isClient ? jwtDecode(state.user?.accessToken || "") as DecodedUser : null

    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["profile"],
        enabled: !isClient,
        queryFn: () => fetchProfile(),
    })
    const userState = useMemo(() => {
        return state.user
    }, [state.user])
    const { isPending, mutate } = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: (data) => {
            if (state.user) {
                const user = {
                    accessToken: state.user.accessToken,
                    refreshToken: state.user.refreshToken,
                    profilePhotoUrl: data.data.data || "",
                    fullName: state.user.fullName,
                    firstName: state.user.firstName,
                    lastName: state.user.lastName,
                    registrationStage: state.user.registrationStage,
                    isVerified: state.user.isVerified,
                    permissions: state.user.permissions,
                    userType: state.user.userType,
                    uniqueUsername: state.user.uniqueUsername,
                    userStatus: state.user.userStatus,
                    hasAgency: state.user.hasAgency,
                }

                localStorage.setItem("user", JSON.stringify(user)),
                    state.user &&
                        dispatch({
                            type: "UPDATE_USER_DATA",
                            payload: user,
                        })
            }
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })

            queryClient
                .invalidateQueries({
                    queryKey: ["profile"],
                })
                .finally(() => false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })
    const handleProfilePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            // setPictureName(file.name)
            const formData = new FormData()
            formData.append("profile-picture", file)
            mutate(formData)
        }
    }
    const username = state.user?.fullName
        ? state.user?.fullName
        : state.user?.firstName
        ? state.user?.firstName
        : "-"
    return (
        <>
            {isLoading ? (
                <LoadingState />
            ) : (
                <div className=" md:block">
                    <div className="p-4 min-h-[calc(100vh-104px)]">
                        <ChangeName
                            opened={openChangeName}
                            setOpened={setOpenChangeName}
                            name={name}
                            defaultValue={defaultValue}
                        />
                        <Avatar alt={isClient ? decoded?.fullName : username} imageUrl={state.user?.profilePhotoUrl} size={96}/>
                        {!isClient && <label
                            className="flex items-center mt-3 cursor-pointer mb-6 ml-2"
                            //onClick={() => fileInputRef.current?.click()}
                            aria-disabled={isPending}
                        >
                            <BiEdit size={20} />
                            <p className="underline ml-2 font-medium text-sm">
                                {isPending ? "Uploading..." : "Update"}
                            </p>
                            <input
                                data-testid="file-upload"
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleProfilePictureUpload}
                            />
                        </label>}
                        <p className="font-medium text-2md sm:text-3md my-4">
                            Personal Information
                        </p>
                        <hr className="my-4"/>

                        {userState?.userType === "client" ? (
                            <div className="grid sm:grid-cols-2 gap-y-6 mb-16 max-w-[600px]">
                                <div>
                                    <p className="text-md font-semibold">
                                        Name
                                    </p>
                                    <p className="text-md my-2">
                                        {decoded?.fullName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-md font-semibold">
                                        E-mail
                                    </p>
                                    <p className="text-md my-2 break-words">
                                        {decoded?.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-md font-semibold">
                                        Password
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg tracking-tight">{passwordRep}</p>
                                        <span
                                            title="Change password"
                                            role="button"
                                            className="text-[#ffb432] text-sm cursor-pointer"
                                            onClick={() => {
                                                setName("Password")
                                                setOpenChangeName(true)
                                                setDefaultValue("")
                                            }}
                                        >
                                            <LuPenSquare size={16}/>
                                        </span>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid sm:grid-cols-2 gap-y-4 mb-16">
                                    <div>
                                        <p className="text-md font-semibold">
                                            Full Name
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-md my-2 text-wrap">
                                                {" "}
                                                {data?.data.fullName ||
                                                    data?.data.firstName +
                                                        " " +
                                                        data?.data.lastName ||
                                                    "-"}
                                            </p>
                                            <span
                                                className="text-[#ffb432] underline text-sm cursor-pointer"
                                                onClick={() => {
                                                    setName("Name")
                                                    setOpenChangeName(true)
                                                    setDefaultValue(
                                                        data?.data.fullName ||
                                                            data?.data.firstName +
                                                                " " +
                                                                data?.data.lastName
                                                    )
                                                }}
                                            >
                                                <LuPenSquare size={20}/>
                                            </span>
                                        </div>
                                       
                                    </div>
                                    <div>
                                        <p className="text-md font-semibold">
                                            E-mail
                                        </p>
                                        <p className="text-md my-2 break-words">
                                            {data?.data.emailAddress}
                                        </p>
                                        {/* <p
                                    className="text-[#FFC107] underline text-sm cursor-pointer"
                                        onClick={() => {
                                            setName("Email")
                                            setOpenChangeName(true)
                                        }}
                                    >
                                        Change e-mail
                                    </p> */}
                                    </div>
                                    <div>
                                        <p className="text-2md sm:text-md font-semibold">
                                            Mobile Number
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-md my-2">
                                                {data?.data.phoneNumber}
                                            </p>
                                            <span
                                                className="text-[#ffb432] -mt-0.5 underline text-sm cursor-pointer"
                                                onClick={() => {
                                                    setName("Mobile Number")
                                                    setOpenChangeName(true)
                                                    setDefaultValue(
                                                        data?.data.phoneNumber || ""
                                                    )
                                                }}
                                            >
                                                <LuPenSquare size={20}/>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="font-medium text-2md sm:text-3md mt-8 mb-4">
                                    {state.user?.userType === "talent"
                                        ? "Talent"
                                        : state.user?.userType === "agency"
                                          ? "Agency"
                                          : "Manager"}{" "}
                                    Information
                                </p>
                                <hr className="my-4"/>
                                <div className="grid sm:grid-cols-2 gap-y-4">
                                    <div>
                                        <p className="text-md font-semibold">
                                            {" "}
                                            {state.user?.userType === "talent"
                                                ? "Stage "
                                                : state.user?.userType ===
                                                    "agency"
                                                  ? "Agency"
                                                  : "Company"}{" "}
                                            Name
                                        </p>
                                        <p className="text-md my-2">
                                            {data?.data.stageName ||
                                                data?.data.agency?.agencyName ||
                                                "-"}
                                        </p>
                                        {/* agency change name is not ready yet */}
                                        {data?.data.userType === "agency" && false && (
                                            <p
                                                className="text-[#FFC107] underline text-sm cursor-pointer"
                                                onClick={() => {
                                                    setName(
                                                        state.user?.userType ===
                                                            "agency"
                                                            ? "Agency name"
                                                            : "Stage Name"
                                                    )
                                                    setOpenChangeName(true)
                                                    setDefaultValue(
                                                        data?.data.stageName ||
                                                            ""
                                                    )
                                                }}
                                            >
                                                Change agency name
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-md font-semibold">
                                            {state.user?.userType === "talent"
                                                ? "Industry"
                                                : "Registration Number"}
                                        </p>
                                        <p className="text-md my-2">
                                            {data?.data.industry ||
                                                data?.data.agency?.regNumber}
                                        </p>
                                        {state.user?.userType === "talent" && (
                                            <p
                                                className="text-[#FFC107] underline text-sm cursor-pointer"
                                                onClick={() => {
                                                    setName(
                                                        state.user?.userType ===
                                                            "talent"
                                                            ? "Industry"
                                                            : "Registration Number"
                                                    )
                                                    setOpenChangeName(true)
                                                    setDefaultValue(
                                                        data?.data.industry ||
                                                            ""
                                                    )
                                                }}
                                            >
                                                Change Industry
                                            </p>
                                        )}
                                    </div>
                                    {state.user?.userType !== "talent" && (
                                        <div>
                                            <p className="text-md font-semibold">
                                                Address
                                            </p>
                                            <p className="text-md my-2">
                                                {data?.data.agency?.address ||
                                                    ""}
                                            </p>
                                            {/* <p
                                        className="text-[#FFC107] underline text-sm cursor-pointer"
                                        onClick={() => {
                                            setName("Address")
                                            setOpenChangeName(true)
                                            setDefaultValue(
                                                data?.data.agency.address || ""
                                            )
                                           
                                        }}
                                    >
                                        Change address
                                    </p> */}
                                        </div>
                                    )}
                                </div>
                                <p className="font-medium text-2md sm:text-3md mt-8 mb-6">
                                    Password Information
                                </p>
                                <div>
                                    <p className="text-md font-semibold">
                                        Password
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg tracking-tight">{passwordRep}</p>
                                        <span
                                            title="Change password"
                                            role="button"
                                            className="text-[#ffb432] text-sm cursor-pointer"
                                            onClick={() => {
                                                setName("Password")
                                                setOpenChangeName(true)
                                                setDefaultValue("")
                                            }}
                                        >
                                            <LuPenSquare size={16}/>
                                        </span>
                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default AccountPreferences
