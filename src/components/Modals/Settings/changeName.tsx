import { Modal } from "@mantine/core"
import Close from "@assets/icons/close.svg"
import { Input, Button } from "@components/index"
import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { createProfile, changePassword } from "@services/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showNotification } from "@mantine/notifications"
import { type Error } from "../../../type/api/index"
import useAuth from "@hooks/auth/useAuth"

export interface ChangeNameModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
    name: string
    defaultValue: string
}

const ChangeName = ({
    opened,
    setOpened,
    name,
    defaultValue,
}: ChangeNameModalProps) => {
    const [input, setInput] = useState(defaultValue?.split(" ")[0] || "")
    const [secondInput, setSecondInput] = useState(
        defaultValue?.split(" ")[1] || ""
    )
    const { state, dispatch } = useAuth()
    const queryClient = useQueryClient()
    useEffect(() => {
        if (state.user?.userType === "talent") {
            setInput(defaultValue?.split(" ")[0])
            setSecondInput(defaultValue?.split(" ")[1])
        } else {
            setInput(defaultValue)
        }
    }, [defaultValue])

    const { isPending, mutate } = useMutation({
        mutationFn: createProfile,
        onSuccess: ({ data }) => {
            console.log('change name data', data)
            if (state.user) {
                const user = {
                    accessToken: state.user.accessToken,
                    refreshToken: state.user.refreshToken,
                    profilePhotoUrl: state.user.profilePhotoUrl,
                    fullName: data.data.fullName || "",
                    firstName: data.data.firstName,
                    lastName: data.data.lastName,
                    registrationStage: data.data?.registrationStage || "",
                    isVerified: state.user.isVerified,
                    permissions: state.user.permissions,
                    userType: state.user.userType,
                    uniqueUsername: state.user.uniqueUsername,
                    userStatus: state.user.userStatus,
                    hasAgency: state.user.hasAgency
                }
                localStorage.setItem("user", JSON.stringify(user)),
                    state.user &&
                        dispatch({
                            type: "UPDATE_USER_DATA",
                            payload: user,
                        })
            }
            queryClient
                .invalidateQueries({
                    queryKey: ["profile"],
                })
                .finally(() => false)
            showNotification({
                title: "Success",
                message: data.message,
                color: "green",
            });
            setOpened(false);
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })
    const { isPending: isLoading, mutate: mutateChange } = useMutation({
        mutationFn: changePassword,
        onSuccess: ({ data }) => {
            showNotification({
                title: "Success",
                message: data.message,
                color: "green",
            });
            setInput("")
            setSecondInput("")
            setOpened(false)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        if (name == "Name") {
            if (state.user?.userType === "talent") {
                mutate({
                    firstName: input,
                    lastName: secondInput,
                })
            } else {
                mutate({
                    fullName: input,
                })
            }
        }
        if (name === "Mobile Number") {
            mutate({
                phoneNumber: input,
            })
        }
        if (name === "Address") {
            mutate({
                address: input,
            })
        }
        if (name === "Password") {
            mutateChange({ oldPassword: input, newPassword: secondInput })
        }
        
    }

    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => {
                setOpened(false)
                setInput("")
                setSecondInput("")
            }}
            size="550px"
            centered
            radius={30}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <div className="flex mb-6 items-center">
                <p className="text-[20px] font-semibold flex-1 text-center">
                    Change {name}
                </p>
                <img
                    src={Close}
                    alt=""
                    className="flex-none cursor-pointer"
                    onClick={() => setOpened(false)}
                />
            </div>
            <form  onSubmit={handleSubmit}>
                {(name === "Password" ||
                    (state.user?.userType == "talent" && name === "Name")) && (
                    <label className="mb-2">
                        {name === "Password" 
                            ? "Old password"
                            : "First Name"}
                    </label>
                )}
                <Input
                    name={name}
                    className="px-2 border-black-20 border"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInput(e.target.value)
                    }
                    value={input}
                    required
                />

                {(name === "Password" ||
                    (state.user?.userType == "talent" && name === "Name")) && (
                    <div className="mt-2">
                        <label className="pb-2">
                            {name === "Password" 
                                ? "New password"
                                : "Last Name"}
                        </label>
                        <Input
                            name={name}
                            className="px-2 border-black-20 border"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setSecondInput(e.target.value)
                            }
                            value={secondInput}
                            required
                        />
                    </div>
                )}
                <Button variant="primary" className="w-full mt-4" disabled={isPending||isLoading}>
                    {isPending || isLoading ? "Saving" : "Save"}
                </Button>
            </form>
        </Modal>
    )
}
export default ChangeName
