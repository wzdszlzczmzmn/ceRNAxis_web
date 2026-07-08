import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationAxisFinalURL }
    from "@/lib/api/database/datasetAnnotation";

export const useDatasetAnnotationAxisFinal = ({
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
        ? getDatasetAnnotationAxisFinalURL({
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
        axisFinalData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,

        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,

        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,

        axisFinalFile: data?.axis_final_file,
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
