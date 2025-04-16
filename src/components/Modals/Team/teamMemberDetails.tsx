import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import Avatar from "@assets/images/avatar.png"
import { Button } from "@components/index"
import { BiEdit } from "react-icons/bi"
import { IoCloseCircleOutline } from "react-icons/io5"
import SuspendIcon from "@assets/icons/suspend.svg"
//import Trash from "@assets/icons/trash.svg"
import { status } from "@pages/Team/utils/team.utils"
import {
    DeactivateManagerModal,
    AccountDeactivated,
    AccountSuspendedModal,
    SuspendManagerModal,
    ReactivateManagerModal,
    AccountReactivated,
} from "@components/index"
import { useState } from "react"
import { fetchSingleUser } from "@services/manager"
import { CgSpinner } from "react-icons/cg"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"

export interface TeamDetailsModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    id: string
}

const TeamMemberDetails = ({
    opened,
    setOpened,
    id,
}: TeamDetailsModalProps) => {
    const [openDeactivateManager, setOpenDeactivateManager] = useState(false)
    const [openAccountDeactivatedModal, setOpenAccountDeactivatedModal] =
        useState(false)
    const [openAccountSuspendedModal, setOpenAccountSuspendedModal] =
        useState(false)
    const [openSuspendManager, setOpenSuspendManager] = useState(false)

    const [openReactivateManager, setOpenReactivateManager] = useState(false)
    const [openAccountReactivatedModal, setOpenAccountReactivatedModal] =
        useState(false)

    const { data, isLoading } = useQuery({
        queryKey: ["singleUser", id],
        queryFn: () => fetchSingleUser({id:id}),
    })
    
    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="lg"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <AccountSuspendedModal
                opened={openAccountSuspendedModal}
                setOpened={setOpenAccountSuspendedModal}
            />
            <SuspendManagerModal
                opened={openSuspendManager}
                setOpened={setOpenSuspendManager}
                setOpenSuspendedModal={setOpenAccountSuspendedModal}
                id={id}
            />
            <DeactivateManagerModal
                opened={openDeactivateManager}
                setOpened={setOpenDeactivateManager}
                setOpenDeactivatedModal={setOpenAccountDeactivatedModal}
                id={id}
            />
            <AccountDeactivated
                opened={openAccountDeactivatedModal}
                setOpened={setOpenAccountDeactivatedModal}
            />

            <ReactivateManagerModal
                opened={openReactivateManager}
                setOpened={setOpenReactivateManager}
                setOpenReactivatedModal={setOpenAccountReactivatedModal}
                id={id}
            />
            <AccountReactivated
                opened={openAccountReactivatedModal}
                setOpened={setOpenAccountReactivatedModal}
            />



            {isLoading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <CgSpinner className="animate-spin text-black-100 text-2lg " />
                </div>
            ) : (
                <div className="sm:px-4 text-md text-[#050505]">
                    <div className="flex mb-6 items-center">
                        <p className="text-[20px] font-semibold flex-1 text-center">
                            Team Member Details
                        </p>
                        <img
                            src={Close}
                            alt=""
                            className="flex-none cursor-pointer"
                            onClick={() => setOpened(false)}
                        />
                    </div>
                    <div className="flex mt-8 items-center">
                        <img src={Avatar} className="w-14" alt="" />
                        <div className="ml-4 sm:text-md text-[#050505]">
                            <p className="  mr-1">{data?.data.fullName} (M)</p>
                            <div className="flex items-center">
                                <p className="text-[#050505B2] mr-2">
                                    {data?.data.phoneNumber}
                                </p>
                                {status(data?.data.userStatus || "")}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-6">
                        <Button className="flex" variant="clear"
                        onClick={() => setOpenReactivateManager(true)} >
                            <BiEdit size="22px" className="mr-2" />
                            Reactivate
                        </Button>
                        
                        <Button
                            className="flex "
                            variant="clear"
                            onClick={() => setOpenSuspendManager(true)}
                        >
                            <img src={SuspendIcon} alt="" className="mr-2" />
                            Suspend
                        </Button>
                        <Button
                            className="flex"
                            variant="clear"
                            onClick={() => setOpenDeactivateManager(true)}
                        >
                            <IoCloseCircleOutline
                                size="22px"
                                className="mr-2"
                            />
                            Deactivate
                        </Button>
                    </div>
                    <p className="border-b mt-6 pb-2">General Information</p>
                    <p className="bg-[#F7F7F7] mt-4 p-2 w-full">
                        Manager Information
                    </p>
                    <div className="grid grid-cols-2 mt-4 gap-y-4">
                        <p>
                            <span className="text-[#5F5E5E]">Full Name:</span>{" "}
                            {data?.data.fullName}
                        </p>
                        <p>
                            <span className="text-[#5F5E5E]">
                                Mobile Number:
                            </span>{" "}
                            {data?.data.phoneNumber}
                        </p>
                        <p>
                            <span className="text-[#5F5E5E]">Email:</span>{" "}
                            {data?.data.emailAddress}
                        </p>
                        <p>
                            <span className="text-[#5F5E5E]">Gender:</span>{" "}
                            {data?.data.gender}
                        </p>
                    </div>
                    {/* <p className="bg-[#F7F7F7] my-4 p-2 w-full">Talents</p>
                    {new Array(5).fill(0).map((_, index) => (
                        <div key={index} className="flex justify-between mb-4">
                            <p>
                                <span className="text-[#5F5E5E]">
                                    Full Name:
                                </span>{" "}
                                Tomiwa Alfa
                            </p>
                            <p>
                                <span className="text-[#5F5E5E]">
                                    Mobile Number:
                                </span>{" "}
                                +234 801222567
                            </p>
                            <img src={Trash} alt="" />
                        </div>
                    ))} */}

                    <p className="bg-[#F7F7F7] my-4 p-2 w-full">Date Added</p>
                    <p>
                        
                        {dayjs(data?.data.createdAt).format("DD-MM-YYYY")}
                    </p>
                </div>
            )}
        </Modal>
    )
}

export default TeamMemberDetails
