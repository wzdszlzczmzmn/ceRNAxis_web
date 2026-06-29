import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowAxisFinalURL } from "@/lib/api/analysis";

export const useWorkflowAxisFinal = ({
    taskType,
    taskUUID,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID);

    const url = shouldFetch
        ? getWorkflowAxisFinalURL({
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
        uuid: data?.uuid,
        taskType: data?.task_type,
        taskName: data?.task_name,

        axisFinalFile: data?.axis_final_file,
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
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
