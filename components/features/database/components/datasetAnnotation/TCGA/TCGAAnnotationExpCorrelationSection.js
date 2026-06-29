"use client";

import DatasetAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationExpCorrelationSection";

const TCGAAnnotationExpCorrelationSection = ({
    dataset,
    height = 620,
}) => {
    return (
        <DatasetAnnotationExpCorrelationSection
            source="TCGA"
            dataset={dataset}
            title="Expression Correlation Plot"
            height={height}
        />
    );
};

export default TCGAAnnotationExpCorrelationSection;
