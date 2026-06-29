import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowCMapResultURL } from "@/lib/api/analysis";

export const useWorkflowCMapResult = ({
    taskType,
    taskUUID,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID);

    const url = shouldFetch
        ? getWorkflowCMapResultURL({
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
        uuid: data?.uuid ?? null,
        taskType: data?.task_type ?? null,
        taskName: data?.task_name ?? null,

        cmapFile: data?.cmap_file ?? null,
        columns: data?.columns ?? [],
        summary: data?.summary ?? {},
        count: data?.summary?.raw_count ?? data?.results?.length ?? 0,
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
