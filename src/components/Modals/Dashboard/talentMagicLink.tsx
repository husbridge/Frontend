import Close from "@assets/icons/close.svg"
import { Input } from "@components/index"
import Avatar from "@components/Layout/avatar"
import PendingTalent from "@components/Layout/PendingTalent"
import { Alert, Modal } from "@mantine/core"
import { frontendUrl } from "@services/api.services"
import { fetchTalents } from "@services/talents"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { BiSearch } from "react-icons/bi"
import { CgSpinner } from "react-icons/cg"
import { IoCopyOutline } from "react-icons/io5"
import { LuShare2 } from "react-icons/lu"

export interface TalentMagicLinkModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const TalentMagicLinkModal = ({
    opened,
    setOpened,
}: TalentMagicLinkModalProps) => {
    const [copied, setCopied] = useState(false)
    const [uniqueName, setUniqueName] = useState("")
    const { data, isLoading } = useQuery({
        queryKey: ["talents"],
        queryFn: () => fetchTalents(),
    })
    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            {" "}
            {isLoading ? (
                <div className="h-screen w-full flex items-center justify-center">
                    <CgSpinner className="animate-spin text-black-100 text-2lg " />
                </div>
            ) : (
                <>
                    <div className="flex mb-6 items-center">
                        <p className="text-[20px] font-semibold flex-1 text-center">
                            Talent Magic Links
                        </p>
                        <img
                            src={Close}
                            alt=""
                            className="flex-none cursor-pointer"
                            onClick={() => setOpened(false)}
                        />
                    </div>
                    <Input
                        placeholder="Search Talent"
                        className=" border border-[#E0E0E0] rounded-2xl w-full p-4 h-[50px] text-[12px] text-grey-100 font-medium mb-4"
                        prefixIcon={
                            <BiSearch
                                size="30px"
                                color="black"
                                className="mr-2"
                            />
                        }
                    />
                    {data?.data
                        .filter((d) => d.verificationTypeValue !== "pending")
                        .map((item, index) => (
                            <div
                                className="flex border-b border-grey-90 py-6 justify-between items-center"
                                key={index}
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        alt={item.fullName.trim()}
                                        imageUrl={item.profileUrl}
                                        size={45}
                                    />
                                    <div className="text-[#333333] ml-2">
                                        <p className="text-2md">
                                            {item.fullName.trim()}
                                        </p>
                                        <div className="text-sm">
                                            {item.stageName}{" "}
                                            <PendingTalent item={item} />
                                        </div>
                                    </div>
                                </div>
                                {item.verificationTypeValue !== "pending" && (
                                    <CopyToClipboard
                                        onCopy={() => {
                                            setCopied(true)
                                            setUniqueName(item.uniqueUsername)
                                            setTimeout(() => {
                                                setCopied(false)
                                            }, 2000)
                                        }}
                                        text={`${frontendUrl()}/contact/${item.uniqueUsername}`}
                                    >
                                        <div className="flex">
                                            <div className="flex items-center cursor-pointer">
                                                <IoCopyOutline
                                                    color="#FFC107"
                                                    size="16px"
                                                />
                                                <p className="ml-2 text-sm md:text-base text-black-600">
                                                    Copy Link
                                                </p>
                                            </div>
                                            <div className="flex items-center ml-4 cursor-pointer">
                                                <LuShare2
                                                    color="#FFC107"
                                                    size="16px"
                                                />
                                                <p className="ml-2 text-sm md:text-base text-black-600">
                                                    Share
                                                </p>
                                            </div>
                                        </div>
                                    </CopyToClipboard>
                                )}
                                {copied &&
                                    item.uniqueUsername === uniqueName && (
                                        <div className="absolute right-6 -mt-20">
                                            <Alert
                                                variant="light"
                                                color="blue"
                                                //title="Alert title"
                                            >
                                                Copied
                                            </Alert>
                                        </div>
                                    )}
                            </div>
                        ))}
                </>
            )}
        </Modal>
    )
}

export default TalentMagicLinkModal
