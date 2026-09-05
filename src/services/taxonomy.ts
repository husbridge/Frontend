import axiosInstance from "./api.services"

export interface TaxonomyEntry {
    _id: string
    type: "category" | "skill"
    slug: string
    label: string
    parent?: string
}

interface TaxonomyResponse {
    statusCode: number
    message: string
    hasError: boolean
    data: TaxonomyEntry[]
}

// Public, unauthenticated reference data — no auth header needed.
export const fetchCategories = async () => {
    const response =
        await axiosInstance.get<TaxonomyResponse>("/taxonomy/categories")
    return response.data
}

export const fetchSkills = async () => {
    const response = await axiosInstance.get<TaxonomyResponse>("/taxonomy/skills")
    return response.data
}
