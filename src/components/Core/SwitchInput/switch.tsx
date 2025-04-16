import styles from "./switchInput.module.scss"

interface SwitchInterface extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    value?: string
    className?: string
}
const Switch = ({ checked, onChange, value }: SwitchInterface) => {
    return (
        <label className={`${styles.switch} ml-0`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                value={value}
            />
            <span className={`${styles.slider} ${styles.round}`}></span>
        </label>
    )
}

export default Switch
