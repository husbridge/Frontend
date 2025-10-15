import { Modal, Button } from "@mantine/core"
import { useBilling } from "@contexts/payments/billing"

interface PaymentInformationModalProps {
    opened: boolean
    setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const PaymentInformationModal = ({
    opened,
    setOpened,
}: PaymentInformationModalProps) => {
    const { proceedWithPayment } = useBilling()

    const handleContinue = () => {
        setOpened(false)
        proceedWithPayment()
    }

    const handleClose = () => {
        setOpened(false)
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title=""
            centered
            size="md"
            radius={20}
            withCloseButton={false}
            classNames={{
                body: "p-8 flex flex-col items-center",
                content: "font-Montserrat",
            }}
        >
            <div className="text-center">
                {/* Icon or illustration can be added here */}
                <div className="bg-green-100 mb-6 rounded-full flex items-center justify-center w-fit aspect-square mx-auto">
                    <span className="text-4xl">💰</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Enjoy Your Free Month - No Charges Yet!
                </h2>

                <p className="text-gray-600 text-md leading-relaxed mb-8 text-center">
                    We just need your card details to keep your account active
                    after your first free month. Don't worry - you won't be
                    charged until your trial is over.
                </p>

                <div className="flex gap-3 justify-center">
                    {/* <Button
                        variant="primary"
                        className="px-6 text-white-100  w-full rounded-[40px] mt-10"
                        type="submit"
                    >
                    </Button> */}
                    <Button
                        variant="primary"
                        onClick={handleClose}
                        className="px-6 text-white-100 hover:text-black-100 bg-black-100 rounded-[40px] mt-10 hover:bg-transparent transition-colors duration-300 border-black-100 border-2 border-transparent"
                        radius={8}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleContinue}
                        className="px-6 text-white-100 bg-black-100 rounded-[40px] mt-10 hover:bg-black-50 transition-colors duration-300"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default PaymentInformationModal
