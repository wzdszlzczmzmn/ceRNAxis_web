import useSWR from "swr"
import { fetchDatasetExpressionData } from "@/components/features/database/hooks/datasetDetail/useDatasetDetail"

export const useDatasetExpressionData = ({
    dataset,
    expressionType,
    genes,
}) => {
    const shouldFetch =
        dataset &&
        expressionType &&
        Array.isArray(genes) &&
        genes.length > 0

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch
            ? [
                "dataset-expression-data",
                dataset,
                expressionType,
                genes.join(","),
            ]
            : null,
        () => fetchDatasetExpressionData({
            dataset,
            expressionType,
            genes,
        }),
        {
            keepPreviousData: true,
        }
    )

    return {
        dataset: data?.dataset,
        expressionType: data?.expression_type,
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    }
}
