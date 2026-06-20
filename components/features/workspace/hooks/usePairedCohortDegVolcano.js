import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getPairedCohortDegVolcanoURL } from "@/lib/api/analysis"

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

export const usePairedCohortDegVolcano = ({
    taskUUID,
    rnaType,
}) => {
    const url = getPairedCohortDegVolcanoURL({
        taskUUID,
        rnaType,
    })

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        volcanoData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        degMethod: data?.deg_method ?? null,
        rnaType: data?.rna_type ?? rnaType ?? null,
        degFile: data?.deg_file ?? null,

        titlePrimary: data?.task_name ?? taskUUID ?? null,
        titleSecondary:
            data?.deg_method && data?.rna_type
                ? `${data.deg_method} · ${data.rna_type}`
                : rnaType ?? null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        groups: data?.groups ?? EMPTY_GROUPS,

        isLoading,
        isError: error,
        mutate,
    }
}
