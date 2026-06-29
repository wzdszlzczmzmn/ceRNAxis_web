"use client";

import DatasetAnnotationVolcanoAnalysisSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationVolcanoAnalysisSection";

const TIMEDBAnnotationVolcanoAnalysisSection = ({
    dataset,
    annotationAvailability,
    height = 620,
}) => {
    return (
        <DatasetAnnotationVolcanoAnalysisSection
            source="TIMEDB"
            dataset={dataset}
            annotationAvailability={annotationAvailability}
            title="Expression Volcano Plot"
            height={height}
            showDegScopeSelect
        />
    );
};

export default TIMEDBAnnotationVolcanoAnalysisSection;
