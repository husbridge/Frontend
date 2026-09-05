import {
    ActionIcon,
    Button,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
} from "@mantine/core"
import { useState } from "react"
import { LuPlus, LuTrash2 } from "react-icons/lu"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfileStep } from "@services/auth"
import {
    AudienceBand,
    ProfileResponse,
    SocialAccount,
    SocialPlatform,
} from "type/api/auth.types"

export interface ReachStepProps {
    data: ProfileResponse["data"]
    userId?: string
    onSaved: () => void
}

const PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter / X" },
    { value: "youtube", label: "YouTube" },
    { value: "website", label: "Website" },
    { value: "other", label: "Other" },
]

const AUDIENCE_BAND_OPTIONS: { value: AudienceBand; label: string }[] = [
    { value: "", label: "Prefer not to say" },
    { value: "under_1k", label: "Under 1,000" },
    { value: "1k_10k", label: "1,000 – 10,000" },
    { value: "10k_50k", label: "10,000 – 50,000" },
    { value: "50k_100k", label: "50,000 – 100,000" },
    { value: "100k_500k", label: "100,000 – 500,000" },
    { value: "500k_plus", label: "500,000+" },
]

const emptyAccount = (): SocialAccount => ({
    platform: "instagram",
    handle: "",
    url: "",
    audienceBand: "",
})

const ReachStep = ({ data, userId, onSaved }: ReachStepProps) => {
    const queryClient = useQueryClient()
    const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(
        data.socialAccounts && data.socialAccounts.length > 0
            ? data.socialAccounts
            : [emptyAccount()]
    )

    const { isPending, mutate: save } = useMutation({
        mutationFn: () =>
            updateProfileStep(
                {
                    socialAccounts: socialAccounts.filter(
                        (a) => a.handle || a.url
                    ),
                },
                userId
            ),
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "Social accounts updated",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["profileSetup", userId ?? "self"] })
                .finally(() => onSaved())
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const updateAccount = (index: number, patch: Partial<SocialAccount>) => {
        setSocialAccounts((prev) =>
            prev.map((a, i) => (i === index ? { ...a, ...patch } : a))
        )
    }

    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Self-reported for now — verified audience figures come later.
            </Text>
            {socialAccounts.map((account, index) => (
                <Group key={index} align="flex-end" wrap="wrap">
                    <Select
                        label="Platform"
                        data={PLATFORM_OPTIONS}
                        value={account.platform}
                        onChange={(value) =>
                            updateAccount(index, {
                                platform: (value || "instagram") as SocialPlatform,
                            })
                        }
                        w={140}
                    />
                    <TextInput
                        label="Handle or URL"
                        value={account.handle || account.url || ""}
                        onChange={(e) =>
                            // Consolidated into one field on edit — clears
                            // any stale `url` from before so the two never
                            // disagree once touched.
                            updateAccount(index, {
                                handle: e.currentTarget.value,
                                url: "",
                            })
                        }
                        className="flex-1 min-w-[160px]"
                    />
                    <Select
                        label="Audience size"
                        data={AUDIENCE_BAND_OPTIONS}
                        value={account.audienceBand || ""}
                        onChange={(value) =>
                            updateAccount(index, {
                                audienceBand: (value || "") as AudienceBand,
                            })
                        }
                        w={170}
                    />
                    <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() =>
                            setSocialAccounts((prev) =>
                                prev.filter((_, i) => i !== index)
                            )
                        }
                        aria-label="Remove social account"
                    >
                        <LuTrash2 size={16} />
                    </ActionIcon>
                </Group>
            ))}
            <Button
                variant="outline"
                leftSection={<LuPlus size={14} />}
                onClick={() =>
                    setSocialAccounts((prev) => [...prev, emptyAccount()])
                }
            >
                Add another account
            </Button>
            <Button onClick={() => save()} loading={isPending} fullWidth>
                Save
            </Button>
        </Stack>
    )
}

export default ReachStep
