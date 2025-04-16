import { useState } from "react"

import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"

interface ToggleProps {
    toggleContainerText: string
    toggleChild: string
}
const Toggle = ({ toggleContainerText, toggleChild }: ToggleProps) => {
    const [openToggle, setOpenToggle] = useState(false)

    return (
        <div className="mb-8 border-b pb-4 px-4 border-[#292D3229]">
            <div
                className="flex justify-between"
                onClick={() => setOpenToggle(!openToggle)}
            >
                <p className={`text-[16px] md:text-[20px] text-black-100 font-medium`}>
                    {toggleContainerText}
                </p>

                {openToggle ? (
                    <AiOutlineMinus
                        color="black"
                        size="24px"
                        className="cursor-pointer"
                    />
                ) : (
                    <AiOutlinePlus
                        color="black"
                        size="24px"
                        className="cursor-pointer"
                    />
                )}
            </div>
            {openToggle && (
                <p className="mt-4 text-sm md:text-md  text-black-100 font-light">{toggleChild}</p>
            )}
        </div>
    )
}
export default Toggle
