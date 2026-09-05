import { Layout, LoadingState } from "@components/index"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import { fetchProfileFor, publishProfile, unpublishProfile } from "@services/auth"
import { DEFAULT_MY_PAGE_SECTION, MY_PAGE_SECTIONS } from "./sections"
import SectionNav from "./components/SectionNav"
import PreviewAndPublishBar from "./components/PreviewAndPublishBar"

// The single editor for a talent/agency's public page — talents reach
// their own via the "My Page" nav item; managers/agencies reach a roster
// talent's via Talent -> (select a talent) -> their page. Same component,
// same sections, either way — husridge-server's canEditTalentProfile is
// the real permission gate, this just forwards whichever id is present.
// See PHASE1_AUDIT.md Step 5.
const MyPage = () => {
    const { id: userId, section } = useParams<{ id?: string; section: string }>()
    const queryClient = useQueryClient()

    const basePath = userId ? `/talents/${userId}/my-page` : "/my-page"
    const queryKey = ["myPage", userId ?? "self"]

    const { data: response, isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchProfileFor(userId),
        // Capped after a production incident where a 500 on this endpoint
        // family caused an indefinite retry storm — see Dashboard's
        // ["profile"] query.
        retry: 1,
    })

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

    if (isLoading || !response?.data) {
        return (
            <Layout>
                <LoadingState />
            </Layout>
        )
    }

    const data = response.data
    const activeSection = MY_PAGE_SECTIONS.find((s) => s.path === section)

    if (!activeSection) {
        return <Navigate to={`${basePath}/${DEFAULT_MY_PAGE_SECTION}`} replace />
    }

    const ActiveComponent = activeSection.Component

    return (
        <Layout>
            <div className="pt-24 px-4 sm:px-8 pb-12 max-w-4xl">
                <PreviewAndPublishBar
                    completenessScore={data.completenessScore || 0}
                    nextBestAction={data.nextBestAction || ""}
                    missingFields={data.missingFields || []}
                    isPublished={data.isPublished || false}
                    isPublishing={isPublishing}
                    isUnpublishing={isUnpublishing}
                    onPublish={() => doPublish()}
                    onUnpublish={() => doUnpublish()}
                />

                <SectionNav basePath={basePath} />

                <ActiveComponent
                    data={data}
                    userId={userId}
                    onSaved={() => undefined}
                />
            </div>
        </Layout>
    )
}

export default MyPage
