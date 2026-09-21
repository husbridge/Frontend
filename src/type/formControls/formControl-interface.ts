// type OptionType = { [string]: any }

// type OptionsType = Array<OptionType>
export interface Option {
    label: string
    value: string
    icon: string
}

// Additive, optional per-part class overrides for control="customselect"
// (react-select under the hood). See CustomSelect in formControls.tsx for
// why this exists and why it's additive rather than a replacement.
export interface SelectClassNameOverrides {
    control?: string
    container?: string
    valueContainer?: string
    menu?: string
    menuList?: string
    option?: string
    singleValue?: string
    input?: string
    placeholder?: string
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
    selectClassNames?: SelectClassNameOverrides
    // react-datepicker's own prop (control="date"), forwarded through
    // DatePickerInput's `...rest` untouched — see darkCalendarClassName in
    // Contact/darkTheme.ts for why this needs a page-scoped CSS file rather
    // than a classNames-style override.
    calendarClassName?: string
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
