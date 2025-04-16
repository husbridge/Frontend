import { MultiSelect } from "@mantine/core"

interface ComboboxProps {
    label?: string
    options: Array<{ id: string; name: string }>
    placeholder?: string
    multiple?: boolean
    onChange: (selected: Array<{ id: string; name: string }>) => void
    value: Array<{ id: string; name: string }>
}

const Combobox = ({ label, options, onChange, value, placeholder, multiple=false }: ComboboxProps) => {

    return (
        <div className="relative mb-4">
           {label && <label className="block font-medium text-[black] mb-2 text-md ">
                {label}
            </label>}
            <MultiSelect
                data={options.map((option) => ({
                    value: option.id,
                    label: option.name,
                }))}
                placeholder={placeholder || "Search"}
                searchable
                value={value.map((item) => item.id ?? '')}
                onChange={(selectedIds) => {
                    const selectedOptions = options.filter((option) =>
                        selectedIds.includes(option.id)
                    )
                    onChange(selectedOptions)
                }}
                multiple={multiple}
                styles={() => ({
                    item: {
                        borderRadius: '999px',
                    },
                    input: {
                        borderRadius: '999px',
                        padding: '8px 15px 10px 15px'
                    },
                    control: {
                        borderRadius: '999px',
                    },
                })}
            />
        </div>
    )
}

export default Combobox
