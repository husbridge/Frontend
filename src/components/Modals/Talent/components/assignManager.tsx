import Close from "@assets/icons/close.svg"
import { Button, Radio } from "@components/index"
// import Afolayan from "@assets/icons/afolayan.svg"
// import Amarachi from "@assets/icons/amarachi.svg"
// import Drey from "@assets/icons/drey.svg"
// import Fatimah from "@assets/icons/fatimah.svg"
// import Akeem from "@assets/icons/akeem.svg"
import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { useQuery } from "@tanstack/react-query"
import { fetchManagers } from "@services/manager"
import { assignManagerToTalent } from "@services/talents"
import Avatar from "@assets/icons/avatar.svg"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../../type/api/index"
import { AddManager } from "@components/index"

interface AssignManagerInterface {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    //handleClick: () => void
    id: string
}
const AssignManager = ({
    setOpened,
    //handleClick,
    id,
}: AssignManagerInterface) => {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({
        queryKey: ["managers"],
        queryFn: () => fetchManagers(),
    })

    const { isPending, mutate } = useMutation({
        mutationFn: assignManagerToTalent,
        onSuccess: (data) => {
            showNotification({
                title: "Success",
                message: data.data.message,
                color: "green",
            })

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
    const [manager, setManager] = useState("")
    const [showAddManager, setShowAddManager] = useState(false)
    //const [showAssignManager, setShowAssignManager]=useStat
    return (
        <div>
            <AddManager opened={showAddManager} setOpened={setShowAddManager} />
            <div className="flex mb-6 items-center">
                <p className="text-[16px] sm:text-[20px] font-semibold flex-1 text-center">
                    Assign A Manager
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            {isLoading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <CgSpinner className="animate-spin text-black-100 text-2lg " />
                </div>
            ) : data?.data && data?.data.length > 0 ? (
                <>
                    {data?.data.map((item, index) => (
                        <div
                            key={index}
                            className="flex border-b border-[#F5F5F6] justify-between p-4 items-center"
                        >
                            <div className="flex">
                                <img src={Avatar} alt="" />
                                <p className="text-[20px] text-[#333333] font-medium ml-4">
                                    {item.firstName + " " + item.lastName}
                                </p>
                            </div>
                            <Radio
                                onChange={() => setManager(item._id)}
                                checked={manager === item._id}
                            />
                        </div>
                    ))}

                    <div className="flex gap-6">
                        <Button
                            variant="clear"
                            className="px-6 border-[#CCCCCC] w-full rounded-[40px] mt-10"
                            type="button"
                            
                            onClick={() => setShowAddManager(true)
                            }
                        >
                            Add a manager
                        </Button>
                        <Button
                            variant="primary"
                            className="px-6   w-full rounded-[40px] mt-10"
                            type="submit"
                            disabled={isPending}
                            onClick={() =>
                                mutate({
                                    managerId: manager,
                                    talentId: id,
                                    permissions: ["manageUser"],
                                })
                            }
                        >
                            {isPending ? "Adding..." : "Add new manager"}
                        </Button>
                    </div>
                </>
            ) : (
                <div className=" justify-center mx-auto sm:w-[82%] my-40">
                    <p className="text-center">
                        You have not added any manager to your team yet. Click
                        the button below to add a manager
                    </p>
                    <Button
                        variant="primary"
                        className="px-6   mx-auto rounded-[40px] mt-6"
                        type="button"
                        disabled={isPending}
                        onClick={() => setShowAddManager(true)
                        }
                    >
                        Add a manager
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AssignManager
