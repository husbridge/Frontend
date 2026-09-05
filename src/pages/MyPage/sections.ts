import { ComponentType } from "react"
import IdentityStep from "./components/IdentityStep"
import AboutStep from "./components/AboutStep"
import PortfolioManagerBody from "@pages/PortfolioManager/components/PortfolioManagerBody"
import ReachStep from "./components/ReachStep"
import TrackRecordStep from "./components/TrackRecordStep"
import { ProfileResponse } from "type/api/auth.types"

export interface MyPageSectionProps {
    data: ProfileResponse["data"]
    userId?: string
    /** Only steps backed by a single small form call this — the Portfolio
     * section (a full management surface, not a form) doesn't. */
    onSaved?: () => void
}

// Single source of truth for My Page's sections — both the tab nav and
// the router derive from this array, so adding a section (Phase 2:
// Services, Packages) means adding one entry here, not a new hand-written
// route block. `path` is the URL segment under /my-page/:section (and
// /talents/:id/my-page/:section for a manager).
export interface MyPageSection {
    key: string
    path: string
    title: string
    description: string
    Component: ComponentType<MyPageSectionProps>
}

export const MY_PAGE_SECTIONS: MyPageSection[] = [
    {
        key: "identity",
        path: "identity",
        title: "Identity",
        description: "Photo, name, title, bio",
        Component: IdentityStep,
    },
    {
        key: "about",
        path: "about",
        title: "About",
        description: "Category, city, skills, service areas",
        Component: AboutStep,
    },
    {
        key: "portfolio",
        path: "portfolio",
        title: "Portfolio",
        description: "Photos, videos, reorder",
        Component: PortfolioManagerBody,
    },
    {
        key: "reach",
        path: "reach",
        title: "Reach",
        description: "Social accounts and links, audience",
        Component: ReachStep,
    },
    {
        key: "track-record",
        path: "track-record",
        title: "Track record",
        description: "Years of experience, brands worked with",
        Component: TrackRecordStep,
    },
]

export const DEFAULT_MY_PAGE_SECTION = MY_PAGE_SECTIONS[0].path
