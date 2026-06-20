import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { buildWorkflowTaskQueryURL } from "@/lib/api/analysis"

export const useTaskDetail = (taskId) => {
    const shouldFetch = Boolean(taskId);

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? buildWorkflowTaskQueryURL(taskId) : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        task: data,
        isTaskLoading: isLoading,
        isTaskError: error,
        mutate,
    };
};
