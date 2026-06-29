"use client";

import DatasetAnnotationSurvivalKMSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationSurvivalKMSection";

const TIMEDBAnnotationSurvivalSection = ({
    dataset,
    height = 620,
}) => {
    return (
        <DatasetAnnotationSurvivalKMSection
            source="TIMEDB"
            dataset={dataset}
            title="Survival Analysis"
            height={height}
        />
    );
};

export default TIMEDBAnnotationSurvivalSection;
