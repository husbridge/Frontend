import { LoadingState } from "@components/index"
import { ActionIcon, Badge, Button, SimpleGrid, Stack, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { LuChevronDown, LuChevronUp, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu"
import {
    deletePortfolioItem,
    fetchPortfolioItems,
    reorderPortfolioItems,
    updatePortfolioItem,
} from "@services/auth"
import { PortfolioItem, PortfolioItemRequest } from "type/api/auth.types"
import PortfolioItemEditor from "./PortfolioItemEditor"
import UploadQueueList from "./UploadQueueList"
import { useUploadQueue } from "../useUploadQueue"

export interface PortfolioManagerBodyProps {
    /** Set when a manager is managing a roster talent's portfolio; omitted
     * for self-service. */
    userId?: string
}

const PortfolioManagerBody = ({ userId }: PortfolioManagerBodyProps) => {
    const queryClient = useQueryClient()
    const queryKey = ["portfolioItems", userId ?? "self"]
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    const { data: response, isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchPortfolioItems(userId),
    })
    const items = response?.data || []

    const { queue, enqueue, dismiss } = useUploadQueue(userId)

    const { mutate: saveEdit, isPending: isSavingEdit } = useMutation({
        mutationFn: ({
            itemId,
            data,
        }: {
            itemId: string
            data: PortfolioItemRequest
        }) => updatePortfolioItem(itemId, data, userId),
        onSuccess: () => {
            showNotification({
                title: "Saved",
                message: "Portfolio item updated",
                color: "green",
            })
            queryClient.invalidateQueries({ queryKey }).finally(() => false)
            setEditingItem(null)
        },
        onError: (err: any) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { mutate: removeItem } = useMutation({
        mutationFn: (itemId: string) => deletePortfolioItem(itemId, userId),
        onSuccess: () => {
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

    const { mutate: reorder } = useMutation({
        mutationFn: (orderedItemIds: string[]) =>
            reorderPortfolioItems(orderedItemIds, userId),
        onSuccess: () => {
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

    const move = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction
        if (targetIndex < 0 || targetIndex >= items.length) return
        const reordered = [...items]
        ;[reordered[index], reordered[targetIndex]] = [
            reordered[targetIndex],
            reordered[index],
        ]
        reorder(reordered.map((i) => i._id))
    }

    if (isLoading) return <LoadingState />

    return (
        <Stack gap="lg" className="max-w-4xl">
            <div className="flex items-center justify-between">
                <Text size="lg" fw={600}>
                    Portfolio ({items.length}/30)
                </Text>
                <Button
                    leftSection={<LuPlus size={16} />}
                    onClick={() => setIsCreating(true)}
                    disabled={items.length >= 30}
                >
                    Add item
                </Button>
            </div>

            <UploadQueueList queue={queue} onDismiss={dismiss} />

            {items.length === 0 && queue.length === 0 ? (
                <Text c="dimmed" size="sm">
                    No portfolio items yet. Add your first one to start
                    building completeness.
                </Text>
            ) : (
                <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
                    {items.map((item, index) => (
                        <div
                            key={item._id}
                            className="border border-gray-100 rounded-2xl overflow-hidden"
                        >
                            <div className="aspect-square bg-gray-50 relative">
                                {item.media[0] && (
                                    <img
                                        src={
                                            item.media[0].thumbnailUrl ||
                                            item.media[0].url
                                        }
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                {item.visibility === "hidden" && (
                                    <Badge
                                        color="gray"
                                        size="sm"
                                        className="absolute top-2 left-2"
                                    >
                                        Hidden
                                    </Badge>
                                )}
                            </div>
                            <div className="p-3">
                                <Text size="sm" fw={600} truncate>
                                    {item.title}
                                </Text>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-1">
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
                                            disabled={index === items.length - 1}
                                            onClick={() => move(index, 1)}
                                        >
                                            <LuChevronDown size={16} />
                                        </ActionIcon>
                                    </div>
                                    <div className="flex gap-1">
                                        <ActionIcon
                                            variant="subtle"
                                            aria-label="Edit"
                                            onClick={() => setEditingItem(item)}
                                        >
                                            <LuPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            aria-label="Delete"
                                            onClick={() => removeItem(item._id)}
                                        >
                                            <LuTrash2 size={16} />
                                        </ActionIcon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </SimpleGrid>
            )}

            <PortfolioItemEditor
                opened={isCreating}
                onClose={() => setIsCreating(false)}
                isSubmitting={false}
                onSubmit={(data, file) => {
                    enqueue(data, file)
                    setIsCreating(false)
                }}
            />

            <PortfolioItemEditor
                opened={editingItem !== null}
                onClose={() => setEditingItem(null)}
                item={editingItem || undefined}
                isSubmitting={isSavingEdit}
                onSubmit={(data) => {
                    if (editingItem) {
                        saveEdit({ itemId: editingItem._id, data })
                    }
                }}
            />
        </Stack>
    )
}

export default PortfolioManagerBody
