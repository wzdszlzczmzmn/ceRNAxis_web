import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowSurvivalKMURL } from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    group_count: 0,
    logrank_p: null,
};

export const useWorkflowSurvivalKM = ({
    taskType,
    taskUUID,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID);

    const url = shouldFetch
        ? getWorkflowSurvivalKMURL({
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
        survivalData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? taskType ?? null,
        taskName: data?.task_name ?? null,
        survivalFile: data?.survival_file ?? null,

        title: data?.title ?? "ceRNA axis-based survival analysis",
        titlePrimary: data?.task_name ?? taskUUID ?? null,
        titleSecondary: data?.survival_file ?? null,

        xLabel: data?.x_label ?? "Time days",
        yLabel: data?.y_label ?? "Overall survival probability",

        summary: data?.summary ?? EMPTY_SUMMARY,
        groups: data?.groups ?? [],

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
