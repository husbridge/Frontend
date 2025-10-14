import { Modal } from "@mantine/core"
import { useState } from "react"
import Close from "@assets/icons/close.svg"

export interface SupportModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    onSubmit: (values: {
        email: string
        subject: string
        fullName: string
        message: string
        attachment?: File
    }) => void
    isSubmitting?: boolean
}

const SupportModal = ({
    opened,
    setOpened,
    onSubmit,
    isSubmitting,
}: SupportModalProps) => {
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [fullName, setFullName] = useState("")
    const [errors, setErrors] = useState<{
        email?: string
        subject?: string
        fullName?: string
        message?: string
    }>({})

    const validate = () => {
        const nextErrors: {
            email?: string
            subject?: string
            fullName?: string
            message?: string
        } = {}
        if (!email) nextErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            nextErrors.email = "Enter a valid email"
        if (!subject) nextErrors.subject = "Subject is required"
        if (!fullName) nextErrors.fullName = "Full name is required"
        if (!message) nextErrors.message = "Message is required"
        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const clearForm = () => {
        setEmail("")
        setSubject("")
        setMessage("")
        setFullName("")
        setErrors({})
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        onSubmit({ email, subject, fullName, message })
        clearForm()
    }

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{ body: "p-4 py-10" }}
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            <div className="sm:px-6">
                <div className="flex mb-6 items-center">
                    <p className="text-[20px] font-semibold flex-1 text-center">
                        Contact Support
                    </p>
                    <img
                        src={Close}
                        alt=""
                        className="flex-none cursor-pointer"
                        onClick={() => setOpened(false)}
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-black-100 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full rounded-xl bg-white-100/10 px-4 py-3 outline-none border border-black-30"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-black-100 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-xl bg-white-100/10 px-4 py-3 outline-none border border-black-30"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                        />
                        {errors.fullName && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-black-100 mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-xl bg-white-100/10 px-4 py-3 outline-none border border-black-30"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Brief subject"
                        />
                        {errors.subject && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.subject}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-black-100 mb-1">
                            Message
                        </label>
                        <textarea
                            rows={5}
                            className="w-full rounded-xl bg-white-100/10 px-4 py-3 outline-none border border-black-30"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your issue"
                        />
                        {errors.message && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.message}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => setOpened(false)}
                            className="!text-md text-black-60 mt-2 w-28 border border-black-30 rounded-full py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="!text-md mt-2 w-28 rounded-full text-black-100 bg-yellow-100 py-2 disabled:opacity-60"
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default SupportModal
