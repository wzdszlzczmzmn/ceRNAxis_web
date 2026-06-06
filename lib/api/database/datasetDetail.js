import { DATABASE_API_BASE } from "@/lib/api/config"

export const getDatasetDetailURL = (dataset) => {
    if (!dataset) return null

    return `${DATABASE_API_BASE}/dataset_metadata/${dataset}/`
}

export const getDatasetSampleMetaURL = (dataset) => {
    if (!dataset) return null

    return `${DATABASE_API_BASE}/dataset_metadata/${dataset}/sample_meta/`
}
