import { Alert, Button, Text } from "@mantine/core"
import CompletenessWidget from "@components/ProfileSetup/CompletenessWidget"
import MissingFieldsChecklist from "@components/ProfileSetup/MissingFieldsChecklist"
import { MissingFieldItem } from "type/api/auth.types"

export interface PreviewAndPublishBarProps {
    completenessScore: number
    nextBestAction: string
    missingFields: MissingFieldItem[]
    isPublished: boolean
    isPublishing: boolean
    isUnpublishing: boolean
    onPublish: () => void
    onUnpublish: () => void
}

// Persistent across every My Page section (not just one) — completeness
// score, next-best-action, missing-fields list, and the publish/unpublish
// action, all rendered verbatim from the server. See PHASE1_AUDIT.md.
const PreviewAndPublishBar = ({
    completenessScore,
    nextBestAction,
    missingFields,
    isPublished,
    isPublishing,
    isUnpublishing,
    onPublish,
    onUnpublish,
}: PreviewAndPublishBarProps) => {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <CompletenessWidget
                completenessScore={completenessScore}
                nextBestAction={nextBestAction}
            />

            {missingFields.length > 0 && (
                <MissingFieldsChecklist missingFields={missingFields} />
            )}

            <Alert
                color={isPublished ? "green" : "gray"}
                title={isPublished ? "Published" : "Not published"}
            >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Text size="sm">
                        {isPublished
                            ? "Your Magic Link page is live for buyers to see."
                            : "Complete your sections below, then publish when you're ready."}
                    </Text>
                    {isPublished ? (
                        <Button
                            size="xs"
                            variant="outline"
                            color="gray"
                            loading={isUnpublishing}
                            onClick={onUnpublish}
                        >
                            Unpublish
                        </Button>
                    ) : (
                        <Button size="xs" loading={isPublishing} onClick={onPublish}>
                            Publish
                        </Button>
                    )}
                </div>
            </Alert>
        </div>
    )
}

export default PreviewAndPublishBar
