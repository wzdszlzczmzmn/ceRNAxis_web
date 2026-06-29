"use client";

import DatasetAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationCMapResultSection";

const TIMEDBAnnotationCMapResultSection = ({
    dataset,
}) => {
    return (
        <DatasetAnnotationCMapResultSection
            source="TIMEDB"
            dataset={dataset}
            title="CMap Results"
            emptyDescription="No TIMEDB annotation CMap result"
        />
    );
};

export default TIMEDBAnnotationCMapResultSection;
