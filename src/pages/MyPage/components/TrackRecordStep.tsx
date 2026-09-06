import { Button, Input } from "@components/index"
import { useState } from "react"
import { LuPlus, LuTrash2 } from "react-icons/lu"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfileStep } from "@services/auth"
import { Brand } from "type/api/auth.types"
import { MyPageSectionProps } from "../sections"

// "Track record" section of My Page — years of experience, brands worked
// with. Neither field is required to publish (not in husridge-server's
// getPublishRequirementChecks) — both optional.
//
// Markup matches the app's established form pattern (see e.g. the Talent
// information form in components/Modals/Talent/components/talentInformation.tsx)
// rather than Mantine's Stack/TextInput/Button: per-field `mb-6` wrapper
// divs, a plain label, the app's own Input/Button components. This step
// doesn't use Formik (it never did — no validation rules apply to either
// field), so it wires Input directly with the same controlled
// value/onChange state as before rather than introducing Formik just to
// reach FormControls; the data read/write behavior is unchanged.
const TrackRecordStep = ({ data, userId, onSaved }: MyPageSectionProps) => {
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

    return (
        <div>
            <div className="mb-6">
                <label className="text-[#000] text-[14px]">
                    Years of experience (optional)
                </label>
                <Input
                    type="number"
                    min={0}
                    max={80}
                    value={yearsExperience}
                    onChange={(e) =>
                        setYearsExperience(
                            e.target.value === "" ? "" : Number(e.target.value)
                        )
                    }
                    className="border border-black-20 px-2 mt-1 max-w-xs"
                    inputClassName="text-black-100 text-[14px]"
                />
            </div>

            {brands.map((brand, index) => (
                <div key={index} className="mb-6 flex items-end gap-3">
                    <div className="flex-1">
                        <label className="text-[#000] text-[14px]">
                            Brand name (optional)
                        </label>
                        <Input
                            value={brand.name}
                            onChange={(e) =>
                                setBrands((prev) =>
                                    prev.map((b, i) =>
                                        i === index
                                            ? { ...b, name: e.target.value }
                                            : b
                                    )
                                )
                            }
                            className="border border-black-20 px-2 mt-1"
                            inputClassName="text-black-100 text-[14px]"
                        />
                    </div>
                    {/* No existing standalone delete-icon-button pattern
                        found elsewhere in the app to match (only a
                        dormant, commented-out one in Settings using the
                        same LuTrash2 icon at 24px/#00000099 — reused that
                        exact sizing/color here rather than Mantine's
                        ActionIcon defaults). Flagged for a visual check. */}
                    <button
                        type="button"
                        aria-label="Remove brand"
                        onClick={() =>
                            setBrands((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="mb-3 flex-none"
                    >
                        <LuTrash2 size="24px" color="#00000099" />
                    </button>
                </div>
            ))}

            <div className="flex gap-6">
                <Button
                    variant="border"
                    iconLeft={<LuPlus size={16} />}
                    onClick={() => setBrands((prev) => [...prev, { name: "" }])}
                    type="button"
                >
                    Add a brand you've worked with
                </Button>
            </div>

            <Button
                variant="primary"
                size="normal"
                className="mt-10"
                type="button"
                disabled={isPending}
                onClick={() => save()}
            >
                {isPending ? "Saving..." : "Save"}
            </Button>
        </div>
    )
}

export default TrackRecordStep
