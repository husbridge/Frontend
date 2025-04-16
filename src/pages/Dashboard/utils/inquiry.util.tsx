import Document from "@assets/icons/document.svg"
 
// export interface InquiriesInterface{
//     name: string,
//         stageNamstring,
//         email: string,
//         type: string,
//         subject: string,
//         attachment:string,
//         date:string,
// }
export const inquiryData = [
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
         type: "Collaboration",
        subject: "Wedding Event",
        attachment: "3 files",
        date: "2 Dec, 2023",
        time:"5:19PM",
       
    },
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
        type: "Collaboration",
        subject: "Wedding Event",
        attachment: "3 files",
        date: "2 Dec, 2023",
        time:"5:19PM",
       
    },
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
        type: "Collaboration",
        subject: "Wedding Event",
        attachment: "3 files",
        date: "2 Dec, 2023",
        time:"5:19PM",
      
    },
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
        type: "Collaboration",
        subject: "Wedding Event",
        attachment: "No attachment",
        date: "2 Dec, 2023",
        time:"5:19PM",
       
    },
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
        type: "Collaboration",
        subject: "Wedding Event",
        attachment: "No attachment",
        date: "2 Dec, 2023",
        time:"5:19PM",
       
        
    },
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
        type: "Collaboration",
        subject: "Wedding Event",
        attachment: "No attachment",
        date: "2 Dec, 2023",
        time:"5:19PM",
        music: "Music Industry",
        event: "2 upcoming events"
    },
    {
        name: "Adeleke David",
        stageName:"Shallipopi",
        email: "adelekedavid@gmail.com",
        talent: "Adeleke David",
        type: "Collaboration",
        subject: "Wedding Event",
        attachment: "No attachment",
        date: "2 Dec, 2023",
        time:"5:19PM",
     
    },
]

export const attachment = (role: string) => {
    switch (role) {
        case "No attachment":
            return <p className="text-[#FCB20]">No attachment</p>
        default:
            return (
                <div className="flex">
                    <img src={Document} alt="" />
                    <p className="ml-2">{role}</p>
                </div>
            )
    }
}
