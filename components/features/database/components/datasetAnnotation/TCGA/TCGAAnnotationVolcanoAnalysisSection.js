"use client";

import DatasetAnnotationVolcanoAnalysisSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationVolcanoAnalysisSection";

const TCGAAnnotationVolcanoAnalysisSection = ({
    dataset,
    annotationAvailability,
    height = 620,
}) => {
    return (
        <DatasetAnnotationVolcanoAnalysisSection
            source="TCGA"
            dataset={dataset}
            annotationAvailability={annotationAvailability}
            title="Expression Volcano Plot"
            height={height}
            showDegScopeSelect={false}
        />
    );
};

export default TCGAAnnotationVolcanoAnalysisSection;
