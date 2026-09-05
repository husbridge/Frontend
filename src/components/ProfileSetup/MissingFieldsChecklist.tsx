import { List, Text, ThemeIcon } from "@mantine/core"
import { LuCircleAlert } from "react-icons/lu"
import { MissingFieldItem } from "type/api/auth.types"

export interface MissingFieldsChecklistProps {
    missingFields: MissingFieldItem[]
}

// Renders the server's own missing-field list verbatim (label text as-is,
// no client-side mapping of field keys to copy) — see ProfileDto in
// husridge-server, Phase 1 Step 5 review.
const MissingFieldsChecklist = ({
    missingFields,
}: MissingFieldsChecklistProps) => {
    if (missingFields.length === 0) return null

    return (
        <div className="border border-red-100 rounded-2xl p-4 sm:p-5">
            <Text size="sm" fw={600} mb={8}>
                Missing before you can publish
            </Text>
            <List
                spacing={6}
                size="sm"
                icon={
                    <ThemeIcon color="red" size={20} radius="xl">
                        <LuCircleAlert size={12} />
                    </ThemeIcon>
                }
            >
                {missingFields.map((field) => (
                    <List.Item key={field.key}>{field.label}</List.Item>
                ))}
            </List>
        </div>
    )
}

export default MissingFieldsChecklist
