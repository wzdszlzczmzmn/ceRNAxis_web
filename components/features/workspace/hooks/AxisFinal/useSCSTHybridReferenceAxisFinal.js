import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { ANALYSIS_API_BASE } from "@/lib/api/config";

export const useSCSTHybridReferenceAxisFinal = ({
    taskUUID,
    groupValue,
}) => {
    const url = taskUUID && groupValue
        ? `${ANALYSIS_API_BASE}/scst_hybrid_reference_axis_final/?taskUUID=${taskUUID}&groupValue=${encodeURIComponent(groupValue)}`
        : null;

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        meta: {
            mapInfo: data?.map_info,
            tcgaType: data?.tcga_type,
            groupValue: data?.group_value,
        },
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
