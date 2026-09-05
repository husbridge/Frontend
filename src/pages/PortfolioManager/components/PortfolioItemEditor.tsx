import { FullScreenPanel } from "@components/index"
import {
    Button,
    FileButton,
    Select,
    Stack,
    Textarea,
    TextInput,
} from "@mantine/core"
import { useState } from "react"
import { PortfolioItem, PortfolioItemRequest } from "type/api/auth.types"

export interface PortfolioItemEditorProps {
    opened: boolean
    onClose: () => void
    /** Present when editing an existing item; absent when creating a new one. */
    item?: PortfolioItem
    /** Called with the form fields + selected file (null for an edit that
     * doesn't change the image, or when using an embed URL instead). */
    onSubmit: (data: PortfolioItemRequest, file: File | null) => void
    isSubmitting: boolean
}

const CATEGORY_OPTIONS = [
    "Wedding",
    "Portrait",
    "Fashion",
    "Event",
    "Commercial",
    "Music video",
    "Documentary",
]

// Reuses FullScreenPanel (introduced in Phase 1 Step 4, first wired up
// here) — a right-hand panel on desktop, full-screen with a back control
// on mobile, per PRD §9.
const PortfolioItemEditor = ({
    opened,
    onClose,
    item,
    onSubmit,
    isSubmitting,
}: PortfolioItemEditorProps) => {
    const [title, setTitle] = useState(item?.title || "")
    const [description, setDescription] = useState(item?.description || "")
    const [role, setRole] = useState(item?.role || "")
    const [clientName, setClientName] = useState(item?.clientName || "")
    const [category, setCategory] = useState(item?.category || "")
    const [date, setDate] = useState(item?.date || "")
    const [visibility, setVisibility] = useState<"public" | "hidden">(
        item?.visibility || "public"
    )
    const [embedUrl, setEmbedUrl] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = () => {
        onSubmit(
            {
                title,
                description,
                role,
                clientName,
                category,
                date,
                visibility,
                ...(embedUrl
                    ? { embedUrl, embedProvider: "youtube" as const }
                    : {}),
            },
            file
        )
    }

    return (
        <FullScreenPanel
            opened={opened}
            onClose={onClose}
            title={item ? "Edit portfolio item" : "Add portfolio item"}
        >
            <Stack gap="md">
                {!item && (
                    <Stack gap={4}>
                        <FileButton
                            onChange={setFile}
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                        >
                            {(props) => (
                                <Button {...props} variant="outline">
                                    {file ? file.name : "Choose an image"}
                                </Button>
                            )}
                        </FileButton>
                        <TextInput
                            label="Or paste a video URL instead (YouTube/Instagram/TikTok)"
                            placeholder="https://youtube.com/watch?v=..."
                            value={embedUrl}
                            onChange={(e) => setEmbedUrl(e.currentTarget.value)}
                            disabled={!!file}
                        />
                    </Stack>
                )}
                <TextInput
                    label="Title"
                    required
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <Textarea
                    label="Description"
                    maxLength={600}
                    minRows={3}
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                />
                <TextInput
                    label="Your role"
                    placeholder="e.g. Photographer, Director"
                    value={role}
                    onChange={(e) => setRole(e.currentTarget.value)}
                />
                <TextInput
                    label="Client"
                    maxLength={80}
                    value={clientName}
                    onChange={(e) => setClientName(e.currentTarget.value)}
                />
                <Select
                    label="Category"
                    data={CATEGORY_OPTIONS}
                    value={category}
                    onChange={(value) => setCategory(value || "")}
                    searchable
                />
                <TextInput
                    label="Date"
                    placeholder="2026-03"
                    value={date}
                    onChange={(e) => setDate(e.currentTarget.value)}
                />
                <Select
                    label="Visibility"
                    data={[
                        { value: "public", label: "Public — visible on your page" },
                        { value: "hidden", label: "Hidden — kept in your manager only" },
                    ]}
                    value={visibility}
                    onChange={(value) =>
                        setVisibility((value as "public" | "hidden") || "public")
                    }
                    allowDeselect={false}
                />
                <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!title.trim() || (!item && !file && !embedUrl)}
                    fullWidth
                >
                    {item ? "Save changes" : "Add to portfolio"}
                </Button>
            </Stack>
        </FullScreenPanel>
    )
}

export default PortfolioItemEditor
