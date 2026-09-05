import { BottomSheet, LoadingState } from "@components/index"
import { Alert, Button, Stack, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { LuChevronRight } from "react-icons/lu"
import {
    fetchProfileFor,
    publishProfile,
    unpublishProfile,
} from "@services/auth"
import CompletenessWidget from "@components/ProfileSetup/CompletenessWidget"
import MissingFieldsChecklist from "@components/ProfileSetup/MissingFieldsChecklist"
import IdentityStep from "./IdentityStep"
import ClassificationStep from "./ClassificationStep"
import ReachStep from "./ReachStep"
import TrackRecordStep from "./TrackRecordStep"

export interface ProfileSetupBodyProps {
    /** Set when a manager is editing a roster talent's profile; omitted for
     * self-service (talent/agency editing their own profile). */
    userId?: string
}

type StepKey = "identity" | "classification" | "reach" | "trackRecord"

const STEPS: { key: StepKey; title: string; description: string }[] = [
    {
        key: "identity",
        title: "Identity",
        description: "Photo, name, title, short bio",
    },
    {
        key: "classification",
        title: "Classification",
        description: "Category, city, skills, service areas",
    },
    {
        key: "reach",
        title: "Reach",
        description: "Social accounts and audience",
    },
    {
        key: "trackRecord",
        title: "Track record",
        description: "Years of experience, brands worked with",
    },
]

const ProfileSetupBody = ({ userId }: ProfileSetupBodyProps) => {
    const queryClient = useQueryClient()
    const [activeStep, setActiveStep] = useState<StepKey | null>(null)

    const queryKey = ["profileSetup", userId ?? "self"]
    const { data: response, isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchProfileFor(userId),
    })

    const data = response?.data
    const isPublishable = data?.userType === "talent" || data?.userType === "agency"

    const { isPending: isPublishing, mutate: doPublish } = useMutation({
        mutationFn: () => publishProfile(userId),
        onSuccess: ({ data: result }) => {
            if (result.hasError) {
                showNotification({
                    title: "Can't publish yet",
                    message: result.message,
                    color: "red",
                })
            } else {
                showNotification({
                    title: "Published",
                    message: "Your profile is now live",
                    color: "green",
                })
            }
            queryClient.invalidateQueries({ queryKey }).finally(() => false)
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { isPending: isUnpublishing, mutate: doUnpublish } = useMutation({
        mutationFn: () => unpublishProfile(userId),
        onSuccess: () => {
            showNotification({
                title: "Unpublished",
                message: "Your profile is no longer public",
                color: "green",
            })
            queryClient.invalidateQueries({ queryKey }).finally(() => false)
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    if (isLoading || !data) {
        return <LoadingState />
    }

    const activeStepConfig = STEPS.find((s) => s.key === activeStep)

    return (
        <Stack gap="lg" className="max-w-2xl">
            {isPublishable && (
                <CompletenessWidget
                    completenessScore={data.completenessScore || 0}
                    nextBestAction={data.nextBestAction || ""}
                />
            )}

            {isPublishable && (data.missingFields?.length || 0) > 0 && (
                <MissingFieldsChecklist missingFields={data.missingFields!} />
            )}

            {isPublishable && (
                <Alert
                    color={data.isPublished ? "green" : "gray"}
                    title={data.isPublished ? "Published" : "Not published"}
                >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <Text size="sm">
                            {data.isPublished
                                ? "Your Magic Link page is live for buyers to see."
                                : "Complete the steps below, then publish when you're ready."}
                        </Text>
                        {data.isPublished ? (
                            <Button
                                size="xs"
                                variant="outline"
                                color="gray"
                                loading={isUnpublishing}
                                onClick={() => doUnpublish()}
                            >
                                Unpublish
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                loading={isPublishing}
                                onClick={() => doPublish()}
                            >
                                Publish
                            </Button>
                        )}
                    </div>
                </Alert>
            )}

            <Stack gap="sm">
                {STEPS.map((step) => (
                    <button
                        key={step.key}
                        type="button"
                        className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveStep(step.key)}
                    >
                        <div>
                            <Text size="sm" fw={600}>
                                {step.title}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {step.description}
                            </Text>
                        </div>
                        <LuChevronRight size={18} />
                    </button>
                ))}
            </Stack>

            <BottomSheet
                opened={activeStep !== null}
                onClose={() => setActiveStep(null)}
                title={activeStepConfig?.title}
            >
                {activeStep === "identity" && (
                    <IdentityStep
                        data={data}
                        userId={userId}
                        onSaved={() => setActiveStep(null)}
                    />
                )}
                {activeStep === "classification" && (
                    <ClassificationStep
                        data={data}
                        userId={userId}
                        onSaved={() => setActiveStep(null)}
                    />
                )}
                {activeStep === "reach" && (
                    <ReachStep
                        data={data}
                        userId={userId}
                        onSaved={() => setActiveStep(null)}
                    />
                )}
                {activeStep === "trackRecord" && (
                    <TrackRecordStep
                        data={data}
                        userId={userId}
                        onSaved={() => setActiveStep(null)}
                    />
                )}
            </BottomSheet>
        </Stack>
    )
}

export default ProfileSetupBody
