import Logo from "@assets/images/logo.png";

const LeftBackground=()=>{
    return(
        <div className="bg-black-100 px-4 h-screen items-center py-[55%] sticky top-0">
            <img src={Logo} alt="" />
        </div>
    )
}

export default LeftBackground