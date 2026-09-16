import { FullScreenPanel } from "@components/index"
import {
    Button,
    NumberInput,
    Select,
    Stack,
    TagsInput,
    Textarea,
    TextInput,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { fetchCategories } from "@services/taxonomy"
import { Package, PackageRequest } from "type/api/auth.types"
import { fromMinorUnits, toMinorUnits } from "@utils/money"

export interface PackageEditorProps {
    opened: boolean
    onClose: () => void
    /** Present when editing an existing package; absent when creating one. */
    pkg?: Package
    onSubmit: (data: PackageRequest) => void
    isSubmitting: boolean
}

// Only NGN today — matches the platform-wide precedent (BillingAccount/
// Invoice) of NGN-only, not a real multi-currency picker yet.
const CURRENCY_OPTIONS = ["NGN"]

// Mirrors PortfolioItemEditor: FullScreenPanel (right panel on desktop,
// full-screen with a back control under the mobile breakpoint, PRD §9),
// same Mantine field set/spacing as the rest of My Page's forms. price is
// entered/displayed in the major currency unit (e.g. naira) for a human
// to type normally, converted to/from the integer minor-unit wire value
// (kobo) here at the edges — PackageRequest/Package themselves never see
// a float.
const PackageEditor = ({
    opened,
    onClose,
    pkg,
    onSubmit,
    isSubmitting,
}: PackageEditorProps) => {
    const [category, setCategory] = useState(pkg?.category || "")
    const [label, setLabel] = useState(pkg?.label || "")
    const [description, setDescription] = useState(pkg?.description || "")
    const [priceMajorUnit, setPriceMajorUnit] = useState<number | "">(
        pkg ? fromMinorUnits(pkg.price) : ""
    )
    const [currency, setCurrency] = useState(pkg?.currency || "NGN")
    const [deliverables, setDeliverables] = useState<string[]>(
        pkg?.deliverables || []
    )
    const [turnaroundDays, setTurnaroundDays] = useState<number | "">(
        pkg?.turnaroundDays ?? ""
    )
    const [revisions, setRevisions] = useState<number | "">(
        pkg?.revisions ?? 0
    )
    const [terms, setTerms] = useState(pkg?.terms || "")

    const { data: categoryOptions } = useQuery({
        queryKey: ["taxonomy", "categories"],
        queryFn: fetchCategories,
    })
    const categorySelectData = (categoryOptions?.data || []).map((c) => ({
        value: c.slug,
        label: c.label,
    }))

    const canSubmit =
        label.trim() &&
        category &&
        priceMajorUnit !== "" &&
        priceMajorUnit >= 0 &&
        turnaroundDays !== "" &&
        turnaroundDays >= 0

    const handleSubmit = () => {
        if (!canSubmit) return
        onSubmit({
            category,
            label,
            description,
            price: toMinorUnits(Number(priceMajorUnit)),
            currency,
            deliverables,
            turnaroundDays: Number(turnaroundDays),
            revisions: revisions === "" ? 0 : Number(revisions),
            terms,
        })
    }

    return (
        <FullScreenPanel
            opened={opened}
            onClose={onClose}
            title={pkg ? "Edit package" : "Add package"}
        >
            <Stack gap="md">
                <TextInput
                    label="Package name"
                    required
                    maxLength={80}
                    value={label}
                    onChange={(e) => setLabel(e.currentTarget.value)}
                />
                <Select
                    label="Category"
                    required
                    placeholder="Select a category"
                    data={categorySelectData}
                    value={category}
                    onChange={(value) => setCategory(value || "")}
                    searchable
                />
                <Textarea
                    label="Description (optional)"
                    maxLength={600}
                    minRows={3}
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Price"
                        required
                        min={0}
                        decimalScale={2}
                        value={priceMajorUnit}
                        onChange={(value) =>
                            setPriceMajorUnit(
                                value === "" ? "" : Number(value)
                            )
                        }
                    />
                    <Select
                        label="Currency"
                        data={CURRENCY_OPTIONS}
                        value={currency}
                        onChange={(value) => setCurrency(value || "NGN")}
                        allowDeselect={false}
                    />
                </div>
                <TagsInput
                    label="Deliverables (optional)"
                    placeholder="Add what's included, one at a time"
                    value={deliverables}
                    onChange={setDeliverables}
                />
                <div className="grid grid-cols-2 gap-4">
                    <NumberInput
                        label="Turnaround (days)"
                        required
                        min={0}
                        value={turnaroundDays}
                        onChange={(value) =>
                            setTurnaroundDays(
                                value === "" ? "" : Number(value)
                            )
                        }
                    />
                    <NumberInput
                        label="Revisions included"
                        min={0}
                        value={revisions}
                        onChange={(value) =>
                            setRevisions(value === "" ? "" : Number(value))
                        }
                    />
                </div>
                <Textarea
                    label="Terms (optional)"
                    maxLength={2000}
                    minRows={3}
                    value={terms}
                    onChange={(e) => setTerms(e.currentTarget.value)}
                />
                <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!canSubmit}
                    fullWidth
                >
                    {pkg ? "Save changes" : "Add package"}
                </Button>
            </Stack>
        </FullScreenPanel>
    )
}

export default PackageEditor
