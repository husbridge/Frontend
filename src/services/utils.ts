import axios from "axios"

export const fetchCountries = async () => {
    const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries"
    )
    return response.data.data.map((item: any) => ({
        value: item,
        label: item.country,
    }))
    
}