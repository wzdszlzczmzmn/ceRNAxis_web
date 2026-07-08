"use client";

import DatasetAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationExpCorrelationSection";

const TIMEDBAnnotationExpCorrelationSection = ({
    dataset,
    groupBy,
    groupType,
    height = 620,
}) => {
    return (
        <DatasetAnnotationExpCorrelationSection
            source="TIMEDB"
            dataset={dataset}
            groupBy={groupBy}
            groupType={groupType}
            title="Expression Correlation Plot"
            height={height}
        />
    );
};

export default TIMEDBAnnotationExpCorrelationSection;
