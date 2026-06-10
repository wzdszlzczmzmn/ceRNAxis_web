import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getDatasetDegVolcanoURL } from "@/lib/api/database/datasetDetail"

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    not_sig: 0,
    down: 0,
    up: 0,
}

const EMPTY_GROUPS = {
    NotSig: [],
    Down: [],
    Up: [],
}

export const useDatasetDegVolcano = ({ dataset, expressionType }) => {
    const url = getDatasetDegVolcanoURL({
        dataset,
        expressionType,
    })

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        volcanoData: data ?? null,

        dataset: data?.dataset ?? dataset ?? null,
        rnaType: data?.rna_type ?? null,
        expressionType: data?.expression_type ?? expressionType ?? null,

        titlePrimary: data?.dataset ?? dataset ?? null,
        titleSecondary: data?.expression_type ?? expressionType ?? null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        groups: data?.groups ?? EMPTY_GROUPS,

        isLoading,
        isError: error,
        mutate,
    }
}
