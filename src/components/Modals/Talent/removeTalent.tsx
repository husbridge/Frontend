import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { Button } from "@components/index"
import RedTrash from "@assets/icons/redTrash.svg"

export interface RemoveTalentModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const RemoveTalentModal = ({ opened, setOpened }: RemoveTalentModalProps) => {
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
            <div className="flex justify-end mr-4">
                <img
                    src={Close}
                    alt=""
                    className=" cursor-pointer mb-2"
                    onClick={() => setOpened(false)}
                />
            </div>

            <div className="flex flex-col items-center justify-center  w-full ">
                <img src={RedTrash} alt="" />
                <br />

                <h1 className="font-semibold sm:text-lg text-3md mb-4 text-center">
                    Remove Shallipopi?
                </h1>
                <p className="font-medium text-sm text-center ">
                    Are you sure you want to shallipopi from your talent list?
                </p>
            </div>
            <div
                className="mt-12 flex sm:px-4 !font-semibold"
                onClick={() => setOpened(false)}
            >
                <Button variant="clear" className="w-full !sm:text-md !text-sm">
                    Cancel
                </Button>

                <Button
                    variant="black"
                    className="ml-4 w-full !text-[#F6695E] !sm:text-md !text-sm"
                >
                    Remove from list
                </Button>
            </div>
        </Modal>
    )
}

export default RemoveTalentModal
