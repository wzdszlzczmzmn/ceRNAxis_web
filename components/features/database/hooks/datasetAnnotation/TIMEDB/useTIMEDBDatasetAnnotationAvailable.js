import { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationAvailableURL }
    from "@/lib/api/database/datasetAnnotation";

const TIMEDB_ANNOTATION_SOURCE = "TIMEDB";

const normalizeGroup = group => {
    const visualizations = group?.visualizations ?? {};

    return {
        ...group,
        groupType: group?.group_type ?? null,
        availableVisualizationCount:
            group?.available_visualization_count ?? 0,
        visualizations,
    };
};

export const useTIMEDBDatasetAnnotationAvailable = ({
    datasetName,
}) => {
    const shouldFetch = Boolean(datasetName);

    const url = shouldFetch
        ? getDatasetAnnotationAvailableURL({
            source: TIMEDB_ANNOTATION_SOURCE,
            datasetName,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    const groups = useMemo(() => {
        return Array.isArray(data?.groups)
            ? data.groups.map(normalizeGroup)
            : [];
    }, [data?.groups]);

    return {
        annotationAvailability: data ?? null,

        source: data?.source ?? TIMEDB_ANNOTATION_SOURCE,
        datasetName: data?.dataset_name ?? datasetName ?? null,
        available: Boolean(data?.available),
        availableGroupCount:
            data?.available_group_count ?? groups.length,
        defaultGroupBy: data?.default_group_by ?? null,

        groups,
        groupByOptions: groups,

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
