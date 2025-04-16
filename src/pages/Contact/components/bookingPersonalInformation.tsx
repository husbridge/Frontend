import { FormControls} from "@components/index"


const BookingPersonalInformation = () => {
    return (
        <div>
            <div className="flex justify-between my-6">
                <p className="text-2md font-medium">Personal Information</p>
                <p className="text-2md font-medium text-[#333333]">1 of 3</p>
            </div>

            <div className="mb-6">
                <FormControls
                    label="Full Name"
                    control="input"
                    name="fullName"
                    classNames={{
                        mainRoot: " border  border-black-20 px-2",
                        input: "text-[#40540A] text-[14px]",
                    }}
                    labelClassName="text-[#000]"
                />
            </div>
            <div className="mb-6">
                <FormControls
                    label="Also known as (optional)"
                    control="input"
                    name="alsoKnownAs"
                    placeholder="what is a popular name you are known as"
                    classNames={{
                        mainRoot: " border  border-black-20 px-2",
                        input: "text-[#40540A] text-[14px]",
                    }}
                    labelClassName="text-[#000]"
                />
            </div>

            <div className="mb-6">
                <FormControls
                    label="Email"
                    control="input"
                    name="emailAddress"
                    classNames={{
                        mainRoot: " border  border-black-20 px-2",
                        input: "text-[#40540A] text-[14px]",
                    }}
                />
            </div>
            <div className="mb-6">
                <FormControls
                    label="Mobile Number"
                    control="input"
                    name="phoneNumber"
                    classNames={{
                        mainRoot: " border  border-black-20 px-2",
                        input: "text-[#40540A] text-[14px]",
                    }}
                />
            </div>
        </div>
    )
}

export default BookingPersonalInformation
