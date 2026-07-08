import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationSurvivalKMURL }
    from "@/lib/api/database/datasetAnnotation";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    group_count: 0,
    logrank_p: null,
};

export const useDatasetAnnotationSurvivalKM = ({
    source,
    datasetName,
    groupBy = null,
    groupType = null,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const shouldFetch = Boolean(
        source
        && datasetName
        && (!isTIMEDB || (groupBy && groupType))
    );

    const url = shouldFetch
        ? getDatasetAnnotationSurvivalKMURL({
            source,
            datasetName,
            groupBy,
            groupType,
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

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,

        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,

        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,
        survivalFile: data?.survival_file ?? null,

        title: data?.title ?? "ceRNA axis-based survival analysis",
        titlePrimary: data?.dataset_name ?? datasetName ?? null,
        titleSecondary: data?.survival_file ?? null,

        xLabel: data?.x_label ?? "Time days",
        yLabel: data?.y_label ?? "Overall survival probability",

        summary: data?.summary ?? EMPTY_SUMMARY,
        groups: data?.groups ?? [],

        meta: {
            source: data?.source,
            networkSourceTaskType: data?.network_source_task_type,
            groupBy: data?.group_by ?? groupBy ?? null,
            groupType: data?.group_type ?? groupType ?? null,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
