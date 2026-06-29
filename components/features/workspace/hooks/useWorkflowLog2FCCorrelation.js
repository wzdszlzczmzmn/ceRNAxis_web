import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowLog2FCCorrelationURL } from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    anti_count: 0,
    same_count: 0,
};

export const useWorkflowLog2FCCorrelation = ({
    taskType,
    taskUUID,
    interactionType,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID && interactionType);

    const url = shouldFetch
        ? getWorkflowLog2FCCorrelationURL({
            taskType,
            taskUUID,
            interactionType,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        correlationData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? taskType ?? null,
        taskName: data?.task_name ?? null,
        interactionType: data?.type ?? interactionType ?? null,
        availableTypes: data?.available_types ?? [],
        backgroundFile: data?.background_file ?? null,

        titlePrimary: data?.task_name ?? taskUUID ?? null,
        titleSecondary: data?.type ?? interactionType ?? null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        points: data?.points ?? [],

        meta: {
            mapInfo: data?.map_info,
            degMethod: data?.deg_method,
            usePadj: data?.use_padj,
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
