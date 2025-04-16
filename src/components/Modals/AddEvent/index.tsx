import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import SingleAddition from "./singleAddition"

export interface AddEventModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const AddEvent = ({ opened, setOpened }: AddEventModalProps) => {
    
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
            <div className="sm:px-6">
                <div className="flex mb-6 items-center">
                    <p className="text-[20px] font-semibold flex-1 text-center">
                        Add Event
                    </p>
                    <img
                        src={Close}
                        alt=""
                        className="flex-none cursor-pointer"
                        onClick={() => setOpened(false)}
                    />
                </div>

                <SingleAddition onClose={()=>setOpened(false)} />
            </div>
        </Modal>
    )
}

export default AddEvent
