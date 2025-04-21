import { Button, FormControls, InquirySentModal } from "@components/index"
import useTimer from "@hooks/auth/useTimer"
import { showNotification } from "@mantine/notifications"
import LeftBackground from "@pages/auth/components/leftBackground"
import { sendPortalOTP, verifyPortalOTP } from "@services/auth"
import { createInquiry } from "@services/inquiry"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmEmailAddressSchema } from "@utils/validationSchema"
import { Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { MdArrowBack } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { type Error } from "type/api"
import { CreateInquiryRequest } from "type/api/inquiry.types"

const ValidateClientEmail = () => {
    const { handleTimerStart, time, minutes, seconds } = useTimer()

    const [openModal, setOpenModal] = useState(false)
    const navigate = useNavigate()

    const _inquiry = sessionStorage.getItem("inquiry") || ""

    if (!_inquiry) {
        navigate("/")
    }

    let inquiry: CreateInquiryRequest | null = null

    try {
        inquiry = JSON.parse(_inquiry)
    } catch (error) {
        navigate("/", { replace: true, relative: "path" })
    }

    const queryClient = useQueryClient()
    const onCreateInquiry = useMutation({
        mutationFn: createInquiry,
        onSuccess: () => {
            queryClient
                .invalidateQueries({ queryKey: ["inquiries"] })
                .finally(() => false)
            setOpenModal(true)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message:
                    err.message || "Something went wrong, please try again!",
                color: "red",
            })
        },
    })

    const { isPending, mutate } = useMutation({
        mutationFn: verifyPortalOTP,
        onSuccess: () => {
            inquiry && onCreateInquiry.mutate(inquiry)
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const { isPending: isLoading, mutate: mutateResend } = useMutation({
        mutationFn: sendPortalOTP,
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "OTP sent successfully",
                color: "green",
            })
        },
        onError: (err: Error) => {
            showNotification({
                title: "Error",
                message: err.response?.data?.message || err.message,
                color: "red",
            })
        },
    })

    const handleResend = () => {
        mutateResend({
            email: inquiry?.emailAddress as string,
            name: inquiry?.fullName as string,
        })
        handleTimerStart()
    }
    useEffect(() => {
        handleTimerStart()
    }, [])

    return (
        <div className="flex ">
            <InquirySentModal opened={openModal} setOpened={setOpenModal} />
            <div className="md:block hidden w-[30%]">
                <LeftBackground />
            </div>

            <div className="bg-white-100 sm:p-20 md:pt-32  p-6 md:w-[70%] w-full">
                <MdArrowBack
                    size={28}
                    className="mb-10 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h3 className="font-semibold text-[24px] sm:text-[28px] md:text-2lg !leading-10">
                    Verify your email address <br /> to confirm your{" "}
                    {inquiry?.inquiryType} request
                </h3>

                <Formik
                    initialValues={{ code: "" }}
                    validationSchema={confirmEmailAddressSchema}
                    onSubmit={(values) => {
                        mutate({
                            code: values.code,
                            email: inquiry?.emailAddress as string,
                        })
                    }}
                >
                    {() => (
                        <Form className="py-4 mt-4">
                            <div className="mb-6">
                                <FormControls
                                    label="We have sent a 6-digit confirmation OTP to the email address  you provided in the inquiry."
                                    control="otp"
                                    name="code"
                                    placeholder="enter your new password"
                                    classNames={{
                                        mainRoot: " h-12  border-black-20 p",
                                        input: "text-black-100 text-[14px]",
                                    }}
                                    labelClassName="text-[#000000B2]"
                                />
                            </div>

                            <Button
                                variant="primary"
                                className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                                type="submit"
                                disabled={isPending}
                            >
                                Confirm code
                            </Button>
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-base text-[#475569]">
                    Didn't receive any code?{" "}
                    {time <= 0 ? (
                        <button
                            onClick={() => handleResend()}
                            className="inline-flex hover:!text-black"
                        >
                            {isLoading ? "Sending..." : "Resend"}
                        </button>
                    ) : (
                        <>
                            <span className="text-[#47556978] pr-2">
                                Retry in {`${minutes}:${seconds}`}
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

export default ValidateClientEmail
