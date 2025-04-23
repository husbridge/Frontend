import Logo from "@assets/icons/logo.svg"

const LoadingState = () => {
    return (
        <div className="h-screen w-full flex gap-2 items-center justify-center">
            <img src={Logo} alt="" className="animate-pulse" width={150} />
            {/* <CgSpinner className="animate-spin text-black-100 text-2lg" /> */}
        </div>
    )
}
export default LoadingState
