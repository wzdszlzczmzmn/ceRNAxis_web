import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getSCSTHybridReferenceCMapResultURL } from "@/lib/api/analysis"



export const useSCSTHybridReferenceCMapResult = ({
    taskUUID,
    groupValue,
}) => {

    const url =
        taskUUID && groupValue
            ? getSCSTHybridReferenceCMapResultURL({
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
        columns: data?.columns ?? [],
        count: data?.summary?.raw_count ?? 0,
        results: data?.results ?? [],

        meta: {
            groupValue: data?.group_value,
            mapInfo: data?.map_info,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
