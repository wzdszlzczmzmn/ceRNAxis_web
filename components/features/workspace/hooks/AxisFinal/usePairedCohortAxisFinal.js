import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortAxisFinalURL } from "@/lib/api/analysis"

export const usePairedCohortAxisFinal = ({ taskUUID }) => {
    const url = taskUUID
        ? getPairedCohortAxisFinalURL({ taskUUID })
        : null;

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
