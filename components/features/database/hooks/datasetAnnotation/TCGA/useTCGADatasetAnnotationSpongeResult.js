import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getTCGADatasetAnnotationSpongeURL,
} from "@/lib/api/database/datasetAnnotation";


export const useTCGADatasetAnnotationSpongeResult = ({
    datasetName,
}) => {
    const url = datasetName
        ? getTCGADatasetAnnotationSpongeURL({
            datasetName,
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
        source: data?.source ?? "TCGA",
        datasetName: data?.dataset_name ?? datasetName ?? null,
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
