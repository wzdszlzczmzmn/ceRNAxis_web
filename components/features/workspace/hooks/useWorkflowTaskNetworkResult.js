import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getWorkflowTaskNetworkURL } from "@/lib/api/analysis";

export const useWorkflowTaskNetworkResult = ({
    taskType,
    taskUUID,
}) => {
    const shouldFetch = Boolean(taskType && taskUUID);

    const url = shouldFetch
        ? getWorkflowTaskNetworkURL({
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
        networkData: data ?? null,
        isNetworkLoading: isLoading,
        isNetworkError: !!error,
        error,
        mutateNetwork: mutate,
    };
};
