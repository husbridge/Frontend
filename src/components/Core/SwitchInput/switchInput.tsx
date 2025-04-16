import styles from "./switchInput.module.scss"

interface SwitchInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    prefixIcon?: JSX.Element
    label?: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    className?: string;
}
const SwitchInput = ({ prefixIcon, label, checked, onChange, value, className }: SwitchInputInterface) => {
    return (
        <div className={ `rounded-[10px] bg-[#F4F4F4] flex mt-2 mb-4 p-4 justify-between items-center cursor-pointer ${className}`}>
            <div className="flex">
            {prefixIcon}
            <p className="description md:body-regular ml-2 text-[#7A7A7A]">{label}</p>
            </div>
            
            <label className={styles.switch}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    value={value}
                />
                <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
        </div>
    )
}

export default SwitchInput
