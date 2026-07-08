import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationExpCorrelationPlotDataURL }
    from "@/lib/api/database/datasetAnnotation";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    has_points: false,
    point_unavailable_reason: "",
};

const EMPTY_CORRELATION = {
    pearson_r: null,
    pearson_p: null,
    spearman_r: null,
    spearman_p: null,
    kendall_tau: null,
    kendall_p: null,
};

const EMPTY_REGRESSION = {
    slope: null,
    intercept: null,
};

export const useDatasetAnnotationExpCorrelationPlotData = ({
    source,
    datasetName,
    gene1,
    gene2,
    type,
    groupBy = null,
    groupType = null,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const shouldFetch = Boolean(
        source
        && datasetName
        && gene1
        && gene2
        && type
        && (!isTIMEDB || (groupBy && groupType))
    );

    const url = shouldFetch
        ? getDatasetAnnotationExpCorrelationPlotDataURL({
            source,
            datasetName,
            gene1,
            gene2,
            type,
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
        plotData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,

        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,

        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,
        tcgaType: data?.tcga_type ?? null,

        type: data?.type ?? type ?? null,
        gene1: data?.gene1 ?? gene1 ?? null,
        gene2: data?.gene2 ?? gene2 ?? null,
        correlationFile: data?.correlation_file ?? null,
        gene1ExpressionFile: data?.gene1_expression_file ?? null,
        gene2ExpressionFile: data?.gene2_expression_file ?? null,

        titlePrimary: data?.dataset_name ?? datasetName ?? null,
        titleSecondary:
            data?.gene1 && data?.gene2 && data?.type
                ? `${data.gene1} vs ${data.gene2} (${data.type})`
                : gene1 && gene2 && type
                    ? `${gene1} vs ${gene2} (${type})`
                    : null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        correlation: data?.correlation ?? EMPTY_CORRELATION,
        regression: data?.regression ?? EMPTY_REGRESSION,
        points: data?.points ?? [],

        meta: {
            source: data?.source,
            networkSourceTaskType: data?.network_source_task_type,
            tcgaType: data?.tcga_type,
            gene1ExpressionFile: data?.gene1_expression_file,
            gene2ExpressionFile: data?.gene2_expression_file,
            groupBy: data?.group_by ?? groupBy ?? null,
            groupType: data?.group_type ?? groupType ?? null,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
