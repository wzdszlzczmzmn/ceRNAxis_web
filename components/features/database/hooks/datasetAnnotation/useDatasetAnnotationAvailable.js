import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationAvailableURL }
    from "@/lib/api/database/datasetAnnotation";

export const useDatasetAnnotationAvailable = ({
    source,
    datasetName,
}) => {
    const shouldFetch = Boolean(source && datasetName);

    const url = shouldFetch
        ? getDatasetAnnotationAvailableURL({
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
        annotationAvailability: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,
        available: Boolean(data?.available),

        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,

        degMethod: data?.deg_method ?? "limma",
        usePadj: data?.use_padj ?? true,
        cutoffs: data?.cutoffs ?? {},

        availableDegRnaTypes: data?.available_deg_rna_types ?? [],
        availableDegScopes: data?.available_deg_scopes ?? [],
        availableBackgroundTypes: data?.available_background_types ?? [],

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
