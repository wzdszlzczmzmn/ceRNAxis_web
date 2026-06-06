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
        isLoading,
        isError: error,
        mutate,
    }
}

export const EXPRESSION_TYPES = [
    "log2count",
    "log2fpkm",
    "log2fpkmuq",
    "log2tpm",
]

export const MAX_SELECTED_GENES = 30

export const isValidExpressionType = (expressionType) => {
    return EXPRESSION_TYPES.includes(expressionType)
}

export const getExpressionGeneListURL = (dataset, expressionType) => {
    if (!dataset || !isValidExpressionType(expressionType)) return null

    return `/database/dataset_expression_genes/?dataset=${encodeURIComponent(dataset)}&expression_type=${encodeURIComponent(expressionType)}`
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
