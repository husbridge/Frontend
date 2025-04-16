import { Table, Menu } from "@mantine/core"
import { LuEye } from "react-icons/lu"
import { BiEdit } from "react-icons/bi"
import { SlOptionsVertical } from "react-icons/sl"
import Trash from "@assets/icons/trash.svg"
import { status } from "../utils/team.utils"
import { Data } from "type/api/manager.types"
import dayjs from "dayjs"
import assignIcon from "@assets/icons/assign.svg"

interface TeamTableInterface {
    setTeamMemberDetails: React.Dispatch<React.SetStateAction<boolean>>
    setReactivateManagerModal: React.Dispatch<React.SetStateAction<boolean>>
    setSuspendManagerModal: React.Dispatch<React.SetStateAction<boolean>>
    setDeactivateManagerModal: React.Dispatch<React.SetStateAction<boolean>>
    data: Data[]
    setActiveId: React.Dispatch<React.SetStateAction<string>>
    setAssignManager: React.Dispatch<React.SetStateAction<boolean>>
}

const TeamTable = ({
    setTeamMemberDetails,
    setReactivateManagerModal,
    setDeactivateManagerModal,
    setSuspendManagerModal,
    data,
    setActiveId,
    setAssignManager
}: TeamTableInterface) => {
    const rows = data.map((item, index) => (
        <Table.Tr
            key={index}
            className="text-[#1C1C1C]  group "
            style={{
                fontSize: "14px",
            }}
        >
            <Table.Td>{item.fullName}</Table.Td>
            <Table.Td>{item.emailAddress}</Table.Td>
            <Table.Td>{item.phoneNumber}</Table.Td>
            <Table.Td>{dayjs(item.createdAt).format("DD MMM, YYYY")}</Table.Td>
            <Table.Td>{status(item.userStatus)}</Table.Td>
            <Table.Td className="cursor-pointer">
                <Menu shadow="md" width={250} position="bottom-end">
                    <Menu.Target>
                        <div>
                            <SlOptionsVertical />
                        </div>
                    </Menu.Target>
                    <Menu.Dropdown className="rounded-lg ">
                        
                        <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setActiveId(item._id)
                                setTeamMemberDetails(true)
                            }}
                        >
                            <div className="flex items-center">
                                <LuEye size="22px" color="#373636" />
                                <p className="text-[#373636] ml-2">
                                    View full details{" "}
                                </p>
                            </div>
                        </Menu.Item>
                        <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setActiveId(item._id)
                                setAssignManager(true)
                            }}
                        >
                            <div className="flex items-center">
                                <img src={assignIcon} alt="" />
                                <p className="text-[#373636] ml-2">
                                    Assign Talent{" "}
                                </p>
                            </div>
                        </Menu.Item>
                        {item.userStatus !== "active" && <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setActiveId(item._id)
                                setReactivateManagerModal(true)
                            }}
                        >
                            <div className="flex items-center">
                                <BiEdit size="22px" color="#373636" />
                                <p className="text-[#373636] ml-2">
                                    Reactivate Manager
                                </p>
                            </div>
                        </Menu.Item>}

                        {item.userStatus !== "suspend" && <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setActiveId(item._id)
                                setSuspendManagerModal(true)
                            }}
                        >
                            <div className="flex items-center">
                                <img src={Trash} alt="" />
                                <p className=" text-[#373636] ml-2">
                                    Suspend manager
                                </p>
                            </div>
                        </Menu.Item>}
                        {item.userStatus !== "deactivated" && <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setActiveId(item._id)
                                setDeactivateManagerModal(true)
                            }}
                        >
                            <div className="flex items-center">
                                <img src={Trash} alt="" />
                                <p className=" text-[#373636] ml-2">
                                    Deactivate manager
                                </p>
                            </div>
                        </Menu.Item>}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ))
    const tableHead = [
        "Name",
        "E-mail",
        "Phone number",
        "Date Added",
        "Status",
        "Action",
    ]
    return (
        <Table
            style={{
                fontFamily: "Montserrat",
                fontSize: "14",
                fontWeight: "semi-",
            }}
            verticalSpacing="md"
            data-testid="table-data"
            role="grid"
            withRowBorders={true}
        >
            <Table.Thead className=" w-full border-b-[1px] border-[#EEEEEE] font-bold">
                <Table.Tr className="">
                    {tableHead.map((item, index) => (
                        <Table.Th
                            key={index}
                            style={{
                                borderBottom: "1px",
                                color: "#000000",
                                fontSize: "14px",
                                fontWeight: 600,
                            }}
                        >
                            {item}
                        </Table.Th>
                    ))}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    )
}

export default TeamTable
