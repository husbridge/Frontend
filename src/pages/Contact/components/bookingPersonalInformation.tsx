import { FormControls} from "@components/index"
import { darkInput, darkLabel, darkStepCounter } from "../darkTheme"


const BookingPersonalInformation = () => {
    return (
        <div>
            <div className="flex justify-between my-6">
                <p className="text-2md font-medium text-[#ffffff]">Personal Information</p>
                <p className={`text-2md font-medium ${darkStepCounter}`}>1 of 3</p>
            </div>

            <div className="mb-6">
                <FormControls
                    label="Full Name"
                    control="input"
                    name="fullName"
                    classNames={darkInput}
                    labelClassName={darkLabel}
                />
            </div>
            <div className="mb-6">
                <FormControls
                    label="Also known as (optional)"
                    control="input"
                    name="alsoKnownAs"
                    placeholder="what is a popular name you are known as"
                    classNames={darkInput}
                    labelClassName={darkLabel}
                />
            </div>

            <div className="mb-6">
                <FormControls
                    label="Email"
                    control="input"
                    name="emailAddress"
                    classNames={darkInput}
                    labelClassName={darkLabel}
                />
            </div>
            <div className="mb-6">
                <FormControls
                    label="Mobile Number"
                    control="input"
                    name="phoneNumber"
                    classNames={darkInput}
                    labelClassName={darkLabel}
                />
            </div>
        </div>
    )
}

export default BookingPersonalInformation
