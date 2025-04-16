import DashboardIcon from "../assets/dashboard"
import CalendarIcon from "../assets/calendar"
import TeamIcon from "../assets/team"
import MessagingIcon from "../assets/messaging"
import HelpIcon from "../assets/help"
import InquiryIcon from "../assets/inquiry"
import SettingsIcon from "../assets/settings"
import TalentIcon from "../assets/talent"

export const routes = [
    { name: "Dashboard", Icon: DashboardIcon, link: "/dashboard" },
    {
        name: "Talents",
        Icon: TalentIcon,
        link: "/talents",
    },
    {
        name: "Calendar management",
        Icon: CalendarIcon,
        link: "/calendar",
    },
    {
        name: "Inquiry management",
        Icon: InquiryIcon,
        link: "/inquiry-management",
    },
    { name: "Messaging", Icon: MessagingIcon, link: "/messaging" },

    {
        name: "Team",
        Icon: TeamIcon,
        link: "/team",
    },
    { name: "Settings", Icon: SettingsIcon, link: "/settings" },
    { name: "Help & Support", Icon: HelpIcon, link: "/help&support" },
]
