import { LoadingState } from "@components/index"
import {
    ActionIcon,
    Badge,
    Button,
    Stack,
    Switch,
    Text,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
    LuArchive,
    LuChevronDown,
    LuChevronUp,
    LuCopy,
    LuEye,
    LuEyeOff,
    LuPencil,
    LuPlus,
} from "react-icons/lu"
import {
    activatePackage,
    archivePackage,
    createPackage,
    deactivatePackage,
    duplicatePackage,
    fetchPackages,
    reorderPackages,
    updatePackage,
} from "@services/auth"
import { Package, PackageRequest } from "type/api/auth.types"
import PackageEditor from "./PackageEditor"

export interface PackagesManagerBodyProps {
    /** Set when a manager is managing a roster talent's packages; omitted
     * for self-service. */
    userId?: string
}

const MAX_PACKAGES = 30

function formatMoney(price: number, currency: string) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(price / 100)
}

// Mirrors PortfolioManagerBody's shape (list + editor panel + inline
// actions), extended with Package's four lifecycle actions beyond
// edit/delete: duplicate, activate/deactivate, archive. Reordering uses
// the same up/down ActionIcon pattern as Portfolio rather than drag-and-
// drop — an established interaction in this app already, not a new one.
const PackagesManagerBody = ({ userId }: PackagesManagerBodyProps) => {
    const queryClient = useQueryClient()
    const [showArchived, setShowArchived] = useState(false)
    const queryKey = ["packages", userId ?? "self", showArchived]
    const [editingPackage, setEditingPackage] = useState<Package | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const { data: response, isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchPackages(userId, showArchived),
        retry: 1,
    })
    const packages = response?.data || []
    const workingPackages = packages.filter((p) => !p.archivedAt)
    const archivedPackages = packages.filter((p) => p.archivedAt)

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: ["packages"] })

    const onError = (err: any) => {
        showNotification({
            title: "Error",
            message: err.response?.data?.message || err.message,
            color: "red",
        })
    }

    const { mutate: saveNew, isPending: isCreatingPackage } = useMutation({
        mutationFn: (data: PackageRequest) => createPackage(data, userId),
        onSuccess: () => {
            showNotification({
                title: "Added",
                message: "Package added",
                color: "green",
            })
            invalidate()
            setIsCreating(false)
        },
        onError,
    })

    const { mutate: saveEdit, isPending: isSavingEdit } = useMutation({
        mutationFn: ({
            packageId,
            data,
        }: {
            packageId: string
            data: PackageRequest
        }) => updatePackage(packageId, data, userId),
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "Package updated",
                color: "green",
            })
            invalidate()
            setEditingPackage(null)
        },
        onError,
    })

    const { mutate: duplicate } = useMutation({
        mutationFn: (packageId: string) => duplicatePackage(packageId, userId),
        onSuccess: () => {
            showNotification({
                title: "Duplicated",
                message: "A copy was added as inactive — review before activating it",
                color: "green",
            })
            invalidate()
        },
        onError,
    })

    const { mutate: toggleActive } = useMutation({
        mutationFn: ({ packageId, active }: { packageId: string; active: boolean }) =>
            active
                ? activatePackage(packageId, userId)
                : deactivatePackage(packageId, userId),
        onSuccess: invalidate,
        onError,
    })

    const { mutate: archive } = useMutation({
        mutationFn: (packageId: string) => archivePackage(packageId, userId),
        onSuccess: () => {
            showNotification({
                title: "Archived",
                message: "Package archived",
                color: "green",
            })
            invalidate()
        },
        onError,
    })

    const { mutate: reorder } = useMutation({
        mutationFn: (orderedPackageIds: string[]) =>
            reorderPackages(orderedPackageIds, userId),
        onSuccess: invalidate,
        onError,
    })

    const move = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction
        if (targetIndex < 0 || targetIndex >= workingPackages.length) return
        const reordered = [...workingPackages]
        ;[reordered[index], reordered[targetIndex]] = [
            reordered[targetIndex],
            reordered[index],
        ]
        reorder(reordered.map((p) => p._id))
    }

    if (isLoading) return <LoadingState />

    const renderRow = (pkg: Package, index: number, reorderable: boolean) => (
        <div
            key={pkg._id}
            className="border border-gray-100 rounded-2xl p-4 flex items-start justify-between gap-4"
        >
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <Text size="sm" fw={600} truncate>
                        {pkg.label}
                    </Text>
                    {!pkg.archivedAt && !pkg.active && (
                        <Badge color="gray" size="sm">
                            Inactive
                        </Badge>
                    )}
                    {pkg.archivedAt && (
                        <Badge color="gray" size="sm">
                            Archived
                        </Badge>
                    )}
                </div>
                <Text size="sm" c="dimmed" mt={2}>
                    {formatMoney(pkg.price, pkg.currency)} ·{" "}
                    {pkg.turnaroundDays}-day turnaround
                </Text>
            </div>
            <div className="flex items-center gap-1 flex-none">
                {reorderable && (
                    <>
                        <ActionIcon
                            variant="subtle"
                            aria-label="Move up"
                            disabled={index === 0}
                            onClick={() => move(index, -1)}
                        >
                            <LuChevronUp size={16} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            aria-label="Move down"
                            disabled={index === workingPackages.length - 1}
                            onClick={() => move(index, 1)}
                        >
                            <LuChevronDown size={16} />
                        </ActionIcon>
                    </>
                )}
                {!pkg.archivedAt && (
                    <>
                        <ActionIcon
                            variant="subtle"
                            aria-label="Edit"
                            onClick={() => setEditingPackage(pkg)}
                        >
                            <LuPencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            aria-label="Duplicate"
                            onClick={() => duplicate(pkg._id)}
                        >
                            <LuCopy size={16} />
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            aria-label={pkg.active ? "Deactivate" : "Activate"}
                            onClick={() =>
                                toggleActive({
                                    packageId: pkg._id,
                                    active: !pkg.active,
                                })
                            }
                        >
                            {pkg.active ? (
                                <LuEyeOff size={16} />
                            ) : (
                                <LuEye size={16} />
                            )}
                        </ActionIcon>
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Archive"
                            onClick={() => archive(pkg._id)}
                        >
                            <LuArchive size={16} />
                        </ActionIcon>
                    </>
                )}
            </div>
        </div>
    )

    return (
        <Stack gap="lg">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <Text size="lg" fw={600}>
                    Packages ({workingPackages.length}/{MAX_PACKAGES})
                </Text>
                <div className="flex items-center gap-4">
                    <Switch
                        label="Show archived"
                        checked={showArchived}
                        onChange={(e) => setShowArchived(e.currentTarget.checked)}
                    />
                    <Button
                        leftSection={<LuPlus size={16} />}
                        onClick={() => setIsCreating(true)}
                        disabled={workingPackages.length >= MAX_PACKAGES}
                    >
                        Add package
                    </Button>
                </div>
            </div>

            {workingPackages.length === 0 ? (
                <Text c="dimmed" size="sm">
                    No packages yet. Add one so buyers can book you directly
                    from your profile.
                </Text>
            ) : (
                <Stack gap="sm">
                    {workingPackages.map((pkg, index) =>
                        renderRow(pkg, index, true)
                    )}
                </Stack>
            )}

            {showArchived && archivedPackages.length > 0 && (
                <Stack gap="sm">
                    <Text size="sm" fw={600} c="dimmed">
                        Archived
                    </Text>
                    {archivedPackages.map((pkg, index) =>
                        renderRow(pkg, index, false)
                    )}
                </Stack>
            )}

            <PackageEditor
                opened={isCreating}
                onClose={() => setIsCreating(false)}
                isSubmitting={isCreatingPackage}
                onSubmit={(data) => saveNew(data)}
            />

            <PackageEditor
                opened={editingPackage !== null}
                onClose={() => setEditingPackage(null)}
                pkg={editingPackage || undefined}
                isSubmitting={isSavingEdit}
                onSubmit={(data) => {
                    if (editingPackage) {
                        saveEdit({ packageId: editingPackage._id, data })
                    }
                }}
            />
        </Stack>
    )
}

export default PackagesManagerBody
