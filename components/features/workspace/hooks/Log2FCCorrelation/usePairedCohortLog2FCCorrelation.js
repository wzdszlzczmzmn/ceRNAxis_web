import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getPairedCohortLog2FCCorrelationURL,
} from "@/lib/api/analysis";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    anti_count: 0,
    same_count: 0,
};


export const usePairedCohortLog2FCCorrelation = ({
    taskUUID,
    interactionType,
}) => {
    const shouldFetch = Boolean(
        taskUUID &&
        interactionType
    );

    const url = shouldFetch
        ? getPairedCohortLog2FCCorrelationURL({
            taskUUID,
            interactionType,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        correlationData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        interactionType: data?.type ?? interactionType ?? null,
        availableTypes: data?.available_types ?? [],
        backgroundFile: data?.background_file ?? null,

        titlePrimary: data?.task_name ?? taskUUID ?? null,
        titleSecondary: data?.type ?? interactionType ?? null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        points: data?.points ?? [],

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
