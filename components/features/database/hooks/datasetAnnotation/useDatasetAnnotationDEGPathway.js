import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationDEGPathwayURL }
    from "@/lib/api/database/datasetAnnotation";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
};

export const useDatasetAnnotationDEGPathway = ({
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
        ? getDatasetAnnotationDEGPathwayURL({
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
        pathwayData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,

        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,

        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,

        gseaFile: data?.gsea_file ?? null,
        title: data?.title ?? "DEG Pathway Enrichment",

        xField: data?.x_field ?? "NES",
        yField: data?.y_field ?? "Term",
        sizeField: data?.size_field ?? "neg_log10_fdr_qval",

        summary: data?.summary ?? EMPTY_SUMMARY,
        results: data?.results ?? [],

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
