"use client";

import DatasetAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationDEGPathwaySection";

const TIMEDBAnnotationDEGPathwaySection = ({
    dataset,
    height = 680,
}) => {
    return (
        <DatasetAnnotationDEGPathwaySection
            source="TIMEDB"
            dataset={dataset}
            title="DEG Pathway Enrichment Plot"
            height={height}
        />
    );
};

export default TIMEDBAnnotationDEGPathwaySection;
