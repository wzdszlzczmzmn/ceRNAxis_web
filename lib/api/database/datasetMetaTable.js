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
