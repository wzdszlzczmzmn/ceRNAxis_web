import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTHybridReferenceDEGPathwayURL,
} from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
};

export const useSCSTHybridReferenceDEGPathway = ({
    taskUUID,
    groupValue,
}) => {
    const shouldFetch = Boolean(taskUUID && groupValue);

    const url = shouldFetch
        ? getSCSTHybridReferenceDEGPathwayURL({
            taskUUID,
            groupValue,
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
        taskName: data?.task_name ?? null,

        groupValue:
            data?.group_value ??
            groupValue ??
            null,

        gseaFile:
            data?.gsea_file ??
            null,

        title:
            data?.title ??
            "DEG Pathway Enrichment",

        summary:
            data?.summary ??
            EMPTY_SUMMARY,

        results:
            data?.results ??
            [],

        meta: {
            tcgaType: data?.tcga_type,
            dataSource: data?.data_source,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
