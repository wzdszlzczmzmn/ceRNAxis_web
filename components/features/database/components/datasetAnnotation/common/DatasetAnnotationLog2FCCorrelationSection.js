"use client";

import { useMemo } from "react";

import Log2FCCorrelationAnalysisView
    from "@/components/features/common/Log2FCCorrelation/Log2FCCorrelationAnalysisView";
import { useLog2FCCorrelationQueryConfig }
    from "@/components/features/common/Log2FCCorrelation/useLog2FCCorrelationQueryConfig";
import { useDatasetAnnotationLog2FCCorrelation }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationLog2FCCorrelation";

const DEFAULT_BACKGROUND_TYPES_BY_SOURCE = {
    TCGA: [
        "miRNA-mRNA",
        "miRNA-lncRNA",
        "miRNA-circRNA",
    ],
    TIMEDB: [
        "miRNA-mRNA",
        "miRNA-lncRNA",
    ],
};

const DatasetAnnotationLog2FCCorrelationSection = ({
    source,
    dataset,
    groupBy = null,
    groupType = null,
    annotationAvailability,
    title = "Log2FC Correlation Plot",
    height = 620,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const availableBackgroundTypes = useMemo(() => {
        const values = annotationAvailability?.available_background_types;

        if (Array.isArray(values)) {
            return values;
        }

        return DEFAULT_BACKGROUND_TYPES_BY_SOURCE[source] ?? [];
    }, [annotationAvailability, source]);

    const {
        queryConfig,
        setQueryConfig,
    } = useLog2FCCorrelationQueryConfig({
        availableTypes: availableBackgroundTypes,
    });

    const {
        correlationData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = useDatasetAnnotationLog2FCCorrelation({
        source,
        datasetName: dataset,
        interactionType: queryConfig.interactionType,
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
            ? "TIMEDB Log2FC correlation plot requires a valid group type."
            : null;

    return (
        <Log2FCCorrelationAnalysisView
            title={title}
            height={height}
            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}
            correlationData={correlationData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            availableTypes={availableBackgroundTypes}
            isLoading={isLoading}
            isError={isError}
            missingDescription={missingDescription}
            unavailableDescription={unavailableDescription}
        />
    );
};

export default DatasetAnnotationLog2FCCorrelationSection;
