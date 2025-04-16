import { Drawer } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { Button } from "@components/index"
import { BiEditAlt } from "react-icons/bi"
import { MdVerified, MdAttachFile, MdClose } from "react-icons/md"
import Avatar from "@assets/images/avatar.png"
import { useRef, useState, useEffect } from "react"
import { ChangeEvent } from "react"
import { PiPlusBold } from "react-icons/pi"
import GenerateInvoiceModal from "./generateInvoice"
import { useInvoiceStore } from "@hooks/useInvoiceStore"

export interface RespondModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}
const RespondModal = ({ opened, setOpened }: RespondModalProps) => {
    const [openInput, setOpenInput] = useState(false)
    const [openCreateInvoice, setOpenCreateInvoice] = useState(false)
    const [openPop, setOpenPop] = useState(false)
    const [fileName, setFileName] = useState("")
    const [file, setFile] = useState<null | File>(null)
    const invoice = useInvoiceStore((state) => state.invoice)
    // this handles the ref that gets triggered when the user clicks on the attach icon
    const ref = useRef<HTMLInputElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (invoice?.name || file?.name) {
            setFileName(invoice?.name || file?.name || "")
        }
    }, [invoice, file])

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setFile(file)

            //setFieldValue("image", file)
        }
    }
    useEffect(() => {
        function handleClickOutside(event: Event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpenPop(false)
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [wrapperRef])

    return (
        <Drawer
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            position="right"
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            // overlayProps={{
            //     backgroundOpacity: 0.55,
            //     blur: 3,
            // }}
        >
            <GenerateInvoiceModal
                opened={openCreateInvoice}
                setOpened={setOpenCreateInvoice}
            />
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Collaboration details
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <div className="flex items-center">
                <img src={Avatar} className="w-16" alt="" />
                <div className="ml-4">
                    <div className="flex items-center">
                        <p className="text-3md sm:text-lg font-medium">
                            Bad Man Z
                        </p>
                        <MdVerified color="#D95B0E" className="ml-2" />
                    </div>
                    <p className="text-md text-[#5F5E5E] mt-2">
                        Badz@gmail.com
                    </p>
                </div>
            </div>
            <p className="bg-[#F7F7F7] mt-4 p-2 w-full">Overview</p>
            <p className="text-3md sm:text-lg font-medium my-4">
                Are you available on the 30th of January?
            </p>
            {openInput ? (
                <div className="border border-[#0000001A] rounded-[8px] p-2">
                    <textarea name="" id="" rows={4} className="outline-none" />
                    {fileName && (
                        <div className="flex bg-[#F7F7F7] p-2 items-between w-fit">
                            <p>{fileName}</p>{" "}
                            <MdClose
                                size={22}
                                className="ml-2 cursor-pointer"
                                onClick={() => setFile(null)}
                            />
                        </div>
                    )}
                    <div className="flex justify-end items-between">
                        <div className="relative">
                            <MdAttachFile
                                size={22}
                                className="mt-2 cursor-pointer"
                                onClick={() => setOpenPop(true)}
                            />
                            {openPop && (
                                <div
                                    className="absolute right-2 bg-white-100 rounded-lg p-4 w-[200px]"
                                    ref={wrapperRef}
                                >
                                    <div
                                        className="flex cursor-pointer"
                                        onClick={() =>
                                            setOpenCreateInvoice(true)
                                        }
                                    >
                                        {" "}
                                        <PiPlusBold size={22} color="#292D32" />
                                        <p className="text-[#373636] ml-2">
                                            Create invoice
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center mt-4 cursor-pointer"
                                        onClick={() => {
                                            ref.current?.click()
                                        }}
                                    >
                                        <MdAttachFile
                                            size={22}
                                            color="#000000"
                                        />
                                        <input
                                            data-testid="file-upload"
                                            // ref={fileInputRef}
                                            type="file"
                                            hidden
                                            onChange={handleUpload}
                                            ref={ref}
                                        />
                                        {/* </div> */}
                                        <p className="text-[#373636] ml-2">
                                            Attach a file
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button variant="primary" className="!text-md ml-4">
                            Send
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex">
                    <Button
                        variant="primary"
                        className="!text-md flex"
                        onClick={() => setOpenInput(true)}
                    >
                        <BiEditAlt
                            color="#FFC107"
                            size="22px"
                            className="mr-2"
                        />{" "}
                        Respond
                    </Button>
                </div>
            )}
        </Drawer>
    )
}
export default RespondModal
