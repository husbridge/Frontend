import { RingProgress, Text, Stack, Group } from "@mantine/core"

export interface CompletenessWidgetProps {
    completenessScore: number
    nextBestAction: string
}

// Renders the server's own completenessScore + nextBestAction verbatim —
// no client-side re-derivation of "what's missing" (see ProfileDto in
// husridge-server, Phase 1 Step 5).
const CompletenessWidget = ({
    completenessScore,
    nextBestAction,
}: CompletenessWidgetProps) => {
    const color =
        completenessScore >= 80
            ? "green"
            : completenessScore >= 40
              ? "yellow"
              : "red"

    return (
        <Group
            className="border border-gray-100 rounded-2xl p-4 sm:p-5"
            wrap="nowrap"
            align="center"
        >
            <RingProgress
                size={72}
                thickness={7}
                roundCaps
                sections={[{ value: completenessScore, color }]}
                label={
                    <Text ta="center" size="sm" fw={600}>
                        {completenessScore}%
                    </Text>
                }
            />
            <Stack gap={2}>
                <Text size="sm" fw={600}>
                    Profile completeness
                </Text>
                {nextBestAction && (
                    <Text size="sm" c="dimmed">
                        {nextBestAction}
                    </Text>
                )}
            </Stack>
        </Group>
    )
}

export default CompletenessWidget
