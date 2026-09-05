import { Button, Select, Stack, TagsInput, TextInput } from "@mantine/core"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { updateProfileStep } from "@services/auth"
import { fetchCategories, fetchSkills } from "@services/taxonomy"
import { MyPageSectionProps } from "../sections"

// "About" section of My Page — category, city, skills, service areas.
const AboutStep = ({ data, userId, onSaved }: MyPageSectionProps) => {
    const queryClient = useQueryClient()
    const [primaryCategory, setPrimaryCategory] = useState(
        data.primaryCategory || ""
    )
    const [city, setCity] = useState(data.city || "")
    const [categories, setCategories] = useState<string[]>(
        data.categories || []
    )
    const [skills, setSkills] = useState<string[]>(data.skills || [])
    const [serviceAreas, setServiceAreas] = useState<string[]>(
        data.serviceAreas || []
    )

    const { data: categoryOptions } = useQuery({
        queryKey: ["taxonomy", "categories"],
        queryFn: fetchCategories,
    })
    const { data: skillOptions } = useQuery({
        queryKey: ["taxonomy", "skills"],
        queryFn: fetchSkills,
    })

    const { isPending, mutate: save } = useMutation({
        mutationFn: () =>
            updateProfileStep(
                { primaryCategory, city, categories, skills, serviceAreas },
                userId
            ),
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "About section updated",
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

    const categorySelectData = (categoryOptions?.data || []).map((c) => ({
        value: c.slug,
        label: c.label,
    }))
    const skillTagOptions = (skillOptions?.data || []).map((s) => s.label)

    return (
        <Stack gap="md" className="max-w-xl">
            <Select
                label="Primary category"
                placeholder="Select your main category"
                data={categorySelectData}
                value={primaryCategory}
                onChange={(value) => setPrimaryCategory(value || "")}
                searchable
            />
            <TagsInput
                label="Other categories"
                placeholder="Add another category"
                data={categorySelectData.map((c) => c.label)}
                value={categories}
                onChange={setCategories}
            />
            <TagsInput
                label="Skills"
                placeholder="Add a skill"
                data={skillTagOptions}
                value={skills}
                onChange={setSkills}
            />
            <TextInput
                label="City"
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
            />
            <TagsInput
                label="Service areas"
                placeholder="Add a city/region you also serve"
                value={serviceAreas}
                onChange={setServiceAreas}
            />
            <Button onClick={() => save()} loading={isPending} fullWidth>
                Save
            </Button>
        </Stack>
    )
}

export default AboutStep
