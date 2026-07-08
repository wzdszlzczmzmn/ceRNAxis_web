import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationLog2FCCorrelationURL }
    from "@/lib/api/database/datasetAnnotation";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    anti_count: 0,
    same_count: 0,
};

export const useDatasetAnnotationLog2FCCorrelation = ({
    source,
    datasetName,
    interactionType,
    groupBy = null,
    groupType = null,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const shouldFetch = Boolean(
        source
        && datasetName
        && interactionType
        && (!isTIMEDB || (groupBy && groupType))
    );

    const url = shouldFetch
        ? getDatasetAnnotationLog2FCCorrelationURL({
            source,
            datasetName,
            interactionType,
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
        correlationData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,

        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,

        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,

        interactionType: data?.type ?? interactionType ?? null,
        availableTypes: data?.available_types ?? [],
        backgroundFile: data?.background_file ?? null,

        titlePrimary: data?.dataset_name ?? datasetName ?? null,
        titleSecondary: data?.type ?? interactionType ?? null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        points: data?.points ?? [],

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
