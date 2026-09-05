import { Button, FileButton, Stack, Textarea, TextInput } from "@mantine/core"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfileStep, uploadProfileImage } from "@services/auth"
import { MyPageSectionProps } from "../sections"

// "Identity" section of My Page — the single profile photo (avatar), name,
// title, short + long bio. This is the ONLY place the profile photo is
// edited; it is not part of the Portfolio section's media grid.
const IdentityStep = ({ data, userId, onSaved }: MyPageSectionProps) => {
    const queryClient = useQueryClient()
    const [firstName, setFirstName] = useState(data.firstName || "")
    const [lastName, setLastName] = useState(data.lastName || "")
    const [professionalTitle, setProfessionalTitle] = useState(
        data.professionalTitle || ""
    )
    const [shortBio, setShortBio] = useState(data.shortBio || "")
    const [longBio, setLongBio] = useState(data.longBio || "")

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

    return (
        <Stack gap="md" className="max-w-xl">
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
                                Change photo
                            </Button>
                        )}
                    </FileButton>
                )}
            </div>
            <TextInput
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
            />
            <TextInput
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
            />
            <TextInput
                label="Professional title"
                placeholder="e.g. Portrait Photographer"
                value={professionalTitle}
                onChange={(e) => setProfessionalTitle(e.currentTarget.value)}
            />
            <Textarea
                label="Short bio"
                placeholder="One or two sentences buyers see first"
                minRows={3}
                maxLength={280}
                value={shortBio}
                onChange={(e) => setShortBio(e.currentTarget.value)}
            />
            <Textarea
                label="Long bio"
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
