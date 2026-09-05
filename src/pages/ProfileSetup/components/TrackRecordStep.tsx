import {
    ActionIcon,
    Button,
    Group,
    NumberInput,
    Stack,
    TextInput,
} from "@mantine/core"
import { useState } from "react"
import { LuPlus, LuTrash2 } from "react-icons/lu"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfileStep } from "@services/auth"
import { Brand, ProfileResponse } from "type/api/auth.types"

export interface TrackRecordStepProps {
    data: ProfileResponse["data"]
    userId?: string
    onSaved: () => void
}

const TrackRecordStep = ({ data, userId, onSaved }: TrackRecordStepProps) => {
    const queryClient = useQueryClient()
    const [yearsExperience, setYearsExperience] = useState<number | "">(
        data.yearsExperience ?? ""
    )
    const [brands, setBrands] = useState<Brand[]>(data.brands || [])

    const { isPending, mutate: save } = useMutation({
        mutationFn: () =>
            updateProfileStep(
                {
                    yearsExperience:
                        yearsExperience === "" ? undefined : yearsExperience,
                    brands: brands.filter((b) => b.name.trim()),
                },
                userId
            ),
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "Track record updated",
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

    return (
        <Stack gap="md">
            <NumberInput
                label="Years of experience"
                min={0}
                max={80}
                value={yearsExperience}
                onChange={(value) =>
                    setYearsExperience(typeof value === "number" ? value : "")
                }
            />
            {brands.map((brand, index) => (
                <Group key={index} align="flex-end" wrap="wrap">
                    <TextInput
                        label="Brand name"
                        value={brand.name}
                        onChange={(e) =>
                            setBrands((prev) =>
                                prev.map((b, i) =>
                                    i === index
                                        ? { ...b, name: e.currentTarget.value }
                                        : b
                                )
                            )
                        }
                        className="flex-1 min-w-[160px]"
                    />
                    <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() =>
                            setBrands((prev) =>
                                prev.filter((_, i) => i !== index)
                            )
                        }
                        aria-label="Remove brand"
                    >
                        <LuTrash2 size={16} />
                    </ActionIcon>
                </Group>
            ))}
            <Button
                variant="outline"
                leftSection={<LuPlus size={14} />}
                onClick={() =>
                    setBrands((prev) => [...prev, { name: "" }])
                }
            >
                Add a brand you've worked with
            </Button>
            <Button onClick={() => save()} loading={isPending} fullWidth>
                Save
            </Button>
        </Stack>
    )
}

export default TrackRecordStep
