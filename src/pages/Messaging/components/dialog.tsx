import SmsEdit from "@assets/icons/smsEdit.svg"
import { Input } from "@components/index"
import { BiSearch } from "react-icons/bi"
import useAuth from "@hooks/auth/useAuth"
import { Data } from "type/api/inquiry.types"
import Avatar from "@components/Layout/avatar"
import { useNotificationStore } from "@hooks/useNotificationStore"
import { AuthState } from "type/api/auth.types"

type GroupedData = Record<string, Data[]>

const Dialog = ({
    handleClick,
    setOpenNewMessage,
    data,
}: {
    handleClick: (val: Data) => void
    setOpenNewMessage: (val: boolean) => void
    data: Data[]
}) => {
    const { state } = useAuth()

    // const newData = data.reduce<GroupedData>((acc, inquiry) => {
    //     if (!acc[inquiry.chatGroupId]) {
    //       acc[inquiry.chatGroupId] = [];
    //     }
    //     acc[inquiry.chatGroupId].push(event);
    //     return acc;
    //   }, {});

    return (
        <div className="  p-4 bg-[#FBFBFB] h-screen">
            <div className="flex justify-between  mb-8">
                <p className="text-3md sm:text-lg  mb-4 font-medium">
                    Messages
                </p>
                {state.user?.userType !== "client" && (
                    <img
                        src={SmsEdit}
                        className="-mt-4"
                        alt=""
                        onClick={() => setOpenNewMessage(true)}
                    />
                )}
            </div>
            <Input
                placeholder="Search Messages"
                className=" border border-[#E0E0E0] rounded-2xl  p-4 h-[50px] text-[12px] text-grey-100 font-medium "
                prefixIcon={
                    <BiSearch size="30px" color="black" className="mr-2" />
                }
            />
            <Chats handleClick={handleClick} data={data} state={state} />
        </div>
    )
}

export default Dialog

interface ChatsProps {
    state: AuthState
    data: Data[]
    handleClick: (val: Data) => void
}

export const Chats = ({ handleClick, data, state }: ChatsProps) => {
    const chatGroupIds = useNotificationStore((state) => state.chatGroupIds)
    const setMessageCount = useNotificationStore(
        (state) => state.setMessageCount
    )
    const newData: GroupedData = {}
    data.forEach((item) => {
        if (newData[item.chatGroupId]) {
            newData[item.chatGroupId].push(item)
        } else {
            newData[item.chatGroupId] = [item]
        }
    })

    return (
        <>
            {Object.entries(newData).map(([id, item]) => (
                <div
                    key={id}
                    className="flex justify-between border-b border-[#d9d9d968] py-5 cursor-pointer"
                    onClick={() => {
                        if (chatGroupIds.includes(item[0].chatGroupId)) {
                            setMessageCount(-1)
                        }
                        handleClick(item[0])
                    }}
                >
                    <div className="flex items-center justify-between w-full">
                        {/* <img src={Avatar} className="w-12 sm:w-16" alt="" /> */}
                        <div className="flex items-center gap-2">
                            <Avatar
                                size={46}
                                alt={
                                    state.user?.userType === "client"
                                        ? item[0].bookedForTalent.fullName
                                              .split("  ")
                                              .join(" ")
                                        : item[0].fullName.trim()
                                }
                                imageUrl={
                                    state.user?.userType === "client"
                                        ? item[0].bookedForTalent.profileUrl
                                        : undefined
                                }
                            />
                            <div className="ml-2">
                                <p className="text-[#0F0E0E] text-2md sm:text-3md font-medium">
                                    {state.user?.userType === "client"
                                        ? item[0].bookedForTalent.fullName
                                        : item[0].fullName}
                                </p>
                                {/* <p className="text-md text-[#5F5E5E]">Yes Boss</p> */}
                            </div>
                        </div>

                        {chatGroupIds.length > 0 && (
                            <span>
                                {chatGroupIds.filter(
                                    (i) => i === item[0].chatGroupId
                                ).length > 0 && (
                                    <span className="bg-yellow-100 rounded-full py-1 px-2 text-xs font-bold">
                                        {
                                            chatGroupIds.filter(
                                                (i) => i === item[0].chatGroupId
                                            ).length
                                        }
                                    </span>
                                )}
                            </span>
                        )}
                    </div>

                    {/* <p className="text-sm text-black-60 font-medium mt-4">
                        Mon, Dec 18th
                    </p> */}
                </div>
            ))}
        </>
    )
}
