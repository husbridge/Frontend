import { useEffect, useRef } from "react"
import { NavLink, useParams } from "react-router-dom"
import { MY_PAGE_SECTIONS } from "../sections"

export interface SectionNavProps {
    /** "/my-page" (self) or "/talents/:id/my-page" (manager) — the base
     * path each section is appended to. */
    basePath: string
}

// Tab nav derived entirely from MY_PAGE_SECTIONS — adding a Phase 2
// section (Services, Packages) means adding one entry to that array, not
// touching this component.
const SectionNav = ({ basePath }: SectionNavProps) => {
    const { section } = useParams<{ section: string }>()
    const activeRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        // On mobile the row scrolls horizontally — without this, landing
        // directly on a section past the fold (e.g. Track record) leaves
        // its own tab invisible/cut off with no indication it's active.
        activeRef.current?.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
            block: "nearest",
        })
    }, [section])

    return (
        <div className="flex gap-1 overflow-x-auto border-b border-gray-100 mb-6">
            {MY_PAGE_SECTIONS.map((s) => (
                <NavLink
                    key={s.key}
                    ref={s.path === section ? activeRef : undefined}
                    to={`${basePath}/${s.path}`}
                    className={({ isActive }) =>
                        `px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            isActive
                                ? "border-black-100 text-black-100"
                                : "border-transparent text-[#00000066] hover:text-black-100"
                        }`
                    }
                >
                    {s.title}
                </NavLink>
            ))}
        </div>
    )
}

export default SectionNav
