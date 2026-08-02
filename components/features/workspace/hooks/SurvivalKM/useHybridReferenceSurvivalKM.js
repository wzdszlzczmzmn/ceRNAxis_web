import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getHybridReferenceSurvivalKMURL,
} from "@/lib/api/analysis";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    group_count: 0,
    logrank_p: null,
};


export const useHybridReferenceSurvivalKM = ({
    taskUUID,
}) => {
    const url = taskUUID
        ? getHybridReferenceSurvivalKMURL({
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
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
            dataSource: data?.data_source,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
