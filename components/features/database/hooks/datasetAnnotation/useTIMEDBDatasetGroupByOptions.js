import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getTIMEDBDatasetGroupByOptionsURL }
    from "@/lib/api/database/datasetAnnotation";

export const useTIMEDBDatasetGroupByOptions = ({
    datasetName,
}) => {
    const shouldFetch = Boolean(datasetName);

    const url = shouldFetch
        ? getTIMEDBDatasetGroupByOptionsURL({
            datasetName,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    const results = Array.isArray(data?.results)
        ? data.results
        : [];

    const defaultGroupBy = data?.default_group_by ?? results[0]?.value ?? null;

    return {
        groupByOptionsData: data ?? null,

        success: Boolean(data?.success),
        source: data?.source ?? "TIMEDB",
        datasetName: data?.dataset_name ?? datasetName ?? null,

        count: data?.count ?? results.length,
        defaultGroupBy,
        results,

        options: results.map((item) => ({
            value: item.value,
            label: item.label,
            groupType: item.group_type,
            source: item.source,
            annotationDirName: item.annotation_dir_name,
            filePrefix: item.file_prefix,
            available: Boolean(item.available),
            visualizations: item.visualizations ?? {},
            availableVisualizationCount: item.available_visualization_count ?? 0,
        })),

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
