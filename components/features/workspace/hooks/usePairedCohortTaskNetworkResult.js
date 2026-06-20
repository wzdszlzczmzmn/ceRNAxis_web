import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortTaskNetworkURL } from "@/lib/api/analysis";

export const usePairedCohortTaskNetworkResult = (taskUUID) => {
    const url = getPairedCohortTaskNetworkURL(taskUUID);

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        networkData: data ?? null,
        isNetworkLoading: isLoading,
        isNetworkError: error,
        mutateNetwork: mutate,
    };
};
