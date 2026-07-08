import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationExpCorrelationOptionsURL }
    from "@/lib/api/database/datasetAnnotation";

export const useDatasetAnnotationExpCorrelationOptions = ({
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
        ? getDatasetAnnotationExpCorrelationOptionsURL({
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
        optionsData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,

        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,

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
            groupBy: data?.group_by ?? groupBy ?? null,
            groupType: data?.group_type ?? groupType ?? null,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
