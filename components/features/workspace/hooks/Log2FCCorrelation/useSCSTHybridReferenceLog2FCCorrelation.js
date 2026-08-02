import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTHybridReferenceLog2FCCorrelationURL,
} from "@/lib/api/analysis";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    anti_count: 0,
    same_count: 0,
};


export const useSCSTHybridReferenceLog2FCCorrelation = ({
    taskUUID,
    groupValue,
    interactionType,
}) => {
    const shouldFetch = Boolean(
        taskUUID &&
        groupValue &&
        interactionType
    );

    const url = shouldFetch
        ? getSCSTHybridReferenceLog2FCCorrelationURL({
            taskUUID,
            groupValue,
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

        groupValue:
            data?.group_value ??
            data?.groupValue ??
            groupValue ??
            null,

        interactionType:
            data?.type ??
            interactionType ??
            null,

        availableTypes:
            data?.available_types ?? [],

        backgroundFile:
            data?.background_file ?? null,

        titlePrimary:
            data?.task_name ??
            taskUUID ??
            null,

        titleSecondary:
            data?.type ??
            interactionType ??
            null,

        summary:
            data?.summary ??
            EMPTY_SUMMARY,

        points:
            data?.points ??
            [],

        meta: {
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
