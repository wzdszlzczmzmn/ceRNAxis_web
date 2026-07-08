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
    groupBy = null,
    groupType = null,
    title = "DEG Pathway Enrichment Plot",
    height = 680,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const {
        pathwayData,
        title: pathwayTitle,
        summary,
        isLoading,
        isError,
    } = useDatasetAnnotationDEGPathway({
        source,
        datasetName: dataset,
        groupBy,
        groupType,
    });

    const missingDescription = !dataset
        ? "Missing dataset"
        : isTIMEDB && (!groupBy || !groupType)
            ? "Missing annotation group type."
            : null;

    const unavailableDescription = dataset && !source
        ? "Missing annotation source."
        : isTIMEDB && (!groupBy || !groupType)
            ? "TIMEDB DEG pathway enrichment requires a valid group type."
            : null;

    return (
        <DEGPathwayAnalysisView
            title={title}
            height={height}
            pathwayData={pathwayData}
            pathwayTitle={pathwayTitle}
            summary={summary}
            isLoading={isLoading}
            isError={isError}
            missingDescription={missingDescription}
            unavailableDescription={unavailableDescription}
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
