import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getExpressionGeneListURL } from "@/components/features/database/hooks/datasetDetail/useDatasetDetail"

export const useExpressionGeneList = (dataset, rnaType, expressionType) => {
    const url = getExpressionGeneListURL(dataset, rnaType, expressionType)

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        dataset: data?.dataset,
        expressionType: data?.expression_type,
        count: data?.count ?? 0,
        genes: data?.genes ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    }
}
