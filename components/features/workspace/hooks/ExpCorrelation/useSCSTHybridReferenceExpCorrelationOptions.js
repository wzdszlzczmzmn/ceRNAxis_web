import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";

import {
    getSCSTHybridReferenceExpCorrelationOptionsURL,
} from "@/lib/api/analysis";


export const useSCSTHybridReferenceExpCorrelationOptions = ({
    taskUUID,
    groupValue,
}) => {
    const shouldFetch = Boolean(
        taskUUID &&
        groupValue
    );

    const url = shouldFetch
        ? getSCSTHybridReferenceExpCorrelationOptionsURL({
            taskUUID,
            groupValue,
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

        uuid:
            data?.uuid ??
            taskUUID ??
            null,

        taskName:
            data?.task_name ??
            null,

        groupValue:
            data?.group_value ??
            groupValue ??
            null,

        correlationFile:
            data?.correlation_file ??
            null,

        validTypes:
            data?.valid_types ??
            [],

        availableTypes:
            data?.available_types ??
            [],

        rawCount:
            data?.raw_count ??
            0,

        count:
            data?.count ??
            0,

        droppedCount:
            data?.dropped_count ??
            0,

        results:
            data?.results ??
            [],

        meta: {
            tcgaType:
            data?.tcga_type,

            lncrnaType:
            data?.lncrna_type,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
