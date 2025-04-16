import { Table, Menu } from "@mantine/core"
import { LuEye } from "react-icons/lu"
import { BiEdit } from "react-icons/bi"
import { SlOptionsVertical } from "react-icons/sl"
//import Trash from "@assets/icons/trash.svg"
import { useNavigate } from "react-router-dom"
//import { LuCalendarDays } from "react-icons/lu"
import { Data } from "type/api/talents.types"
import dayjs from "dayjs"

interface TalentTableInterface {
    setEditTalentModal: React.Dispatch<React.SetStateAction<boolean>>
    //setRemoveTalentModal: React.Dispatch<React.SetStateAction<boolean>>
    setFilterModal: React.Dispatch<React.SetStateAction<boolean>>
    data: Data[]
    setActiveId: React.Dispatch<React.SetStateAction<string>>
}

const TalentTable = ({
    setEditTalentModal,
    //setRemoveTalentModal,
    data,
    setActiveId
}: TalentTableInterface) => {
    const navigate = useNavigate()

    const rows = data.map((item, index) => (
        <Table.Tr
            key={index}
            className="text-[#1C1C1C]  group "
            style={{
                fontSize: "14px",
            }}
        >
            <Table.Td>{item.firstName+" "+item.lastName}</Table.Td>
            <Table.Td>{item.stageName||"Nil"}</Table.Td>
            <Table.Td>{item.industry}</Table.Td>
            <Table.Td>{dayjs(item.createdAt).format("DD MMM, YYYY")}</Table.Td>
            {/* <Table.Td>{}</Table.Td> */}
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
                                navigate(`/talents/${item._id}`)
                            }}
                        >
                            <div className="flex items-center">
                                <LuEye size="22px" color="#373636" />
                                <p className="text-[#373636] ml-2">
                                    View full details
                                </p>
                            </div>
                        </Menu.Item>

                        <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setActiveId(item._id)
                                setEditTalentModal(true)
                            }}
                        >
                            <div className="flex items-center">
                                <BiEdit size="22px" color="#373636" />
                                <p className="text-[#373636] ml-2">
                                    Edit Talent Information
                                </p>
                            </div>
                        </Menu.Item>

                        {/* <Menu.Item
                            className="font-medium text-md rounded-lg"
                            onClick={() => {
                                setRemoveTalentModal(true)
                            }}
                        >
                            <div className="flex items-center">
                                <img src={Trash} alt="" />
                                <p className=" text-[#373636] ml-2">
                                    Remove Talent
                                </p>
                            </div>
                        </Menu.Item> */}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ))
    const tableHead = [
        "Name",
        "Stage Name",
        "Industry",
        "Date Added",
        //"Upcoming Event",
        "Action",
    ]
    return (
        <div>
            <div className="hidden md:block">
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
            </div>

            <div className="block md:hidden">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="border bg-white-100
                rounded-md p-4 mb-2"
                    >
                        <div className="flex justify-between">
                            <div className="flex justify-between">
                                <p className="font-medium text-md">
                                {item.firstName+" "+item.lastName}
                                </p>
                                
                            </div>
                            
                        
                            <div className="cursor-pointer">
                                <Menu
                                    shadow="md"
                                    width={250}
                                    position="bottom-end"
                                >
                                    <Menu.Target>
                                        <div>
                                            <SlOptionsVertical />
                                        </div>
                                    </Menu.Target>
                                    <Menu.Dropdown className="rounded-lg ">
                                        <Menu.Item
                                            className="font-medium text-md rounded-lg"
                                            onClick={() => {
                                                navigate(`/talents/${item._id}`)
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <LuEye
                                                    size="22px"
                                                    color="#373636"
                                                />
                                                <p className="text-[#373636] ml-2">
                                                    View full details{" "}
                                                </p>
                                            </div>
                                        </Menu.Item>

                                        <Menu.Item
                                            className="font-medium text-md rounded-lg"
                                            onClick={() => {
                                                setActiveId(item._id)
                                                setEditTalentModal(true)
                                            }}
                                        >
                                        
                                            <div className="flex items-center">
                                                <BiEdit
                                                    size="22px"
                                                    color="#373636"
                                                />
                                                <p className="text-[#373636] ml-2">
                                                    Edit Talent Information
                                                </p>
                                            </div>
                                        </Menu.Item>

                                        {/* <Menu.Item
                                            className="font-medium text-md rounded-lg"
                                            onClick={() => {
                                                setRemoveTalentModal(true)
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <img src={Trash} alt="" />
                                                <p className=" text-[#373636] ml-2">
                                                    Remove Talent
                                                </p>
                                            </div>
                                        </Menu.Item> */}
                                    </Menu.Dropdown>
                                </Menu>
                            </div>
                        </div>
                        <p className="font-normal text-[12px] leading-3 mt-2">
                        {item.industry}
                        </p>
                        <div className="mt-3">
                            <p className="font-medium text-md">
                                {item.stageName}
                                </p>
                            </div>
                        <div className="mt-3">
                            <p className="font-medium text-md">
                                {dayjs(item.createdAt).format("DD MMM, YYYY")}
                                </p>
                            </div>
                        {/* <div className="flex mt-3">
                            <LuCalendarDays size={20} />
                            <p className="font-normal text-[12px] leading-3 mt-1 ml-2">
                                2 Upcoming events
                            </p>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TalentTable
