import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getCustomListQueryEnrichrResultURL,
} from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    returned_count: 0,
};

export const useCustomListQueryEnrichr = ({
    taskUUID,
    direction,
}) => {
    const shouldFetch = Boolean(
        taskUUID &&
        ["up", "down"].includes(direction)
    );

    const url = shouldFetch
        ? getCustomListQueryEnrichrResultURL({
            taskUUID,
            direction,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        enrichrData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskType: data?.task_type ?? null,
        taskName: data?.task_name ?? null,
        cancerType: data?.cancer_type ?? null,
        hasMrnaDirection:
            data?.has_mrna_direction ?? false,

        direction:
            data?.direction ?? direction ?? null,

        enrichrFile:
            data?.enrichr_file ?? null,

        plot: data?.plot ?? {
            chart_type: "bar",
            orientation: "horizontal",
            x_field: "combined_score",
            y_field: "term",
        },

        summary:
            data?.summary ?? EMPTY_SUMMARY,

        results: Array.isArray(data?.results)
            ? data.results
            : [],

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
