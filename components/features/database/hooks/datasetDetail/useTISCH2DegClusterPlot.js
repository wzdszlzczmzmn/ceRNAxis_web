import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getTISCH2DegClusterPlotURL } from "@/lib/api/database/datasetDetail"

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropna_count: 0,
    zero_p_count: 0,
    invalid_p_dropped_count: 0,
    up_count: 0,
    down_count: 0,
    not_count: 0,
    cluster_count: 0,
}

const EMPTY_ZERO_PVALUE_PLOT = {
    count: 0,
    min_positive_pvalue: null,
    max_finite_neg_log10_pvalue: null,
    neg_log10_offset: 1,
    neg_log10_plot_y: null,
    used_fallback: false,
}

const EMPTY_THRESHOLDS = {
    padj_cutoff: 0.05,
    neg_log10_padj_cutoff: 1.30103,
    log2fc_center: 0,
    x_abs_max: 1,
    panel_width: 2,
    panel_gap: 1,
    panel_span: 3,
}

const normalizeTISCH2DegClusterPlotData = data => {
    if (!data) return null

    return {
        ...data,

        summary:
            data.summary ??
            EMPTY_SUMMARY,

        thresholds:
            data.thresholds ??
            EMPTY_THRESHOLDS,

        zero_pvalue_plot:
            data.zero_pvalue_plot ??
            EMPTY_ZERO_PVALUE_PLOT,

        clusters:
            Array.isArray(data.clusters)
                ? data.clusters
                : [],

        points:
            Array.isArray(data.points)
                ? data.points.map(point => ({
                    ...point,
                    is_zero_adjusted_p:
                        Boolean(
                            point.is_zero_adjusted_p
                        ),
                }))
                : [],
    }
}

export const useTISCH2DegClusterPlot = ({
    dataset,
    expressionType,
}) => {
    const shouldFetch = Boolean(dataset && expressionType)

    const url = shouldFetch
        ? getTISCH2DegClusterPlotURL({
            dataset,
            expressionType,
        })
        : null

    const { data, error, isLoading, isValidating, mutate } = useSWR(
        url,
        fetcher,
        {
            keepPreviousData: true,
        }
    )

    const plotData = normalizeTISCH2DegClusterPlotData(data)

    return {
        plotData,

        dataset: plotData?.dataset ?? dataset ?? null,
        rnaType: plotData?.rna_type ?? null,
        expressionMode: plotData?.expression_mode ?? null,
        expressionType: plotData?.expression_type ?? expressionType ?? null,

        summary: plotData?.summary ?? EMPTY_SUMMARY,
        thresholds: plotData?.thresholds ?? EMPTY_THRESHOLDS,
        zeroPvaluePlot: plotData?.zero_pvalue_plot ?? EMPTY_ZERO_PVALUE_PLOT,
        clusters: plotData?.clusters ?? [],
        points: plotData?.points ?? [],

        titlePrimary: plotData?.dataset ?? dataset ?? null,
        titleSecondary: plotData?.expression_type ?? expressionType ?? null,

        isLoading,
        isValidating,
        isError: !!error,
        error,
        mutate,
    }
}
