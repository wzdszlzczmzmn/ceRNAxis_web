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

const GROUPS = ["NotSig", "Down", "Up"]

const normalizeVolcanoData = data => {
    if (!data) return null

    const normalizedGroups = {}

    GROUPS.forEach(group => {
        normalizedGroups[group] = (data.groups?.[group] || []).map(item => ({
            gene_name: item.gene_name,
            log2FC: item.log2FC,
            pvalue: item.pvalue,
            neg_log10_pvalue: item.neg_log10_pvalue,
        }))
    })

    return {
        ...data,
        summary: data.summary ?? EMPTY_SUMMARY,
        groups: normalizedGroups,
    }
}

export const useDatasetDegVolcano = ({ dataset, expressionType }) => {
    const shouldFetch = Boolean(dataset && expressionType)

    const url = shouldFetch
        ? getDatasetDegVolcanoURL({
            dataset,
            expressionType,
        })
        : null

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    const volcanoData = normalizeVolcanoData(data)

    return {
        volcanoData,

        dataset: volcanoData?.dataset ?? dataset ?? null,
        rnaType: volcanoData?.rna_type ?? null,
        expressionType: volcanoData?.expression_type ?? expressionType ?? null,

        titlePrimary: volcanoData?.dataset ?? dataset ?? null,
        titleSecondary: volcanoData?.expression_type ?? expressionType ?? null,

        summary: volcanoData?.summary ?? EMPTY_SUMMARY,
        groups: volcanoData?.groups ?? EMPTY_GROUPS,

        isLoading,
        isError: error,
        mutate,
    }
}
