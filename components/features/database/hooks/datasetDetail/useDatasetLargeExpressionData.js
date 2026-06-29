import { DATABASE_API_BASE } from "@/lib/api/config"
import api from "@/lib/api/axios"
import useSWR from "swr"

export const fetchDatasetLargeExpressionData = async ({
    dataset,
    expressionType,
    genes,
    page = 1,
    pageSize = 50,
}) => {
    const response = await api.post(
        `${DATABASE_API_BASE}/dataset_expression/large_data/`,
        {
            dataset,
            expression_type: expressionType,
            genes,
            page,
            page_size: pageSize,
        }
    )

    return response.data
}

export const useDatasetLargeExpressionData = ({
    dataset,
    expressionType,
    genes,
    page = 1,
    pageSize = 50,
}) => {
    const shouldFetch =
        dataset &&
        expressionType &&
        Array.isArray(genes) &&
        genes.length > 0

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        shouldFetch
            ? [
                "dataset-large-expression-data",
                dataset,
                expressionType,
                genes.join(","),
                page,
                pageSize,
            ]
            : null,
        () => fetchDatasetLargeExpressionData({
            dataset,
            expressionType,
            genes,
            page,
            pageSize,
        }),
        {
            keepPreviousData: true,
        }
    )

    return {
        dataset: data?.dataset,
        expressionType: data?.expression_type,
        expressionMode: data?.expression_mode,
        count: data?.count ?? 0,
        page: data?.page ?? page,
        pageSize: data?.page_size ?? pageSize,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        isLoading,
        isValidating,
        isError: !!error,
        error,
        mutate,
    }
}
