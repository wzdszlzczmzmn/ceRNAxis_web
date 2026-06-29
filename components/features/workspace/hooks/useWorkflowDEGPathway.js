import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowDEGPathwayURL } from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
};

export const useWorkflowDEGPathway = ({
    taskType,
    taskUUID,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID);

    const url = shouldFetch
        ? getWorkflowDEGPathwayURL({
            taskType,
            taskUUID,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        pathwayData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? taskType ?? null,
        taskName: data?.task_name ?? null,
        gseaFile: data?.gsea_file ?? null,
        title: data?.title ?? "DEG Pathway Enrichment",

        xField: data?.x_field ?? "NES",
        yField: data?.y_field ?? "Term",
        sizeField: data?.size_field ?? "neg_log10_fdr_qval",

        summary: data?.summary ?? EMPTY_SUMMARY,
        results: data?.results ?? [],

        meta: {
            mapInfo: data?.map_info,
            degMethod: data?.deg_method,
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
