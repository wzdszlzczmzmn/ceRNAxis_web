import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getHybridReferenceCMapResultURL } from "@/lib/api/analysis"


export const useHybridReferenceCMapResult = ({
    taskUUID,
}) => {
    const url = taskUUID
        ? getHybridReferenceCMapResultURL({
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
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
            degMethod: data?.deg_method,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
