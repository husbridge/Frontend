import { Modal } from "@mantine/core"
import { useState } from "react"
//import TalentInformation from "./components/talentInformation"
//import SelectManager from "./components/selectManager"
import { CgSpinner } from "react-icons/cg"
import { useQuery } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Close from "@assets/icons/close.svg"
import { Button, Radio } from "@components/index"
import Avatar from "@assets/icons/avatar.svg"
import { assignManagerToTalent } from "@services/talents"
import { fetchTalents } from "@services/talents"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"

export interface AssignManagerModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    activeId: string
}

const AssignManagerModal = ({
    opened,
    setOpened,
    activeId,
}: AssignManagerModalProps) => {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["talents"],
        queryFn: () => fetchTalents(),
    })

    const { isPending, mutate } = useMutation({
        mutationFn: assignManagerToTalent,
        onSuccess: (data) => {
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })
            setOpened(false)
            queryClient
                .invalidateQueries({
                    queryKey: ["talents"],
                })
                .finally(() => false)
            queryClient
                .invalidateQueries({
                    queryKey: ["singleUser"],
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
    const [talent, setTalent] = useState("")
    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
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
            {isLoading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <CgSpinner className="animate-spin text-black-100 text-2lg " />
                </div>
            ) : (
                <div>
                    <div className="flex mb-6 items-center">
                        <p className="text-[16px] sm:text-[20px] font-semibold flex-1 text-center">
                            Assign A Talent
                        </p>
                        <img
                            src={Close}
                            alt=""
                            className="flex-none cursor-pointer"
                            onClick={() => setOpened(false)}
                        />
                    </div>

                    {data?.data && data?.data.length > 0 && (
                        <>
                            {data?.data.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex border-b border-[#F5F5F6] justify-between p-4 items-center"
                                >
                                    <div className="flex">
                                        <img src={Avatar} alt="" />
                                        <p className="text-[20px] text-[#333333] font-medium ml-4">
                                            {item.fullName}
                                        </p>
                                    </div>
                                    <Radio
                                        onChange={() => setTalent(item._id)}
                                        checked={talent === item._id}
                                    />
                                </div>
                            ))}

                            <div className="flex gap-6">
                                <Button
                                    variant="primary"
                                    className="px-6   w-full rounded-[40px] mt-10"
                                    type="submit"
                                    disabled={isPending}
                                    onClick={() =>
                                        mutate({
                                            managerId: talent,
                                            talentId: activeId,
                                            permissions: ["manageUser"],
                                        })
                                    }
                                >
                                    {isPending ? "Adding..." : "Add Talent"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Modal>
    )
}
export default AssignManagerModal
