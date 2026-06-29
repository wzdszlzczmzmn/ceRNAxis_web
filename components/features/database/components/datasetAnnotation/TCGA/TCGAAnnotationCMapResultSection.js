"use client";

import DatasetAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationCMapResultSection";

const TCGAAnnotationCMapResultSection = ({
    dataset,
}) => {
    return (
        <DatasetAnnotationCMapResultSection
            source="TCGA"
            dataset={dataset}
            title="CMap Results"
            emptyDescription="No TCGA annotation CMap result"
        />
    );
};

export default TCGAAnnotationCMapResultSection;
