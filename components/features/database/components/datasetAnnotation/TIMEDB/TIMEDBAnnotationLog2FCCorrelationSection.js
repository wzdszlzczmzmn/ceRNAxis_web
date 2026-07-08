"use client";

import DatasetAnnotationLog2FCCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationLog2FCCorrelationSection";

const TIMEDBAnnotationLog2FCCorrelationSection = ({
    dataset,
    groupBy,
    groupType,
    annotationAvailability,
    height = 620,
}) => {
    return (
        <DatasetAnnotationLog2FCCorrelationSection
            source="TIMEDB"
            dataset={dataset}
            groupBy={groupBy}
            groupType={groupType}
            annotationAvailability={annotationAvailability}
            title="Log2FC Correlation Plot"
            height={height}
        />
    );
};

export default TIMEDBAnnotationLog2FCCorrelationSection;
