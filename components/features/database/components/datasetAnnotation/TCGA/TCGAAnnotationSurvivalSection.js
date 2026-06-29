"use client";

import DatasetAnnotationSurvivalKMSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationSurvivalKMSection";

const TCGAAnnotationSurvivalSection = ({
    dataset,
    height = 620,
}) => {
    return (
        <DatasetAnnotationSurvivalKMSection
            source="TCGA"
            dataset={dataset}
            title="Survival Analysis"
            height={height}
        />
    );
};

export default TCGAAnnotationSurvivalSection;
