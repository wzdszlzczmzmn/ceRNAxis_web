import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationSurvivalKMURL,
} from "@/lib/api/database/datasetAnnotation";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    group_count: 0,
    logrank_p: null,
};


export const useSCSTDatasetAnnotationSurvivalKM = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const shouldFetch = Boolean(
        dataset
        && ["sc", "st"].includes(dataType)
        && groupBy
        && groupValue
    );

    const url = shouldFetch
        ? getSCSTDatasetAnnotationSurvivalKMURL({
            dataset,
            dataType,
            groupBy,
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
        fetcher,
    );

    return {
        survivalData:
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

        survivalFile:
            data?.survival_file
            ?? null,

        titlePrimary:
            data?.dataset_name
            ?? dataset
            ?? null,

        titleSecondary:
            data?.survival_file
            ?? null,

        summary:
            data?.summary
            ?? EMPTY_SUMMARY,

        groups:
            Array.isArray(
                data?.groups
            )
                ? data.groups
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
