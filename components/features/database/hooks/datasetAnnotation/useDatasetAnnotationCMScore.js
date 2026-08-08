import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";

import {
    getTCGADatasetAnnotationCMScoreOptionsURL,
    getTCGADatasetAnnotationCMScoreResultURL,

    getTIMEDBDatasetAnnotationCMScoreOptionsURL,
    getTIMEDBDatasetAnnotationCMScoreResultURL,

    getSCSTDatasetAnnotationCMScoreOptionsURL,
    getSCSTDatasetAnnotationCMScoreResultURL,
} from "@/lib/api/database/datasetAnnotation";


const normalizeOptions = ({
    data,
    fallback = {},
}) => {
    const options = Array.isArray(
        data?.results
    )
        ? data.results
        : [];

    return {
        optionsData:
            data ?? null,

        datasetName:
            data?.dataset_name
            ?? fallback.dataset
            ?? null,

        dataType:
            data?.data_type
            ?? fallback.dataType
            ?? null,

        groupBy:
            data?.group_by
            ?? fallback.groupBy
            ?? null,

        groupType:
            data?.group_type
            ?? fallback.groupType
            ?? null,

        groupValue:
            data?.group_value
            ?? fallback.groupValue
            ?? null,

        count:
            data?.count
            ?? options.length,

        defaultItem:
            data?.default_item
            ?? null,

        options,
    };
};


const normalizeResult = ({
    data,
    fallback = {},
}) => ({
    cmScoreData:
        data ?? null,

    datasetName:
        data?.dataset_name
        ?? fallback.dataset
        ?? null,

    groupValue:
        data?.group_value
        ?? fallback.groupValue
        ?? null,

    item:
        data?.item
        ?? fallback.item
        ?? null,

    cmScoreFile:
        data?.cm_score_file
        ?? null,

    count:
        data?.count
        ?? 0,

    defaultDataset:
        data?.default_dataset
        ?? null,

    datasetOptions:
        Array.isArray(
            data?.dataset_options
        )
            ? data.dataset_options
            : [],

    plot:
        data?.plot
        ?? {},

    formula:
        data?.formula
        ?? {},

    results:
        Array.isArray(
            data?.results
        )
            ? data.results
            : [],
});


const useOptions = ({
    url,
    fallback,
}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher
    );

    return {
        ...normalizeOptions({
            data,
            fallback,
        }),

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};


const useResult = ({
    url,
    fallback,
}) => {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher
    );

    return {
        ...normalizeResult({
            data,
            fallback,
        }),

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
export const useTCGADatasetAnnotationCMScoreOptions = ({
    dataset,
}) => {
    const url = dataset
        ? getTCGADatasetAnnotationCMScoreOptionsURL({
            dataset,
        })
        : null;

    return useOptions({
        url,
        fallback: {
            dataset,
        },
    });
};


export const useTCGADatasetAnnotationCMScoreResult = ({
    dataset,
    item,
}) => {
    const url = (
        dataset
        && item
    )
        ? getTCGADatasetAnnotationCMScoreResultURL({
            dataset,
            item,
        })
        : null;

    return useResult({
        url,
        fallback: {
            dataset,
            item,
        },
    });
};


export const useTIMEDBDatasetAnnotationCMScoreOptions = ({
    dataset,
    groupBy,
    groupType,
}) => {
    const url = (
        dataset
        && groupBy
        && groupType
    )
        ? getTIMEDBDatasetAnnotationCMScoreOptionsURL({
            dataset,
            groupBy,
            groupType,
        })
        : null;

    return useOptions({
        url,
        fallback: {
            dataset,
            groupBy,
            groupType,
        },
    });
};


export const useTIMEDBDatasetAnnotationCMScoreResult = ({
    dataset,
    groupBy,
    groupType,
    item,
}) => {
    const url = (
        dataset
        && groupBy
        && groupType
        && item
    )
        ? getTIMEDBDatasetAnnotationCMScoreResultURL({
            dataset,
            groupBy,
            groupType,
            item,
        })
        : null;

    return useResult({
        url,
        fallback: {
            dataset,
            groupBy,
            groupType,
            item,
        },
    });
};


export const useSCSTDatasetAnnotationCMScoreOptions = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const url = (
        dataset
        && ["sc", "st"].includes(dataType)
        && groupBy
        && groupValue
    )
        ? getSCSTDatasetAnnotationCMScoreOptionsURL({
            dataset,
            dataType,
            groupBy,
            groupValue,
        })
        : null;

    return useOptions({
        url,
        fallback: {
            dataset,
            dataType,
            groupBy,
            groupValue,
        },
    });
};


export const useSCSTDatasetAnnotationCMScoreResult = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
    item,
}) => {
    const url = (
        dataset
        && ["sc", "st"].includes(dataType)
        && groupBy
        && groupValue
        && item
    )
        ? getSCSTDatasetAnnotationCMScoreResultURL({
            dataset,
            dataType,
            groupBy,
            groupValue,
            item,
        })
        : null;

    return useResult({
        url,
        fallback: {
            dataset,
            dataType,
            groupBy,
            groupValue,
            item,
        },
    });
};
