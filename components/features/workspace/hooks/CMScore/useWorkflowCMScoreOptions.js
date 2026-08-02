import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getWorkflowCMScoreOptionsURL,
} from "@/lib/api/analysis";

export const useWorkflowCMScoreOptions = ({
    taskType,
    taskUUID,
    groupValue = null,
}) => {
    const shouldFetch = Boolean(
        taskType &&
        taskUUID
    );

    const url = shouldFetch
        ? getWorkflowCMScoreOptionsURL({
            taskType,
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

    const options = Array.isArray(data?.results)
        ? data.results
        : [];

    return {
        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? taskType ?? null,
        taskName: data?.task_name ?? null,

        groupValue:
            data?.group_value ??
            groupValue ??
            null,

        count: data?.count ?? options.length,
        defaultItem: data?.default_item ?? null,
        options,

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
