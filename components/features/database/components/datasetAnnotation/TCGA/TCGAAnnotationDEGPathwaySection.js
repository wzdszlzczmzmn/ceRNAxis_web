"use client";

import DatasetAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationDEGPathwaySection";

const TCGAAnnotationDEGPathwaySection = ({
    dataset,
    height = 680,
}) => {
    return (
        <DatasetAnnotationDEGPathwaySection
            source="TCGA"
            dataset={dataset}
            title="DEG Pathway Enrichment Plot"
            height={height}
        />
    );
};

export default TCGAAnnotationDEGPathwaySection;
