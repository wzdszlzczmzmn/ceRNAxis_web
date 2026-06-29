import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getHybridReferenceTaskNetworkURL } from "@/lib/api/analysis";

export const useHybridReferenceTaskNetworkResult = (taskUUID) => {
    const url = taskUUID
        ? getHybridReferenceTaskNetworkURL(taskUUID)
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
        isNetworkError: error,
        mutateNetwork: mutate,
    };
};
