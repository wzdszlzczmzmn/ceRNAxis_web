"use client";

import DatasetAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationCMapResultSection";

const TIMEDBAnnotationCMapResultSection = ({
    dataset,
    groupBy,
    groupType,
}) => {
    return (
        <DatasetAnnotationCMapResultSection
            source="TIMEDB"
            dataset={dataset}
            groupBy={groupBy}
            groupType={groupType}
            title="CMap Results"
            emptyDescription="No TIMEDB annotation CMap result"
        />
    );
};

export default TIMEDBAnnotationCMapResultSection;
