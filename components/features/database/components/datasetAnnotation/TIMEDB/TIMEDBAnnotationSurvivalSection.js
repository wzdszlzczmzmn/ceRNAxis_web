"use client";

import DatasetAnnotationSurvivalKMSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationSurvivalKMSection";

const TIMEDBAnnotationSurvivalSection = ({
    dataset,
    groupBy,
    groupType,
    height = 620,
}) => {
    return (
        <DatasetAnnotationSurvivalKMSection
            source="TIMEDB"
            dataset={dataset}
            groupBy={groupBy}
            groupType={groupType}
            title="Survival Analysis"
            height={height}
        />
    );
};

export default TIMEDBAnnotationSurvivalSection;
