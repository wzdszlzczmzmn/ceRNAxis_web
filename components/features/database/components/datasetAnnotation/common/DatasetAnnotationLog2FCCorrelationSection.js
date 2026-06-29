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
    annotationAvailability,
    title = "Log2FC Correlation Plot",
    height = 620,
}) => {
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
    });

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
            missingDescription={!dataset ? "Missing dataset" : null}
            unavailableDescription={
                dataset && !source
                    ? "Missing annotation source."
                    : null
            }
        />
    );
};

export default DatasetAnnotationLog2FCCorrelationSection;
