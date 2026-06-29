"use client";

import DatasetAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationExpCorrelationSection";

const TIMEDBAnnotationExpCorrelationSection = ({
    dataset,
    height = 620,
}) => {
    return (
        <DatasetAnnotationExpCorrelationSection
            source="TIMEDB"
            dataset={dataset}
            title="Expression Correlation Plot"
            height={height}
        />
    );
};

export default TIMEDBAnnotationExpCorrelationSection;
