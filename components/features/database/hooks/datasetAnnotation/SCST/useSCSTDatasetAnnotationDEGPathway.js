import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationDEGPathwayURL,
} from "@/lib/api/database/datasetAnnotation";


const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
};


export const useSCSTDatasetAnnotationDEGPathway = ({
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
        ? getSCSTDatasetAnnotationDEGPathwayURL({
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
        pathwayData:
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

        gseaFile:
            data?.gsea_file
            ?? null,

        title:
            data?.title
            ?? "DEG Pathway Enrichment",

        summary:
            data?.summary
            ?? EMPTY_SUMMARY,

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
