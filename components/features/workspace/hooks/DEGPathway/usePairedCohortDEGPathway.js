import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortDEGPathwayURL } from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
};

export const usePairedCohortDEGPathway = ({ taskUUID }) => {
    const url = taskUUID
        ? getPairedCohortDEGPathwayURL({ taskUUID })
        : null;

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        pathwayData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        gseaFile: data?.gsea_file ?? null,
        title: data?.title ?? "DEG Pathway Enrichment",

        summary: data?.summary ?? EMPTY_SUMMARY,
        results: data?.results ?? [],

        meta: {
            mapInfo: data?.map_info,
            degMethod: data?.deg_method,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
