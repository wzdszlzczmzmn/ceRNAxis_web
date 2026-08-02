import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortCMapResultURL } from "@/lib/api/analysis"


export const usePairedCohortCMapResult = ({
    taskUUID,
}) => {

    const url = taskUUID
        ? getPairedCohortCMapResultURL({
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
            degMethod: data?.deg_method,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
