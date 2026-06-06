import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getDatasetSampleMetaURL } from "@/lib/api/database/datasetDetail"

export const useDatasetSampleMetaList = (dataset) => {
    const { data, error, isLoading, mutate } = useSWR(
        dataset ? getDatasetSampleMetaURL(dataset) : null,
        fetcher
    )

    return {
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        samples: data?.results ?? [],
        isLoading,
        isError: !!error,
        mutate,
    }
}
