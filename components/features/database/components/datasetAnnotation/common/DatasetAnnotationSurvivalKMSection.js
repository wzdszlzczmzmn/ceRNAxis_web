"use client";

import SurvivalKMAnalysisView
    from "@/components/features/common/SurvivalKM/SurvivalKMAnalysisView";
import { useDatasetAnnotationSurvivalKM }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationSurvivalKM";

const EMPTY_DESCRIPTION_BY_SOURCE = {
    TCGA: "No TCGA annotation survival analysis data",
    TIMEDB: "No TIMEDB annotation survival analysis data",
};

const DatasetAnnotationSurvivalKMSection = ({
    source,
    dataset,
    groupBy = null,
    groupType = null,
    title = "Survival Analysis",
    height = 620,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const {
        survivalData,
        titlePrimary,
        titleSecondary,
        summary,
        isLoading,
        isError,
    } = useDatasetAnnotationSurvivalKM({
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
            ? "TIMEDB survival analysis requires a valid group type."
            : null;

    return (
        <SurvivalKMAnalysisView
            title={title}
            height={height}
            survivalData={survivalData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            summary={summary}
            isLoading={isLoading}
            isError={isError}
            missingDescription={missingDescription}
            unavailableDescription={unavailableDescription}
            emptyDescription={
                EMPTY_DESCRIPTION_BY_SOURCE[source] ??
                "No survival analysis data"
            }
            showTcgaBasedTag={source === "TIMEDB"}
            tcgaBasedTooltip="Survival grouping and Kaplan-Meier analysis are based on TCGA reference survival data."
        />
    );
};

export default DatasetAnnotationSurvivalKMSection;
