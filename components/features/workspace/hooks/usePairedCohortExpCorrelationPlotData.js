import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortExpCorrelationPlotDataURL } from "@/lib/api/analysis";

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
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

export const usePairedCohortExpCorrelationPlotData = ({
    taskUUID,
    gene1,
    gene2,
    type,
}) => {
    const url = getPairedCohortExpCorrelationPlotDataURL({
        taskUUID,
        gene1,
        gene2,
        type,
    });

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        plotData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        type: data?.type ?? type ?? null,
        gene1: data?.gene1 ?? gene1 ?? null,
        gene2: data?.gene2 ?? gene2 ?? null,
        correlationFile: data?.correlation_file ?? null,

        summary: data?.summary ?? EMPTY_SUMMARY,
        correlation: data?.correlation ?? EMPTY_CORRELATION,
        regression: data?.regression ?? EMPTY_REGRESSION,
        points: data?.points ?? [],

        isLoading,
        isError: error,
        mutate,
    };
};
