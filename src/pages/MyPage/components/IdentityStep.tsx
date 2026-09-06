import {
    Button,
    FileButton,
    Group,
    Stack,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    generateUsername,
    setUsername,
    updateProfileStep,
    uploadProfileImage,
} from "@services/auth"
import { MyPageSectionProps } from "../sections"

// "Identity" section of My Page — the single profile photo (avatar), name,
// title, short + long bio, and the Magic Link username. This is the ONLY
// place the profile photo is edited; it is not part of the Portfolio
// section's media grid.
//
// Fields marked * are required to publish (matches husridge-server's
// getPublishRequirementChecks exactly — see the missing-fields checklist
// above this step) — everything else here is optional.
const IdentityStep = ({ data, userId, onSaved }: MyPageSectionProps) => {
    const queryClient = useQueryClient()
    const [firstName, setFirstName] = useState(data.firstName || "")
    const [lastName, setLastName] = useState(data.lastName || "")
    const [professionalTitle, setProfessionalTitle] = useState(
        data.professionalTitle || ""
    )
    const [shortBio, setShortBio] = useState(data.shortBio || "")
    const [longBio, setLongBio] = useState(data.longBio || "")
    const [username, setUsernameValue] = useState(data.uniqueUsername || "")

    const { isPending, mutate: save } = useMutation({
        mutationFn: () =>
            updateProfileStep(
                { firstName, lastName, professionalTitle, shortBio, longBio },
                userId
            ),
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "Identity details updated",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["myPage", userId ?? "self"] })
                .finally(() => onSaved?.())
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { isPending: isUploadingPhoto, mutate: uploadPhoto } = useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData()
            formData.append("profile-picture", file)
            return uploadProfileImage(formData)
        },
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "Profile photo updated",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["myPage", userId ?? "self"] })
                .finally(() => false)
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { isPending: isGeneratingUsername, mutate: doGenerateUsername } =
        useMutation({
            mutationFn: () => generateUsername(),
            onSuccess: (result) => {
                if (result.hasError || !result.data) {
                    showNotification({
                        title: "Can't generate a username yet",
                        message: result.message,
                        color: "red",
                    })
                    return
                }
                setUsernameValue(result.data)
                queryClient
                    .invalidateQueries({ queryKey: ["myPage", "self"] })
                    .finally(() => false)
            },
            onError: (err: any) => {
                showNotification({
                    title: "Error",
                    message: err.response?.data?.message || err.message,
                    color: "red",
                })
            },
        })

    const { isPending: isSavingUsername, mutate: saveUsername } = useMutation({
        mutationFn: (value: string) => setUsername(value),
        onSuccess: ({ data: result }) => {
            if (result.hasError) {
                showNotification({
                    title: "Couldn't set that username",
                    message: result.message,
                    color: "red",
                })
                return
            }
            showNotification({
                title: "Saved",
                message: "Magic Link username updated",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["myPage", "self"] })
                .finally(() => false)
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    return (
        <Stack gap="md">
            <div className="flex items-center gap-4">
                <img
                    src={data.profileUrl || "/placeholder-avatar.png"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border border-gray-100"
                />
                {/* husridge-server has no manager-scoped profile-picture route
                    (PATCH /profile/profile-picture is self-only) — hide this
                    control rather than call an endpoint that would silently
                    update the manager's OWN photo instead of the talent's. */}
                {!userId && (
                    <FileButton
                        onChange={(file) => file && uploadPhoto(file)}
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                    >
                        {(props) => (
                            <Button
                                {...props}
                                variant="outline"
                                size="xs"
                                loading={isUploadingPhoto}
                            >
                                Change photo *
                            </Button>
                        )}
                    </FileButton>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                    label="First name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.currentTarget.value)}
                />
                <TextInput
                    label="Last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.currentTarget.value)}
                />
            </div>

            <TextInput
                label="Professional title"
                required
                placeholder="e.g. Portrait Photographer"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.currentTarget.value)}
            />

            {/* Self-only: husridge-server's username routes have no
                :userId-suffixed manager variant. */}
            {!userId && (
                <div>
                    <Text size="sm" fw={500} mb={4}>
                        Magic Link username <span className="text-red-100">*</span>
                    </Text>
                    <Group align="flex-start" wrap="wrap">
                        <TextInput
                            placeholder="e.g. jane-doe"
                            value={username}
                            onChange={(e) => setUsernameValue(e.currentTarget.value)}
                            className="flex-1 min-w-[200px]"
                        />
                        {!username && (
                            <Button
                                variant="outline"
                                loading={isGeneratingUsername}
                                onClick={() => doGenerateUsername()}
                            >
                                Generate
                            </Button>
                        )}
                        <Button
                            loading={isSavingUsername}
                            disabled={!username.trim()}
                            onClick={() => saveUsername(username.trim())}
                        >
                            Save username
                        </Button>
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                        This becomes your Magic Link page's URL — husridge.com/t/
                        {username || "your-username"}
                    </Text>
                </div>
            )}

            <Textarea
                label="Short bio"
                required
                placeholder="One or two sentences buyers see first"
                minRows={3}
                maxLength={280}
                value={shortBio}
                onChange={(e) => setShortBio(e.currentTarget.value)}
            />
            <Textarea
                label="Long bio (optional)"
                placeholder="The fuller story — background, experience, what you're known for"
                minRows={5}
                maxLength={2000}
                value={longBio}
                onChange={(e) => setLongBio(e.currentTarget.value)}
            />
            <Button onClick={() => save()} loading={isPending} fullWidth>
                Save
            </Button>
        </Stack>
    )
}

export default IdentityStep
