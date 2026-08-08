import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getTIMEDBDatasetAnnotationSpongeURL,
} from "@/lib/api/database/datasetAnnotation";


export const useTIMEDBDatasetAnnotationSpongeResult = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    const shouldFetch = Boolean(
        datasetName
        && groupBy
        && groupType
    );

    const url = shouldFetch
        ? getTIMEDBDatasetAnnotationSpongeURL({
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
    } = useSWR(
        url,
        fetcher,
    );

    return {
        source: data?.source ?? "TIMEDB",
        datasetName: data?.dataset_name ?? datasetName ?? null,
        groupBy: data?.group_by ?? groupBy ?? null,
        groupType: data?.group_type ?? groupType ?? null,
        networkSourceTaskType:
            data?.network_source_task_type ?? null,

        spongeFile: data?.sponge_file ?? null,
        count: data?.count ?? 0,
        columns: Array.isArray(data?.columns)
            ? data.columns
            : [],
        summary: data?.summary ?? null,
        results: Array.isArray(data?.results)
            ? data.results
            : [],

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
