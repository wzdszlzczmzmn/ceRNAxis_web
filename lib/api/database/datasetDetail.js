import { DATABASE_API_BASE } from "@/lib/api/config"

export const getDatasetDetailURL = (dataset) => {
    if (!dataset) return null

    return `${DATABASE_API_BASE}/dataset_metadata/${dataset}/`
}

export const getDatasetSampleMetaURL = (dataset) => {
    if (!dataset) return null

    return `${DATABASE_API_BASE}/dataset_metadata/${dataset}/sample_meta/`
}


export const getDatasetDegVolcanoURL = ({ dataset, expressionType }) => {
    if (!dataset || !expressionType) return null

    const params = new URLSearchParams({
        dataset,
        expression_type: expressionType,
    })

    return `${DATABASE_API_BASE}/dataset_deg_volcano/?${params.toString()}`
}
