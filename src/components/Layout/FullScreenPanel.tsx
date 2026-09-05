import { Drawer } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { ReactNode } from "react"

export interface FullScreenPanelProps {
    opened: boolean
    onClose: () => void
    title?: ReactNode
    children: ReactNode
    /** Desktop side-panel width. Ignored under the mobile breakpoint. */
    desktopWidth?: number
}

// Reusable wrapper: a right-hand side panel on desktop becomes a full-screen
// view (with a back control, via Mantine Drawer's built-in close button
// wired to read as "back" here) under the Mantine `sm` breakpoint (768px) —
// matches PRD §9 "side panels become full-screen views with a back
// control". Not wired into any feature yet; future PRs (Step 5/6) use this
// for e.g. the portfolio manager's item editor.
const FullScreenPanel = ({
    opened,
    onClose,
    title,
    children,
    desktopWidth = 480,
}: FullScreenPanelProps) => {
    const isMobile = useMediaQuery("(max-width: 767px)")

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={title}
            position={isMobile ? "bottom" : "right"}
            size={isMobile ? "100%" : desktopWidth}
            padding="md"
            radius={0}
            className="font-Montserrat"
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            {children}
        </Drawer>
    )
}

export default FullScreenPanel
