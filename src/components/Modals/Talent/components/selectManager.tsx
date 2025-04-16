import Close from "@assets/icons/close.svg"
import { Button, Radio } from "@components/index"
import { useState } from "react"

interface SelectManagerInterface {
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    handleClick: () => void
}
const SelectManager = ({ setOpened, handleClick }: SelectManagerInterface) => {
    const [managerRole, setManagerRole] = useState("")

    const managerRoles = [
        {
            title: "Booking Management",
            description:
                "Manage all their show bookings and apppointment of the artist",
        },
        {
            title: "Inquiry Management",
            description:
                "Manage all their show bookings and apppointment of the artist",
        },
        {
            title: "Collaboration Management",
            description:
                "Manage all their show bookings and apppointment of the artist",
        },
        {
            title: "Proposals Management",
            description:
                "Manage all their show bookings and apppointment of the artist",
        },
    ]
    return (
        <div>
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Select Manager Roles
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            {managerRoles.map((item, index) => (
                <div
                    key={index}
                    className="flex border-b border-[#F5F5F6] justify-between mb-0 p-4 items-center"
                >
                    <div className="">
                        <p className="text-md font-medium">{item.title}</p>
                        <p className="text-sm ">{item.description}</p>
                    </div>
                    <Radio
                        onChange={() => setManagerRole(item.title)}
                        checked={managerRole === item.title}
                    />
                </div>
            ))}
            <Button
                variant="primary"
                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                type="submit"
                onClick={handleClick}
            >
                Proceed
            </Button>
        </div>
    )
}

export default SelectManager
