"use client";

import DatasetAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationDEGPathwaySection";

const TIMEDBAnnotationDEGPathwaySection = ({
    dataset,
    groupBy,
    groupType,
    height = 680,
}) => {
    return (
        <DatasetAnnotationDEGPathwaySection
            source="TIMEDB"
            dataset={dataset}
            groupBy={groupBy}
            groupType={groupType}
            title="DEG Pathway Enrichment Plot"
            height={height}
        />
    );
};

export default TIMEDBAnnotationDEGPathwaySection;
