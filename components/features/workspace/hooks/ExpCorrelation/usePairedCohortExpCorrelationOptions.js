import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getPairedCohortExpCorrelationOptionsURL,
} from "@/lib/api/analysis";


export const usePairedCohortExpCorrelationOptions = ({
    taskUUID,
}) => {
    const url = taskUUID
        ? getPairedCohortExpCorrelationOptionsURL({
            taskUUID,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        optionsData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        correlationFile: data?.correlation_file ?? null,

        validTypes: data?.valid_types ?? [],
        availableTypes: data?.available_types ?? [],

        rawCount: data?.raw_count ?? 0,
        count: data?.count ?? 0,
        droppedCount: data?.dropped_count ?? 0,

        results: data?.results ?? [],

        meta: {
            mapInfo: data?.map_info,
            degMethod: data?.deg_method,
            usePadj: data?.use_padj,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
