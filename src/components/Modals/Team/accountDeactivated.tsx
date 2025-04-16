import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { Button } from "@components/index"
import RedTrash from "@assets/icons/redTrash.svg"

export interface AccountDeactivatedModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountDeactivatedModal = ({
    opened,
    setOpened,
}: AccountDeactivatedModalProps) => {
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
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Account Deactivated
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <div className="flex flex-col items-center justify-center  w-full ">
                <img src={RedTrash} alt="" />
                <br />

                <p className="font-medium text-md text-center mt-4">
                    You have successfully deactivated the Manager's account
                </p>
            </div>
            <div className="mt-12 flex" onClick={() => setOpened(false)}>
                <Button
                    variant="black"
                    className="ml-4 w-full !text-[#FFC107] !sm:text-md !text-sm"
                    onClick={() => setOpened(false)}
                >
                    Done
                </Button>
            </div>
        </Modal>
    )
}

export default AccountDeactivatedModal
