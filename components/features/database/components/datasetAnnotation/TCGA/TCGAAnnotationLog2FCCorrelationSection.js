"use client";

import DatasetAnnotationLog2FCCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationLog2FCCorrelationSection";

const TCGAAnnotationLog2FCCorrelationSection = ({
    dataset,
    annotationAvailability,
    height = 620,
}) => {
    return (
        <DatasetAnnotationLog2FCCorrelationSection
            source="TCGA"
            dataset={dataset}
            annotationAvailability={annotationAvailability}
            title="Log2FC Correlation Plot"
            height={height}
        />
    );
};

export default TCGAAnnotationLog2FCCorrelationSection;
