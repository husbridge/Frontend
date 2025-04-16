 import { useState, useRef } from "react"
import Info from "@assets/icons/info.svg"
import Upload from "@assets/icons/upload.svg"
import Papa from "papaparse"
import { Button } from "@components/index"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { showNotification } from "@mantine/notifications"
// import useAuth from "@hooks/auth/useAuth"
import dayjs from "dayjs"
// import { createEvent } from "@services/calendar"
// import { Results } from "type/api/calendar.types"
import { CSVLink } from "react-csv"
 import Download from "@assets/icons/download.svg"

const BulkAddition = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
     const [fileName, setFileName] = useState("")
    //const [fileBlob, setFileBlob] = useState<File | null>(null)
    //const [events, setEvents] = useState<any[]>([])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]
        //if (!file) return
        if (file) {
            setFileName(file.name)
            //setFileBlob(file)
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    //setEvents(results.data)
                    console.log(results.data)
                },
            })
        }
    }
    // const { state } = useAuth()
    // const queryClient = useQueryClient()

    // const { isPending, mutate } = useMutation({
    //     mutationFn: createEvent,
    //     onSuccess: () => {
    //         showNotification({
    //             title: "Success",
    //             message: "Event created successfully",
    //             color: "green",
    //         })
    //         queryClient
    //             .invalidateQueries({ queryKey: ["events"] })
    //             .finally(() => false)
    //         //onClose()
    //     },
    //     onError: (err: Error) => {
    //         showNotification({
    //             title: "Error",
    //             message:
    //                 err.message ||
    //                 "Something went wrong, please try again later",
    //             color: "red",
    //         })
    //     },
    // })
    // const handleSubmit = async () => {
    //     if (events.length > 0) {
    //         await Promise.all(
    //             events.map(
    //                 (item) =>
    //                     console.log(
    //                         dayjs(item.Time).format(
    //                             dayjs(item.Date + "" + item.Time).format(
    //                                 `YYYY-MM-DDTHH:mm:ss[Z]`
    //                             )
    //                         ),
    //                         "FFFF",
    //                         item.Date,
    //                         item.Time
    //                     )
                    // console.log(item["Event Title"])
                    // mutate({
                    //     eventTitle: item["Event Title"],
                    //     description: item.Description,
                    //     eventVenue: item.Venue,
                    //     eventCity: item.City,
                    //     eventCountry: item.Country,
                    //     eventDate: dayjs(item.Date).format(
                    //         "YYYY-MM-DDTHH:mm:ss[Z]"
                    //     ),
                    //     eventTime: dayjs(item.Time).format(
                    //         dayjs(item.eventDate).format(
                    //             `YYYY-MM-DDT${item.eventTime.split(":")[0]}:${item.eventTime.split(":")[1]}:ss.000Z`
                    //         )
                    //     ),
                    //     userId: state.user?.id || 0,
                    // })
                //)
            //)
        //}
    //}
    const csvData = [
        [
            "Event title",
            "Description",
            "Venue",
            "City",
            "Country",
            "Date",
            "Time",
        ],
        [
            "Eko Shutdown",
            "A funfilled event",
            "Eko Hotels, Avenue 50. Ikeja Lagos",
            "Lagos",
            "Nigeria",
            "2022-01-01",
            "14:00",
        ],
        [
            "Laugh matterz",
            "A really cool event",
            "o2 Arena, London",
            "London",
            "United Kingdom",
            "2024-01-31",
            "21:00",
        ],
    ]
    console.log(
        "2022-01-01",
        dayjs("2022-01-01").format("YYYY-MM-DDTHH:mm:ss[Z]")
    )
    console.log(
        "2022-01-01",
        dayjs("2022-01-20,5:50 pm").format("YYYY-MM-DDTHH:mm:ss[Z]")
    )
    return (
        <div className="mt-4">
            <input
                data-testid="file-upload"
                ref={fileInputRef}
                type="file"
                id="csvInput"
                accept=".csv"
                hidden
                onChange={handleFileUpload}
                //     () => {
                //     const reader = new FileReader()
                //     reader.onload = () => {
                //         // @ts-ignore
                //         document.getElementById("out").innerHTML = reader.result
                //     }
                //     // start reading the file. When it is done, calls the onload event defined above.
                //     // @ts-ignore
                //     reader.readAsBinaryString(
                //         // @ts-ignore
                //         document.getElementById("csvInput").files[0]
                //     )
                // }
            />
            {/* <pre id="out"><p>File contents will appear here</p></pre> */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-dashed border border-[1.5] border-[#909090] rounded flex flex justify-center p-8 bg-[#E7E7E74F]"
            >
                <div className="">
                    <div className="flex justify-center">
                        <img src={Upload} alt="" />
                    </div>
                    {fileName ? (
                        <p>{fileName} uploaded</p>
                    ) : (
                        <>
                            <p className="font-bold text-md text-center text-[#B4B4B4]">
                                Drop Excel or CSV file(s) here or{" "}
                                <span className="text-[#E8B006]">browse</span>
                            </p>
                            <p className="font-sm mt-2 text-center text-[#909090]">
                                Max. File size: 2 MB{" "}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="border border-[#FECB50] bg-[#FFFEE1] rounded-lg flex justify-center p-3 mt-4">
                <img src={Info} alt="" />
                <p className="ml-4">
                    Please note that the uploaded file should contain Event
                    title, description, venue, city, country time and date
                </p>
            </div>
            <CSVLink data={csvData} filename={"Event List.csv"} target="_blank">
                <div className="flex mt-2 items-center text-[#2196f3]">
                    <img src={Download} alt="" />
                    <p className="text-md underline pl-2"> View CSV format</p>
                </div>
            </CSVLink>
            <Button
                variant="primary"
                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                type="submit"
                //onClick={() => handleSubmit()}
            >
                Proceed
                {/* {isPending ? "Loading..." : "Proceed"} */}
            </Button>
        </div>
    )
}

export default BulkAddition
