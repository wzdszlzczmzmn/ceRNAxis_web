import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationExpCorrelationOptionsURL }
    from "@/lib/api/database/datasetAnnotation";

export const useDatasetAnnotationExpCorrelationOptions = ({
    source,
    datasetName,
}) => {
    const shouldFetch = Boolean(source && datasetName);

    const url = shouldFetch
        ? getDatasetAnnotationExpCorrelationOptionsURL({
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
        optionsData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,
        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,
        tcgaType: data?.tcga_type ?? null,

        correlationFile: data?.correlation_file ?? null,
        validTypes: data?.valid_types ?? [],
        availableTypes: data?.available_types ?? [],
        count: data?.count ?? 0,
        results: data?.results ?? [],

        meta: {
            source: data?.source,
            networkSourceTaskType: data?.network_source_task_type,
            tcgaType: data?.tcga_type,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
