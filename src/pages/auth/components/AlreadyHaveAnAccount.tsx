import { Link } from "react-router-dom"

export default function AlreadyHaveAnAccount() {
    return (
        <div className="mt-4">
            <p className="text-center text-md mt-28 text-[#475569]">
                Already have an account?{" "}
                <Link to="/login" className="underline font-semibold">
                    Login
                </Link>
            </p>
        </div>
    )
}
