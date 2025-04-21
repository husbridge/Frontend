import Agency from "@assets/icons/agency.svg"
import Manager from "@assets/icons/manager.svg"
import Talent from "@assets/icons/talent.svg"
import { Button, Radio } from "@components/index"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AlreadyHaveAnAccount from "./components/AlreadyHaveAnAccount"
import LeftBackground from "./components/leftBackground"

const Welcome = () => {
    const navigate = useNavigate()

    const [userType, setUserType] = useState<string>("Agency")
    const userTypes = [
        {
            image: Agency,
            title: "Agency",
            description: "Sign up as an Agency to begin managing your Talents!",
        },
        {
            image: Manager,
            title: "Manager",
            description: "Sign up as a Manager to begin managing your Talents!",
        },
        {
            image: Talent,
            title: "Talent",
            description:
                "Signup as a Talent to begin managing yourself and your business",
        },
    ]
    return (
        <div className="flex">
            <div className="md:block hidden">
                <LeftBackground />
            </div>

            <div className="bg-white-100 md:p-20 p-6 mx-auto md:mt-10 ">
                <h3 className="font-semibold text-[28px] sm:text-2lg leading-8">
                    Welcome to Husridge
                </h3>
                <p className="text-3md text-black-50 mt-4 mb-8">
                    What do you want to continue as?
                </p>
                {userTypes.map((item, index) => (
                    <label
                        key={index}
                        className="flex border border-[#E0E0E0] rounded-[12px] mb-6 p-4 items-center cursor-pointer hover:border-[#777777] transition-colors"
                    >
                        <img src={item.image} alt="" />
                        <div className="pl-4 mr-2">
                            <p className="text-3md font-medium">{item.title}</p>
                            <p className="text-black-70 mt-2">
                                {item.description}
                            </p>
                        </div>
                        <Radio
                            classNames={{
                                wrapper: "ml-auto",
                            }}
                            onChange={() => setUserType(item.title)}
                            checked={userType === item.title}
                        />
                    </label>
                ))}
                <Button
                    variant="primary"
                    className="w-full mt-10"
                    onClick={() =>
                        userType === "Agency"
                            ? navigate("/agency-signup")
                            : userType === "Manager"
                              ? navigate("/manager-signup")
                              : navigate("/talent-signup")
                    }
                >
                    Proceed
                </Button>
                <AlreadyHaveAnAccount />
            </div>
        </div>
    )
}
export default Welcome
