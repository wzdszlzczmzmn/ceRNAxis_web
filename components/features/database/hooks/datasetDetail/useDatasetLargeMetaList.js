import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getDatasetLargeMetaURL } from "@/lib/api/database/datasetDetail"

export const useDatasetLargeMetaList = ({
    dataset,
    page = 1,
    pageSize = 10,
}) => {
    const shouldFetch = Boolean(dataset)

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        shouldFetch
            ? getDatasetLargeMetaURL({
                dataset,
                page,
                pageSize,
            })
            : null,
        fetcher,
        {
            keepPreviousData: true,
        }
    )

    return {
        dataset: data?.dataset ?? dataset,
        expressionMode: data?.expression_mode ?? null,
        fileFormat: data?.file_format ?? null,
        count: data?.count ?? 0,
        page: data?.page ?? page,
        pageSize: data?.page_size ?? pageSize,
        columns: data?.columns ?? [],
        rows: data?.results ?? [],
        isLoading,
        isValidating,
        isError: !!error,
        mutate,
    }
}
