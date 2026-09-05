import { Button } from "@components/index"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { createProfile, createPortfolioItem, deletePortfolioItem } from "@services/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import { type ProfileResponse } from "../../../type/api/auth.types"

const PortfolioInformation = ({ data }: { data?: ProfileResponse["data"] }) => {
    const queryClient = useQueryClient()
    const initialized = useRef(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [bio, setBio] = useState("")
    const [instagram, setInstagram] = useState("")
    const [tiktok, setTiktok] = useState("")
    const [twitter, setTwitter] = useState("")
    const [youtube, setYoutube] = useState("")
    const [website, setWebsite] = useState("")

    useEffect(() => {
        if (data && !initialized.current) {
            setBio(data.bio || "")
            setInstagram(data.socialLinks?.instagram || "")
            setTiktok(data.socialLinks?.tiktok || "")
            setTwitter(data.socialLinks?.twitter || "")
            setYoutube(data.socialLinks?.youtube || "")
            setWebsite(data.socialLinks?.website || "")
            initialized.current = true
        }
    }, [data])

    const { isPending: isSaving, mutate: saveProfile } = useMutation({
        mutationFn: createProfile,
        onSuccess: ({ data }) => {
            showNotification({
                title: "Success",
                message: data.message,
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["profile"] })
                .finally(() => false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    // Migrated off the TEMP /profile/portfolio-media shim onto the real
    // PortfolioItem endpoints (Phase 1 Step 5) — see PHASE1_AUDIT.md and
    // this PR's description for the server-side shim now ready to remove.
    const { isPending: isUploading, mutate: uploadItem } = useMutation({
        mutationFn: (file: File) =>
            createPortfolioItem({ title: "Untitled" }, file),
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "Photo added to your portfolio",
                color: "green",
            })
            queryClient
                .invalidateQueries({ queryKey: ["profile"] })
                .finally(() => false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { mutate: removeItem } = useMutation({
        mutationFn: (itemId: string) => deletePortfolioItem(itemId),
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["profile"] })
                .finally(() => false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const handleSave = () => {
        saveProfile({
            bio,
            socialLinks: { instagram, tiktok, twitter, youtube, website },
        })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        uploadItem(file)
        e.target.value = ""
    }

    return (
        <div className="mt-8">
            <p className="font-medium text-2md sm:text-3md mb-4">
                Public Portfolio
            </p>
            <hr className="my-4" />

            <div className="mb-6">
                <p className="text-md font-semibold mb-2">Bio</p>
                <textarea
                    className="w-full border border-gray-100 rounded-2xl p-3 outline-none min-h-[100px]"
                    placeholder="Tell clients a bit about yourself..."
                    value={bio}
                    maxLength={1000}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-md font-semibold mb-1">Instagram</p>
                    <input
                        className="w-full border border-gray-100 rounded-[24px] h-12 px-3 outline-none"
                        placeholder="https://instagram.com/..."
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                    />
                </div>
                <div>
                    <p className="text-md font-semibold mb-1">TikTok</p>
                    <input
                        className="w-full border border-gray-100 rounded-[24px] h-12 px-3 outline-none"
                        placeholder="https://tiktok.com/@..."
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                    />
                </div>
                <div>
                    <p className="text-md font-semibold mb-1">Twitter / X</p>
                    <input
                        className="w-full border border-gray-100 rounded-[24px] h-12 px-3 outline-none"
                        placeholder="https://x.com/..."
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                    />
                </div>
                <div>
                    <p className="text-md font-semibold mb-1">YouTube</p>
                    <input
                        className="w-full border border-gray-100 rounded-[24px] h-12 px-3 outline-none"
                        placeholder="https://youtube.com/..."
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                    />
                </div>
                <div>
                    <p className="text-md font-semibold mb-1">Website</p>
                    <input
                        className="w-full border border-gray-100 rounded-[24px] h-12 px-3 outline-none"
                        placeholder="https://..."
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
            </div>

            <Button
                type="button"
                variant="primary"
                className="mb-8"
                disabled={isSaving}
                onClick={handleSave}
            >
                {isSaving ? "Saving..." : "Save Portfolio Details"}
            </Button>

            <p className="text-md font-semibold mb-2">Portfolio Photos</p>
            <div className="flex flex-wrap gap-3 mb-4">
                {(data?.portfolioItems || []).map((item) => (
                    <div key={item._id} className="relative w-24 h-24">
                        <img
                            src={item.media[0]?.thumbnailUrl || item.media[0]?.url}
                            alt={item.title || "Portfolio photo"}
                            className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            aria-label="Remove photo"
                            className="absolute -top-2 -right-2 bg-black-100 text-white rounded-full w-6 h-6 text-xs"
                            onClick={() => removeItem(item._id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <p className="text-xs text-[#00000066] mb-2">
                For captions, categories, and more control, use the new{" "}
                <a href="/portfolio" className="underline">
                    Portfolio manager
                </a>{" "}
                in Settings.
            </p>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileChange}
            />
            <Button
                type="button"
                variant="border"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
            >
                {isUploading ? "Uploading..." : "Add Photo"}
            </Button>
        </div>
    )
}

export default PortfolioInformation
