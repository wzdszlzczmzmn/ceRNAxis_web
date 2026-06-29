"use client";

import DatasetAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationAxisFinalSection";

const TCGAAnnotationAxisFinalSection = ({
    dataset,
}) => {
    return (
        <DatasetAnnotationAxisFinalSection
            source="TCGA"
            dataset={dataset}
            title="ceRNA Axis Final Results"
            emptyDescription="No TCGA annotation axis final result"
        />
    );
};

export default TCGAAnnotationAxisFinalSection;
