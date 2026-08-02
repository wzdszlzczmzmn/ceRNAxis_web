import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getHybridReferenceExpCorrelationPlotDataURL,
} from "@/lib/api/analysis";


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


export const useHybridReferenceExpCorrelationPlotData = ({
    taskUUID,
    gene1,
    gene2,
    type,
}) => {
    const shouldFetch = Boolean(
        taskUUID &&
        gene1 &&
        gene2 &&
        type
    );

    const url = shouldFetch
        ? getHybridReferenceExpCorrelationPlotDataURL({
            taskUUID,
            gene1,
            gene2,
            type,
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

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,

        type: data?.type ?? type ?? null,
        gene1: data?.gene1 ?? gene1 ?? null,
        gene2: data?.gene2 ?? gene2 ?? null,

        correlationFile: data?.correlation_file ?? null,

        titlePrimary:
            data?.task_name ??
            taskUUID ??
            null,

        titleSecondary:
            data?.gene1 &&
            data?.gene2 &&
            data?.type
                ? `${data.gene1} vs ${data.gene2} (${data.type})`
                : gene1 && gene2 && type
                    ? `${gene1} vs ${gene2} (${type})`
                    : null,

        summary:
            data?.summary ??
            EMPTY_SUMMARY,

        correlation:
            data?.correlation ??
            EMPTY_CORRELATION,

        regression:
            data?.regression ??
            EMPTY_REGRESSION,

        points:
            data?.points ??
            [],

        meta: {
            mapInfo: data?.map_info,
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
            degMethod: data?.deg_method,
            usePadj: data?.use_padj,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
