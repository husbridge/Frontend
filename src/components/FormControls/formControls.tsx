/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, useField, FieldProps } from "formik"
import { Switch } from "@mantine/core"
import {
    ISelectProps,
    formInterface,
} from "../../type/formControls/formControl-interface"
import Input from "../Core/Input/input"
import styles from "./select.module.scss"
import { Checkbox } from ".."
import { useState, useRef } from "react"
//import PhoneInput from "react-phone-number-input"
import { RiArrowDropDownLine } from "react-icons/ri"
import "react-phone-number-input/style.css"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import OtpInput from "react-otp-input"
import Select from "react-select"

function InputProp(props: formInterface) {
    const {
        suffixIcon,
        prefixIcon,
        classNames,
        name,
        type,
        //enablereinitialize,
        onClick,
        disabled,
        className,
        label,
        labelClassName,
        placeholder,
        onChange,
        ...rest
    } = props

    return (
        <Field name={name}>
            {({ field, meta, form }: FieldProps<string>) => (
                <div
                    className={`flex flex-col w-full ${classNames?.wrapper} ${
                        form.touched[name as string] &&
                        form.errors[name as string]
                            ? "border-red-100"
                            : ""
                    } ${className}`}
                >
                    {label && (
                        <label
                            htmlFor={name}
                            className={`label text-black-100 text-[14px] ${labelClassName}`}
                        >
                            {label}
                        </label>
                    )}

                    <Input
                        {...field}
                        {...rest}
                        prefixIcon={prefixIcon}
                        suffixIcon={suffixIcon}
                        onClick={onClick}
                        className={`  flex items-center  text-[12px]   outline-none w-full mt-1 ${
                            classNames?.mainRoot
                                ? classNames?.mainRoot
                                : "rounded-[10px]"
                        } ${disabled ? "bg-black-30 cursor-not-allowed" : ""} ${
                            form.touched[name as string] &&
                            form.errors[name as string] &&
                            "border-red-100"
                        }`}
                        inputClassName={`${classNames?.input}`}
                        type={type}
                        placeholder={placeholder}
                        onChange={(e) => {
                            form.setFieldValue(name, e.target.value)
                            onChange && onChange(e)
                        }}
                        disabled={disabled}
                    />
                    {meta.touched && meta.error && (
                        <div className="text-red-100 my-2 text-md">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}
// function PhoneNumberInput(props: any) {
//     const {
//         suffixIcon,
//         prefixIcon,
//         classNames,
//         name,
//         type,
//         //enablereinitialize,
//         onClick,
//         disabled,
//         className,
//         label,
//         labelClassName,
//         placeholder,
//         ...rest
//     } = props

//     return (
//         <Field name={name}>
//             {({
//                 meta,
//                 form: { handleChange, touched, errors },
//             }: FieldProps<string>) => (
//                 <div
//                     className={`flex flex-col w-full ${classNames?.wrapper} ${
//                         touched[name as string] && errors[name as string]
//                             ? "border-red-100"
//                             : ""
//                     } ${className}`}
//                 >
//                     {label && (
//                         <label
//                             htmlFor={name}
//                             className={`label text-[#25384F] font-semibold text-[16px] ${labelClassName}`}
//                         >
//                             {label}
//                         </label>
//                     )}

//                     <PhoneInput
//                         {...rest}
//                         value={meta.value}
//                         onChange={handleChange(name)}
//                         countryCallingCodeEditable={false}
//                         international
//                         defaultCountry="NG"
//                         className={`${
//                             meta.touched && meta.error
//                                 ? "border-red-100"
//                                 : "border-gray-100"
//                         } border px-2 md:px-4 rounded-[14px] h-14 border-gray-100 bg-transparent border-2`}
//                     />
//                     {meta.touched && meta.error && (
//                         <div className="text-red-100 my-2 text-3md ">
//                             {meta.error}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </Field>
//     )
// }
function DatePickerInput(props: any) {
    const {
        suffixIcon,
        prefixIcon,
        classNames,
        name,
        type,
        onClick,
        disabled,
        className,
        label,
        labelClassName,
        placeholder,
        onChange,
        currentDate,

        ...rest
    } = props
    const [date, setDate] = useState<Date>(currentDate)
    return (
        <Field name={name}>
            {({
                meta,
                form: { setFieldValue, touched, errors },
            }: FieldProps<string>) => (
                <div
                    className={`flex flex-col w-full ${classNames?.wrapper} ${
                        touched[name as string] && errors[name as string]
                            ? "border-red-100"
                            : ""
                    } ${className}`}
                >
                    {label && (
                        <label
                            htmlFor={name}
                            className={`label text-[#25384F] text-[14px] ${labelClassName}`}
                        >
                            {label}
                        </label>
                    )}
                    <DatePicker
                        {...rest}
                        selected={date}
                        onChange={(date: Date) => {
                            setDate(date)
                            setFieldValue(name, date)
                            onChange && onChange(date)
                        }}
                        className={`w-full text-[14px] outline-none w-full mt-1 rounded-3xl h-12 ${
                            classNames?.mainRoot
                                ? classNames?.mainRoot
                                : "rounded-3xl"
                        }`}
                        placeholderText={placeholder}
                    />

                    {meta.touched && meta.error && (
                        <div className="text-red-100 my-2 text-md ">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}
function OTPInput(props: any) {
    const {
        classNames,
        name,
        type,
        //enablereinitialize,
        onClick,
        disabled,
        className,
        label,
        labelClassName,
        placeholder,
        ...rest
    } = props

    return (
        <Field name={name}>
            {({
                meta,
                form: { handleChange, touched, errors },
            }: FieldProps<string>) => (
                <div
                    className={`flex flex-col w-full ${classNames?.wrapper} ${
                        touched[name as string] && errors[name as string]
                            ? "border-red-100"
                            : ""
                    } ${className}`}
                >
                    {label && (
                        <label
                            htmlFor={name}
                            className={`label text-[#25384F] font-normal text-[16px] ${labelClassName}  sm:w-[80%] md:w-[80%] lg:w-[50%]`}
                        >
                            {label}
                        </label>
                    )}

                    <OtpInput
                        {...rest}
                        value={meta.value}
                        onChange={handleChange(name)}
                        numInputs={6}
                        //renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={`h-12 w-full ${
                            meta.touched && meta.error
                                ? "border-red-100 "
                                : "border-black-500 "
                        } border    mr-2 code  rounded-[16px]`}
                        containerStyle="flex w-full text-center mt-2"
                    />
                    {meta.touched && meta.error && (
                        <div className="text-red-100 my-2 text-md ">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}
function FileInputProp(props: formInterface) {
    const {
        suffixIcon,
        prefixIcon,
        classNames,
        name,
        type,
        //enablereinitialize,
        onClick,
        disabled,
        className,
        label,
        labelClassName,
        placeholder,
        ...rest
    } = props

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [pictureName, setPictureName] = useState("")

    // const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0]

    //     if (file) {
    //         setPictureName(file.name)
    //         setFieldValue("image", file)
    //     }
    // }
    return (
        <Field name={name}>
            {({ meta, form }: FieldProps<File>) => (
                <div
                    className={`flex flex-col w-full ${classNames?.wrapper} ${
                        form.touched[name as string] &&
                        form.errors[name as string]
                            ? "border-red-100"
                            : ""
                    } ${className}`}
                >
                    {label && (
                        <label
                            htmlFor={name}
                            className={`label text-black-100 text-[14px] ${labelClassName}`}
                        >
                            {label}
                        </label>
                    )}
                    <input
                        {...rest}
                        data-testid="file-upload"
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0]

                            if (file) {
                                setPictureName(file.name)
                                form.setFieldValue(name, file)
                            }
                        }}
                    />
                    <div
                        className={`  flex items-center  text-[12px] h-14   outline-none w-full mt-1 ${
                            classNames?.mainRoot
                                ? classNames?.mainRoot
                                : "rounded-[10px]"
                        } ${disabled ? "bg-black-20 cursor-not-allowed" : ""} ${
                            meta.touched && meta.error && "border-red-100"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <p
                            className={`${
                                pictureName ? "text-[black]" : "text-[#CECECC]"
                            } ${classNames?.input}`}
                        >
                            {pictureName
                                ? pictureName + " selected"
                                : placeholder}
                        </p>
                    </div>

                    {meta.touched && meta.error && (
                        <div className="text-red-100 my-2 text-md">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}
function CheckboxProp(props: formInterface) {
    const {
        classNames,
        name,
        //enablereinitialize,
        className,
        label,
        labelClassName,
    } = props

    return (
        <Field name={name} type="checkbox">
            {({ meta, form: { setFieldValue } }: FieldProps<boolean>) => (
                <div
                    className={`flex flex-col w-full ${classNames?.wrapper} ${className}`}
                >
                    <div className="flex items-center">
                        <Checkbox
                            checked={meta.value === true}
                            onChange={(e) =>
                                setFieldValue(name, e.target.checked)
                            }
                            classNames={{ input: classNames?.input }}
                        />

                        <label
                            htmlFor={name}
                            className={`label ml-2 ${labelClassName}`}
                        >
                            {label}
                        </label>
                    </div>

                    {meta.touched && meta.error && (
                        <div className="text-red-100 my-2 text-3md">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}

function TextAreaProp(props: formInterface) {
    const {
        classNames,
        name,
        onClick,
        disabled,
        label,
        className,
        labelClassName,
    } = props

    return (
        <Field name={name}>
            {({ field, meta, form }: any) => (
                <div className={`${className}`}>
                    {label && (
                        <label
                            htmlFor={name}
                            className={`label text-md ${labelClassName}`}
                        >
                            {label}
                        </label>
                    )}
                    <div
                        className={`flex flex-col w-full border border-[#CBD5E1]  rounded-3xl  px-2 mt-1 ${classNames?.wrapper} ${
                            form.touched[name as string] &&
                            form.errors[name as string]
                                ? "border-red-100"
                                : ""
                        } `}
                    >
                        <textarea
                            {...field}
                            {...props}
                            onClick={onClick}
                            className={`bg-transparent flex items-center outline-none w-full pt-2 text-[12px] ${classNames?.input}${
                                disabled ? "bg-black-20 cursor-not-allowed" : ""
                            } `}
                            rows={5}
                        />
                    </div>
                    {meta.touched && meta.error && (
                        <div className="text-red-100 items-center text-md ">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}

function SelectInput(props: ISelectProps) {
    const {
        className,
        name,
        children,
        suffixIcon,
        label,
        defaultValue,
        classNames,
        labelClassName,
        onChange,
        ...rest
    } = props

    return (
        <>
            <Field name={name}>
                {({
                    field,
                    meta,
                    form: { setFieldValue },
                }: FieldProps<string>) => (
                    <div className={` ${className} `}>
                        {label && (
                            <label
                                htmlFor={name}
                                className={`label ${labelClassName}`}
                            >
                                {label}
                            </label>
                        )}
                        <div className="relative">
                            <select
                                {...field}
                                {...rest}
                                className={`border-solid border-2 border-gray-100  p-3 pr-8 rounded-full w-full outline-none text-[14px] h-14 ${classNames?.mainRoot}   ${
                                    styles.select
                                }  ${
                                    meta.touched && meta.error
                                        ? "border border-red-100"
                                        : ""
                                }`}
                                defaultValue={meta.initialValue || defaultValue}
                                onChange={(e) => {
                                    setFieldValue(name, e.target.value)
                                    onChange && onChange(e)
                                }}
                            >
                                {children}
                            </select>
                            <span className="absolute right-3 top-[35%]">
                                {suffixIcon || (
                                    <RiArrowDropDownLine
                                        //color="1f6fe3"
                                        //className="bg-[#BED6F7] p-0"
                                        size={25}
                                    />
                                )}
                            </span>
                        </div>
                        {meta.touched && meta.error && (
                            <div className="text-red-100 my-2 text-md">
                                {meta.error}
                            </div>
                        )}
                    </div>
                )}
            </Field>
        </>
    )
}
function CustomSelect(props: formInterface) {
    const {
        className,
        name,
        children,
        suffixIcon,
        label,
        defaultValue,
        classNames,
        labelClassName,
        onChange,
        options,
        isSearchable,
        isClearable,
        isLoading,
        placeholder,
        ...rest
    } = props
    return (
        <Field name={name}>
            {({ field, meta, form: { setFieldValue } }: FieldProps<string>) => (
                <div className={`flex flex-col`}>
                    {label && (
                        <label
                            htmlFor={name}
                            className={`label ${labelClassName}`}
                        >
                            {label}
                        </label>
                    )}
                    <Select
                        {...field}
                        {...rest}
                        className=" w-full"
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused
                                    ? "#CBD5E1"
                                    : "#CBD5E1",
                                borderRadius: "50px",
                            }),
                        }}
                        classNames={{
                            control: () =>
                                `${
                                    meta.touched &&
                                    meta.error &&
                                    "border border-red-100"
                                }  w-full  `,
                            container: () =>
                                "border-gray-100 rounded-full w-full text-[14px] h-14",
                            valueContainer: () =>
                                "border-gray-100 rounded-full w-full text-[14px] h-12  ",
                            indicatorSeparator: () => "hidden",
                            //input:()=>'rounded-full border-gray-100 bg-[blue]',
                        }}
                        // classNamePrefix="select"
                        // defaultValue={defaultValue}
                        // //isDisabled={isDisabled}
                        isLoading={isLoading}
                        isClearable={isClearable}
                        // //isRtl={isRtl}
                        // isSearchable={isSearchable}
                        //value={field.value}
                        name={name}
                        //@ts-expect-error
                        options={options}
                        placeholder={placeholder}
                      
                        onChange={(val) => {
                            //@ts-expect-error
                            onChange && onChange(val)
                            setFieldValue(name, val)
                        }}
                    />
                    {meta.touched && meta.error && (
                        <div className="text-red-100 items-center text-3md ">
                            {meta.error}
                        </div>
                    )}
                </div>
            )}
        </Field>
    )
}
function SwitchInput(props: any) {
    const {
        onClick,
        disabled,
        checked,
        label,
        labelPosition,
        className,
        ...rest
    } = props

    const [field, meta] = useField(props)
    return (
        <>
            <div className={`flex flex-col`}>
                <Switch
                    {...field}
                    {...props}
                    className={` flex items-center placeholder:bg-black-60 outline-none w-full pt-2 ${className} ${
                        disabled ? "bg-black-20 cursor-not-allowed" : ""
                    } `}
                    onClick={onClick}
                    color="green"
                    label={label}
                    labelPosition={labelPosition}
                    checked={checked}
                    size="lg"
                    styles={{
                        root: "flex, justify-between",
                        label: "font-semibold text-[16px]",
                    }}
                    {...rest}
                />
                {meta.touched && meta.error && (
                    <div className="text-red-100 items-center text-3md ">
                        {meta.error}
                    </div>
                )}
            </div>
        </>
    )
}

export default function FormControls({ control, ...rest }: formInterface) {
    switch (control) {
        case "input":
            return <InputProp control="select" {...rest} />
        case "textarea":
            return <TextAreaProp control="select" {...rest} />
        case "checkbox":
            return <CheckboxProp control="select" {...rest} />
        case "file":
            return <FileInputProp control="select" {...rest} />
        case "date":
            return <DatePickerInput {...rest} />
        // case "phoneNumber":
        //     return <PhoneNumberInput {...rest} />
        case "select":
            // @ts-expect-error
            return <SelectInput {...rest} />
        case "customselect":
            //// @ts-expect-error
            return <CustomSelect control="customselect" {...rest} />
        case "switch":
            return <SwitchInput {...rest} />
        case "otp":
            return <OTPInput {...rest} />
        default:
            return null
    }
}
