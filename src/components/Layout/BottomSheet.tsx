import { Modal, ModalProps } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { ReactNode } from "react"

export interface BottomSheetProps
    extends Pick<ModalProps, "opened" | "onClose" | "title" | "size"> {
    children: ReactNode
}

// Reusable wrapper: a centered modal on desktop becomes a bottom-anchored
// sheet under the Mantine `sm` breakpoint (768px) — matches PRD §9 "Modals
// become bottom sheets under 768px". Not wired into any feature yet; future
// PRs (Step 5/6) use this for e.g. the public page's "Work with me" forms.
const BottomSheet = ({
    opened,
    onClose,
    title,
    size = "550px",
    children,
}: BottomSheetProps) => {
    const isMobile = useMediaQuery("(max-width: 767px)")

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={title}
            withCloseButton
            centered={!isMobile}
            fullScreen={false}
            size={isMobile ? "100%" : size}
            radius={isMobile ? 0 : 30}
            transitionProps={{
                transition: isMobile ? "slide-up" : "pop",
            }}
            styles={{
                inner: isMobile
                    ? { alignItems: "flex-end", padding: 0 }
                    : undefined,
                content: isMobile
                    ? {
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          maxHeight: "85vh",
                      }
                    : undefined,
            }}
            className="font-Montserrat"
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            {children}
        </Modal>
    )
}

export default BottomSheet
