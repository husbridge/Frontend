
export const teamData = [
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "deactivated",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "active",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "suspended",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "deactivated",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "active",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "active",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "active",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "active",
    },
    {
        name: "Akin Akinwale",
        email: "akinakinwale@gmail.com",
        phoneNumber: "+234 81697842222",
        dateAdded: "20 Dec, 2023",
        status: "active",
    },
]

export const status = (role: string) => {
    switch (role) {
        case "deactivated":
            return (
                <p className="text-[#8A1A02] text-sm bg-[#FFECE6] border-[#CC00004D] border-[0.5] p-2 w-fit rounded-full">
                    Deactivated
                </p>
            )
        case "active":
            return (
                <p className="text-[#028A02] text-sm bg-[#E6FFE6] border-[#00CC144D] border-[0.5] p-2 w-fit rounded-full">
                    Active
                </p>
            )
        case "suspend":
            return (
                <p className="text-[#595655] text-sm bg-[#F1F1F1] border-[#6C6C6C4D] border-[0.5] p-2 w-fit rounded-full">
                    Suspended
                </p>
            )
        default:
            return (
                <div className="flex">
                    <p>unknown role</p>
                </div>
            )
    }
}
