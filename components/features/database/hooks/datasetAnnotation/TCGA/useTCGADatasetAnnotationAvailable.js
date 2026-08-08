import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationAvailableURL }
    from "@/lib/api/database/datasetAnnotation";

const TCGA_ANNOTATION_SOURCE = "TCGA";

const EMPTY_VISUALIZATIONS = {};

export const useTCGADatasetAnnotationAvailable = ({
    datasetName,
}) => {
    const shouldFetch = Boolean(datasetName);

    const url = shouldFetch
        ? getDatasetAnnotationAvailableURL({
            source: TCGA_ANNOTATION_SOURCE,
            datasetName,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    const visualizations =
        data?.visualizations ?? EMPTY_VISUALIZATIONS;

    return {
        annotationAvailability: data ?? null,

        source: data?.source ?? TCGA_ANNOTATION_SOURCE,
        datasetName: data?.dataset_name ?? datasetName ?? null,
        available: Boolean(data?.available),
        availableVisualizationCount:
            data?.available_visualization_count ?? 0,

        visualizations,
        annotationNetwork:
            visualizations.annotation_network ?? null,
        axisFinal:
            visualizations.axis_final ?? null,
        cmap:
            visualizations.cmap ?? null,
        volcano:
            visualizations.volcano ?? null,
        log2fcCorrelation:
            visualizations.log2fc_correlation ?? null,
        expCorrelation:
            visualizations.exp_correlation ?? null,
        survival:
            visualizations.survival ?? null,
        degPathway:
            visualizations.deg_pathway ?? null,

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
