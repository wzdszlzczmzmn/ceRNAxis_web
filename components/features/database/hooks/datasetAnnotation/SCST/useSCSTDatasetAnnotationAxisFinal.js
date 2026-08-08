import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationAxisFinalURL,
} from "@/lib/api/database/datasetAnnotation";


export const useSCSTDatasetAnnotationAxisFinal = ({
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
        ? getSCSTDatasetAnnotationAxisFinalURL({
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
        count: data?.count ?? 0,
        columns: Array.isArray(data?.columns)
            ? data.columns
            : [],
        results: Array.isArray(data?.results)
            ? data.results
            : [],

        meta: {
            source: data?.source ?? null,
            datasetName:
                data?.dataset_name ?? null,
            dataType:
                data?.data_type ?? null,
            groupBy:
                data?.group_by ?? null,
            groupValue:
                data?.group_value ?? null,
            axisFinalFile:
                data?.axis_final_file ?? null,
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
