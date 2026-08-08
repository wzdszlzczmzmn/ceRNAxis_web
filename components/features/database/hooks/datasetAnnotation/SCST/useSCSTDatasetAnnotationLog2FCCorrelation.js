import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationLog2FCCorrelationURL,
} from "@/lib/api/database/datasetAnnotation";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    anti_count: 0,
    same_count: 0,
};


export const useSCSTDatasetAnnotationLog2FCCorrelation = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
    interactionType,
}) => {
    const shouldFetch = Boolean(
        dataset
        && ["sc", "st"].includes(dataType)
        && groupBy
        && groupValue
        && interactionType
    );

    const url = shouldFetch
        ? getSCSTDatasetAnnotationLog2FCCorrelationURL({
            dataset,
            dataType,
            groupBy,
            groupValue,
            interactionType,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher,
    );

    return {
        correlationData:
            data ?? null,

        datasetName:
            data?.dataset_name
            ?? dataset
            ?? null,

        dataType:
            data?.data_type
            ?? dataType
            ?? null,

        groupBy:
            data?.group_by
            ?? groupBy
            ?? null,

        groupValue:
            data?.group_value
            ?? groupValue
            ?? null,

        interactionType:
            data?.type
            ?? interactionType
            ?? null,

        availableTypes:
            Array.isArray(
                data?.available_types
            )
                ? data.available_types
                : [],

        backgroundFile:
            data?.background_file
            ?? null,

        titlePrimary:
            data?.dataset_name
            ?? dataset
            ?? null,

        titleSecondary:
            data?.type
            ?? interactionType
            ?? null,

        summary:
            data?.summary
            ?? EMPTY_SUMMARY,

        points:
            Array.isArray(
                data?.points
            )
                ? data.points
                : [],

        meta: {
            source:
                data?.source
                ?? null,

            annotationDirName:
                data?.annotation_dir_name
                ?? null,

            annotationFilePrefix:
                data?.annotation_file_prefix
                ?? null,

            networkSourceTaskType:
                data?.network_source_task_type
                ?? null,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
