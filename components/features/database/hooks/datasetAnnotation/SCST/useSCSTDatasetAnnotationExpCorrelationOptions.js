import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationExpCorrelationOptionsURL,
} from "@/lib/api/database/datasetAnnotation";


export const useSCSTDatasetAnnotationExpCorrelationOptions = ({
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
        ? getSCSTDatasetAnnotationExpCorrelationOptionsURL({
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
        optionsData:
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

        correlationFile:
            data?.correlation_file
            ?? null,

        validTypes:
            Array.isArray(
                data?.valid_types
            )
                ? data.valid_types
                : [],

        availableTypes:
            Array.isArray(
                data?.available_types
            )
                ? data.available_types
                : [],

        rawCount:
            data?.raw_count
            ?? 0,

        count:
            data?.count
            ?? 0,

        droppedCount:
            data?.dropped_count
            ?? 0,

        results:
            Array.isArray(
                data?.results
            )
                ? data.results
                : [],

        meta: {
            source:
                data?.source
                ?? null,

            tcgaType:
                data?.tcga_type
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
