import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getHybridReferenceDEGPathwayURL } from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
};

export const useHybridReferenceDEGPathway = ({ taskUUID }) => {
    const url = taskUUID
        ? getHybridReferenceDEGPathwayURL({ taskUUID })
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
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
            dataSource: data?.data_source,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
