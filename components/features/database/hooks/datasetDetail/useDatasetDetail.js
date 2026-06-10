import useSWR from "swr"
import { getDatasetDetailURL } from "@/lib/api/database/datasetDetail"
import { fetcher } from "@/lib/api/fetcher"
import api from "@/lib/api/axios"

export const useDatasetDetail = (dataset) => {
    const { data, error, isLoading, mutate } = useSWR(
        dataset ? getDatasetDetailURL(dataset) : null,
        fetcher
    )

    return {
        metadata: data?.metadata ?? null,
        availableExpressionTypes: data?.available_expression_types ?? [],
        availableDegExpressionTypes: data?.available_deg_expression_types ?? [],
        isLoading,
        isError: error,
        mutate,
    }
}

export const EXPRESSION_TYPES_BY_RNA_TYPE = {
    mRNA: ["log2count", "log2fpkm", "log2fpkmuq", "log2tpm"],
    lncRNA: ["log2count", "log2fpkm", "log2fpkmuq", "log2tpm"],
    miRNA: ["log2rpm"],
    circRNA: ["count"],
}

export const RNA_TYPES = Object.keys(EXPRESSION_TYPES_BY_RNA_TYPE)

export const MAX_SELECTED_GENES = 30

export const isValidRNAType = rnaType => {
    return RNA_TYPES.includes(rnaType)
}

export const getExpressionTypesByRNAType = rnaType => {
    return EXPRESSION_TYPES_BY_RNA_TYPE[rnaType] ?? []
}

export const isValidExpressionType = (rnaType, expressionType) => {
    return getExpressionTypesByRNAType(rnaType).includes(expressionType)
}

export const getExpressionGeneListURL = (dataset, rnaType, expressionType) => {
    if (
        !dataset ||
        !isValidRNAType(rnaType) ||
        !isValidExpressionType(rnaType, expressionType)
    ) {
        return null
    }

    return `/database/dataset_expression_genes/?dataset=${encodeURIComponent(
        dataset
    )}&expression_type=${encodeURIComponent(
        expressionType
    )}`
}

export const fetchDatasetExpressionData = async ({
    dataset,
    expressionType,
    genes,
}) => {
    const res = await api.post("/database/dataset_expression/", {
        dataset,
        expression_type: expressionType,
        genes,
    })

    return res.data
}
