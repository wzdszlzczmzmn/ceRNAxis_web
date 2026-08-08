import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationNetworkURL,
} from "@/lib/api/database/datasetAnnotation";


export const useSCSTDatasetAnnotationNetworkResult = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const shouldFetch = Boolean(
        dataset
        && ["sc", "st"].includes(dataType)
        && groupBy
        && groupValue
    );

    const url = shouldFetch
        ? getSCSTDatasetAnnotationNetworkURL({
            dataset,
            dataType,
            groupBy,
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
        fetcher,
    );

    return {
        networkData: data ?? null,

        isNetworkLoading: isLoading,
        isNetworkError: Boolean(error),
        networkError: error,

        mutateNetwork: mutate,
    };
};
