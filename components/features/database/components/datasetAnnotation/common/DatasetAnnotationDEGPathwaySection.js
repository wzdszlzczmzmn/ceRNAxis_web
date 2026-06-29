"use client";

import DEGPathwayAnalysisView
    from "@/components/features/common/DEGPathway/DEGPathwayAnalysisView";
import { useDatasetAnnotationDEGPathway }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationDEGPathway";

const EMPTY_DESCRIPTION_BY_SOURCE = {
    TCGA: "No TCGA annotation DEG pathway enrichment data",
    TIMEDB: "No TIMEDB annotation DEG pathway enrichment data",
};

const DatasetAnnotationDEGPathwaySection = ({
    source,
    dataset,
    title = "DEG Pathway Enrichment Plot",
    height = 680,
}) => {
    const {
        pathwayData,
        title: pathwayTitle,
        summary,
        isLoading,
        isError,
    } = useDatasetAnnotationDEGPathway({
        source,
        datasetName: dataset,
    });

    return (
        <DEGPathwayAnalysisView
            title={title}
            height={height}
            pathwayData={pathwayData}
            pathwayTitle={pathwayTitle}
            summary={summary}
            isLoading={isLoading}
            isError={isError}
            missingDescription={!dataset ? "Missing dataset" : null}
            unavailableDescription={
                dataset && !source
                        ? "Missing annotation source."
                        : null
            }
            emptyDescription={
                EMPTY_DESCRIPTION_BY_SOURCE[source] ??
                "No DEG pathway enrichment data"
            }
            showTcgaBasedTag={source === "TIMEDB"}
            tcgaBasedTooltip="DEG pathway enrichment is based on TCGA reference data."
        />
    );
};

export default DatasetAnnotationDEGPathwaySection;
