import { Modal } from "@mantine/core"
import { Button } from "@components/index"

export interface AccountCreatedModalProps {
    opened: boolean
    handleNavigate:()=>void
    //setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountCreatedModal = ({
    opened,
    handleNavigate
    //setOpened,
}: AccountCreatedModalProps) => {
    
    return (
        <Modal
            opened={opened}
            withCloseButton={false}
            onClose={() => {
                //setOpened(false)
                handleNavigate()
            }}
            size="500px"
            centered
            radius={30}
            closeOnClickOutside={false}
            className="font-Montserrat"
            classNames={{
                body: "p-4 py-10",
            }}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <div className="flex flex-col items-center justify-center p-4 ">
                <svg
                    width="101"
                    height="100"
                    viewBox="0 0 101 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="0.5"
                        width="100"
                        height="100"
                        rx="50"
                        fill="#FEEEBE"
                    />
                    <path
                        d="M50 11.25C28.6487 11.25 11.25 28.6487 11.25 50C11.25 71.3512 28.6487 88.75 50 88.75C71.3512 88.75 88.75 71.3512 88.75 50C88.75 28.6487 71.3512 11.25 50 11.25ZM68.5225 41.0875L46.5513 63.0588C46.0087 63.6012 45.2725 63.9113 44.4975 63.9113C43.7225 63.9113 42.9862 63.6012 42.4438 63.0588L31.4775 52.0925C30.3537 50.9688 30.3537 49.1087 31.4775 47.985C32.6012 46.8612 34.4612 46.8612 35.585 47.985L44.4975 56.8975L64.415 36.98C65.5387 35.8563 67.3988 35.8563 68.5225 36.98C69.6463 38.1038 69.6463 39.925 68.5225 41.0875Z"
                        fill="#FFC107"
                    />
                </svg>

                <br />

                <h1 className="font-semibold text-[22px] sm:text-lg mb-4 text-center">
                    Account Created
                </h1>
                <p className="font-medium text-base text-center mb-8">
                    Your have successfully created an account. Click Proceed to
                    complete your registration process.
                </p>

                <Button
                    variant="primary"
                    className="  w-full"
                    onClick={handleNavigate}
                >
                    Proceed
                </Button>
            </div>
        </Modal>
    )
}

export default AccountCreatedModal
