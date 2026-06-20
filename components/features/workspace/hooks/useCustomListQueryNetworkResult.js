import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getCustomListQueryNetworkResultURL } from "@/lib/api/analysis"

export const useCustomListQueryNetworkResult = (taskUUID) => {
    const shouldFetch = Boolean(taskUUID);

    const { data, error, isLoading, mutate } = useSWR(
        shouldFetch ? getCustomListQueryNetworkResultURL(taskUUID) : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        networkData: data,
        isNetworkLoading: isLoading,
        isNetworkError: error,
        mutateNetwork: mutate,
    };
};
