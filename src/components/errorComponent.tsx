import { Button } from "."

const ErrorComponent = () => {
    return (
        <div className="h-screen flex items-center justify-center flex-col p-4">
            <h2 className="text-lg font-bold text-center">Oops, An error occurred!</h2>

            <p className="my-4 text-center">
                It's not you but us and we are working to get it resolved
            </p>
            <Button
                variant="primary"
                type="button"
                onClick={() => {
                    window.location.reload()
                }}
            >
                Try again?
            </Button>
        </div>
    )
}

export default ErrorComponent
