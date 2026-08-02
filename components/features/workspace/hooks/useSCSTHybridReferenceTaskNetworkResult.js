import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTHybridReferenceTaskNetworkURL,
} from "@/lib/api/analysis";


export const useSCSTHybridReferenceTaskNetworkResult = ({
    taskUUID,
    groupValue,
}) => {

    const url =
        taskUUID && groupValue
            ? getSCSTHybridReferenceTaskNetworkURL({
                taskUUID,
                groupValue,
            })
            : null;


    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher
    );


    return {
        networkData: data ?? null,
        isNetworkLoading: isLoading,
        isNetworkError: error,
        mutateNetwork: mutate,
    };
};
