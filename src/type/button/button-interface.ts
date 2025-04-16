export interface buttonInterface
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | "primary"
        | "black"
        | "transparent"
        | "gray"
        | "yellow"
        | "red"
        | "border"
        | "clear"
        | "light-blue"
        | "green"
        | "white"
    size?: "small" | "normal"
    type?: "button" | "submit" | "reset"
    children?: React.ReactNode
    className?: string
    iconLeft?: JSX.Element
    iconRight?: JSX.Element
}
