import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortAxisFinalURL } from "@/lib/api/analysis";

export const usePairedCohortAxisFinal = (taskUUID) => {
    const url = getPairedCohortAxisFinalURL(taskUUID);

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        uuid: data?.uuid,
        taskName: data?.task_name,
        axisFinalFile: data?.axis_final_file,
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
