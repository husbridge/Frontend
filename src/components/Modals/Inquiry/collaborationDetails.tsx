import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"

export interface CollaborationDetailsModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const CollaborationDetails = ({
    opened,
    setOpened,
}: CollaborationDetailsModalProps) => {
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
                Collaboration details
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <div className="flex">
                <img src="" alt="" />
                <div>
                    
                </div>
            </div>
        </Modal>
    )
}
export default CollaborationDetails
