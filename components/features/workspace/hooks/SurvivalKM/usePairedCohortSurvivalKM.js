import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getPairedCohortSurvivalKMURL,
} from "@/lib/api/analysis";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    group_count: 0,
    logrank_p: null,
};


export const usePairedCohortSurvivalKM = ({
    taskUUID,
}) => {
    const url = taskUUID
        ? getPairedCohortSurvivalKMURL({
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
        survivalData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        survivalFile: data?.survival_file ?? null,

        titlePrimary:
            data?.task_name ??
            taskUUID ??
            null,

        titleSecondary:
            data?.survival_file ??
            null,

        summary:
            data?.summary ??
            EMPTY_SUMMARY,

        groups:
            data?.groups ??
            [],

        meta: {
            mapInfo: data?.map_info,
            degMethod: data?.deg_method,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
