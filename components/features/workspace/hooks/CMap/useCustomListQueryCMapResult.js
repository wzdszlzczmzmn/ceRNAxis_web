import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getCustomListQueryCMapResultURL } from "@/lib/api/analysis"


export const useCustomListQueryCMapResult = ({
    taskUUID,
}) => {

    const url = taskUUID
        ? getCustomListQueryCMapResultURL({
            taskUUID,
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
        columns: data?.columns ?? [],
        count: data?.summary?.raw_count ?? 0,
        results: data?.results ?? [],

        meta: {
            mapInfo: data?.map_info,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
