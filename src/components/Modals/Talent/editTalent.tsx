import { Modal, Progress } from "@mantine/core"
import { useState } from "react"
import TalentInformation from "./components/talentInformation"
import AssignManager from "./components/assignManager"
//import SelectManager from "./components/selectManager"
import { CgSpinner } from "react-icons/cg"
import { useQuery } from "@tanstack/react-query"
import { fetchSingleUser } from "@services/manager"


export interface EditTalentModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    activeId: string
}

const EditTalent = ({ opened, setOpened, activeId }: EditTalentModalProps) => {
    const [value, setValue] = useState(50)
    const { data, isLoading } = useQuery({
        queryKey: ["singleUser", activeId],
        queryFn: () => fetchSingleUser({ id: activeId }),
    })
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
                <>
                    <Progress
                        color="#050505"
                        value={value}
                        radius="xs"
                        className="mb-8 w-[80%] mx-auto"
                    />
                    {value === 50 ? (
                        <TalentInformation
                            handleClick={() => setValue(100)}
                            setOpened={setOpened}
                            data={data?.data}
                        />
                    ) : (
                        <AssignManager
                            setOpened={setOpened}
                            //handleClick={() => setValue(50)}
                            id={activeId}
                        />
                    )}

                    {/* <SelectManager
                            setOpened={setOpened}
                            handleClick={() => {}}
                        /> */}
                </>
            )}
        </Modal>
    )
}
export default EditTalent
