import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationCMapURL } from "@/lib/api/database/datasetAnnotation"

export const useDatasetAnnotationCMapResult = ({
    source,
    datasetName,
}) => {
    const shouldFetch = Boolean(source && datasetName);

    const url = shouldFetch
        ? getDatasetAnnotationCMapURL({
            source,
            datasetName,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        cmapData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,
        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,

        cmapFile: data?.cmap_file ?? null,
        columns: data?.columns ?? [],
        summary: data?.summary ?? {},
        count: data?.summary?.raw_count ?? data?.results?.length ?? 0,
        results: data?.results ?? [],

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
