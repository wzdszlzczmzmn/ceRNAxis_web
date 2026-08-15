import { DATABASE_API_BASE } from "@/lib/api/config"

export const VALID_GENE_BIO_TYPES = ["miRNA", "mRNA", "lncRNA", "circRNA"]

export const DEFAULT_GENE_BIO_TYPE = "mRNA"

export const isValidGeneBioType = (geneBioType) => {
    return VALID_GENE_BIO_TYPES.includes(geneBioType)
}

export const getDatasetMetadataURL = (geneBioType) => {
    if (!isValidGeneBioType(geneBioType)) {
        return null
    }

    return `/database/dataset_metadata/?gene_bio_type=${encodeURIComponent(geneBioType)}`
}

export const getDatasetDownloadUrl = (dataset) => {
    return `${DATABASE_API_BASE}/dataset_data_download/?dataset=${encodeURIComponent(dataset)}`
}

export const getTCGAAnnotationDownloadUrl = (dataset) => {
    return `${DATABASE_API_BASE}/tcga_annotation_download/?dataset=${encodeURIComponent(dataset)}`
}

export const getTIMEDBAnnotationDownloadUrl = (dataset) => {
    return `${DATABASE_API_BASE}/timedb_annotation_download/?dataset=${encodeURIComponent(dataset)}`
}

export const getSCSTAnnotationDownloadUrl = (dataset) => {
    return `${DATABASE_API_BASE}/scst_annotation_download/?dataset=${encodeURIComponent(dataset)}`
}
