import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getWorkflowCMScoreResultURL,
} from "@/lib/api/analysis";

export const useWorkflowCMScoreResult = ({
    taskType,
    taskUUID,
    item,
    groupValue = null,
}) => {
    const shouldFetch = Boolean(
        taskType &&
        taskUUID &&
        item
    );

    const url = shouldFetch
        ? getWorkflowCMScoreResultURL({
            taskType,
            taskUUID,
            item,
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
        cmScoreData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? taskType ?? null,
        taskName: data?.task_name ?? null,

        groupValue:
            data?.group_value ??
            groupValue ??
            null,

        item: data?.item ?? item ?? null,
        cmScoreFile: data?.cm_score_file ?? null,

        count: data?.count ?? 0,
        defaultDataset: data?.default_dataset ?? null,

        datasetOptions:
            Array.isArray(data?.dataset_options)
                ? data.dataset_options
                : [],

        plot: data?.plot ?? {},
        formula: data?.formula ?? {},
        results:
            Array.isArray(data?.results)
                ? data.results
                : [],

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
