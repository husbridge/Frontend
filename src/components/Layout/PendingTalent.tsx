import { Badge, Tooltip } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { deleteTalent } from "@services/talents"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RxQuestionMarkCircled } from "react-icons/rx"
import { Data } from "type/api/talents.types"

export default function PendingTalent({ item }: { item: Data }) {
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: deleteTalent,
        mutationKey: ["delete-talent"],
        onMutate: async (talentId) => {
            await queryClient.cancelQueries({
                predicate: (query) => {
                    return (
                        Array.isArray(query.queryKey) &&
                        query.queryKey[0] === "talents"
                    )
                },
            })

            const previousTalents = queryClient.getQueryData(["talents"])

            queryClient.setQueryData(["talents"], (old) =>
                (old as [])?.filter((talent: any) => talent.id !== talentId)
            )

            return { previousTalents }
        },

        onSettled: (data) => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return (
                        Array.isArray(query.queryKey) &&
                        query.queryKey[0] === "talents"
                    )
                },
            })
            showNotification({
                title: "Success",
                message: data?.data.message,
                color: "green",
            })
        },
        onError: (err:any, _variables, context) => {
            queryClient.setQueryData(["talents"], context?.previousTalents)
             showNotification({
                 title: "Error",
                 message: err?.response?.data?.message || err.message,
                 color: "red",
             })
        },
    })
    return (
        <>
            {item.verificationTypeValue === "pending" && (
                <span className="inline-flex items-center gap-0.5">
                    <Badge>pending</Badge>
                    <Tooltip
                        className="inline-block"
                        label={
                            <div className="max-w-sm h-fit w-full text-wrap">
                                Management request has been sent. You're seeing
                                this badge because {item.firstName} is yet to
                                accept your request.
                            </div>
                        }
                        withArrow
                        position="bottom"
                        offset={5}
                        transitionProps={{
                            transition: "fade",
                            duration: 200,
                        }}
                    >
                        <button>
                            <RxQuestionMarkCircled
                                size="18px"
                                className="text-gray-400 hover:text-black-100 cursor-pointer"
                            />
                        </button>
                    </Tooltip>
                    <Badge
                        className="bg-red-600 cursor-pointer"
                        onClick={() => deleteMutation.mutate(item._id)}
                    >
                        Cancel Request
                    </Badge>
                </span>
            )}
        </>
    )
}
