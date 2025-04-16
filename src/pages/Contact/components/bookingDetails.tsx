import { FormControls } from "@components/index"
import { useInquiryStore } from "@hooks/useInquiry"

const BookingDetails = () => {
    const document = useInquiryStore((state) => state.document)
    const setDocument = useInquiryStore((state) => state.setDocument)

    const handleFileChange = (e: any) => {
        const file = e.target.files[0]
        console.log("Selected File:", file)
        setDocument(file)
    }

    return (
        <div>
            <div className="flex justify-between my-6">
                <p className="text-2md font-medium">Event Information</p>
                <p className="text-2md font-medium text-[#333333]">3 of 3</p>
            </div>

            <div className="mb-6">
                <FormControls
                    label="Subject"
                    control="input"
                    name="subject"
                    classNames={{
                        mainRoot: " border  border-black-20 px-2",
                        input: "text-[#40540A] text-[14px]",
                    }}
                />
            </div>
            <div className="mb-6">
                <FormControls
                    label="Description"
                    control="textarea"
                    name="description"
                    classNames={{
                        mainRoot: " border border-black-20 px-2",
                        input: "text-[#40540A] text-[14px] h-[150px]",
                    }}
                />
            </div>
            <div className="mb-6">
                {/* Hidden File Input */}
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    style={{ display: "none" }} // Hide the file input
                />

                {/* Custom Label with File Input */}
                <label htmlFor="file-upload">
                    <div className="text-md mb-1">Attach document</div>
                    <div
                        className="border border-dashed border-[#CBD5E1] px-2 rounded-3xl cursor-pointer"
                        style={{ padding: 16 }}
                    >
                        {document?.name || (
                            <p className="text-[#ccc] text-md">
                                Upload Png, Jpg or Jpeg of your Valid ID
                            </p>
                        )}
                    </div>
                </label>
            </div>
        </div>
    )
}

export default BookingDetails
