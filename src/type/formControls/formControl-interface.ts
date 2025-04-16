// type OptionType = { [string]: any }

// type OptionsType = Array<OptionType>
export interface Option {
    label: string
    value: string
    icon: string
}
export interface formInterface
    extends React.InputHTMLAttributes<HTMLInputElement> {
    control:
        | "input"
        | "select"
        | "textarea"
        | "switch"
        | "checkbox"
        | "file"
        | "phoneNumber"
        | "date"
        | "otp"
        | "customselect"
    suffixIcon?: JSX.Element
    prefixIcon?: JSX.Element
    enablereinitialize?: boolean
    label?: string | JSX.Element
    error?: boolean
    name: string
    onClick?: (value: unknown) => void
    validate?: (value: unknown) => string | unknown
    classNames?: {
        input?: string
        mainRoot?: string
        wrapperRoot?: string
        wrapper?: string
    }
    currentDate?: Date
    labelClassName?: string
    placeholder?: string
    labelPosition?: string
    showTimeSelect?: boolean
    showTimeSelectOnly?: boolean
    dateFormat?: string
    timeCaption?: string
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void
    isSearchable?: boolean
    isLoading?: boolean
    isClearable?:boolean
    options?: Option[]
}

export interface ISelectProps {
    name: string
    className?: string
    children?: React.ReactNode
    value?: string | number | readonly string[] | undefined
    suffixIcon?: JSX.Element
    label?: string
    defaultValue?: string | number | readonly string[] | undefined
    classNames?: {
        input?: string
        mainRoot?: string
        wrapperRoot?: string
        wrapper?: string
    }
    labelClassName?: string
    onChange?: (event: React.FormEvent<HTMLSelectElement>) => void
    isSearchable?: boolean
    isLoading?: boolean
    options: Option[]
}
