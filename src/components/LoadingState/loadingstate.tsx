import Logo from "@assets/icons/logo.svg"
import { CgSpinner } from "react-icons/cg"


const LoadingState = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <img
        src={Logo}
        alt=""
        className="animate-pulse"
        width={80}
      />
      <CgSpinner className="animate-spin text-black-100 text-2lg" />
    </div>
  )
}
export default LoadingState