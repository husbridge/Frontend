import { CgSpinner } from "react-icons/cg"
import Logo from "@assets/icons/logo.svg"
import useAuth from "@hooks/auth/useAuth"
import MainTalents from "./talent"
import TalentInformation from "./subnavigations/talentInformation"
const Talents = () => {
    const { state } = useAuth()
    
    const userType = state.user?.userType

    switch (true) {
        case userType === "talent":
            return <TalentInformation />
        case userType === "agency" || userType === "manager":
            return <MainTalents />
        default:
            return (
                <div className="h-screen w-full flex items-center justify-center">
                    <img
                        src={Logo}
                        alt=""
                        className="animate-pulse "
                        width={80}
                    />
                    <CgSpinner className="animate-spin text-black-100 text-2lg " />
                </div>
            )
    }
}

export default Talents
