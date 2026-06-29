import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowExpCorrelationOptionsURL } from "@/lib/api/analysis";

export const useWorkflowExpCorrelationOptions = ({
    taskType,
    taskUUID,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID);

    const url = shouldFetch
        ? getWorkflowExpCorrelationOptionsURL({
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
        optionsData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? taskType ?? null,
        taskName: data?.task_name ?? null,
        correlationFile: data?.correlation_file ?? null,

        validTypes: data?.valid_types ?? [],
        availableTypes: data?.available_types ?? [],
        count: data?.count ?? 0,
        results: data?.results ?? [],

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
