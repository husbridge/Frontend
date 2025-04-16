import React from 'react';

interface IRadioProps extends React.HTMLAttributes<HTMLInputElement> {
    className?: string;
    classNames?: {
        label?: string;
        input?: string;
        wrapper?: string;
    };
    name?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    label?: string;
    checked?: boolean;
    id?: string;
}

/**
 *
 * @param {object} - {className, restprops} attribute for html element
 * @return {JSXElement}
 */
export default function Radio({
    id,
    className,
    classNames,
    label,
    onChange,
    name,
    checked,
    value,
    ...rest
}:  IRadioProps): JSX.Element {
    return (
        <div
            // htmlFor={id}
            className={`flex  items-center  h-6  cursor-pointer ${classNames?.wrapper} 
            `}
        >
            <input
                type="radio"
                className={ `outline-none accent-[black] checked:bg-green-100 focus:ring-0 relative vorian-radio  cursor-pointer ${className}`}
                {...rest}
                id={id}
                name={name}
                onChange={onChange}
                checked={checked}
                value={value}
            />
            <label htmlFor={id} className={`ml-4 ${classNames?.label}`}>{label}</label>
        </div>
    );
}
