"use client";

import DatasetAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationAxisFinalSection";

const TIMEDBAnnotationAxisFinalSection = ({
    dataset,
    groupBy,
    groupType,
}) => {
    return (
        <DatasetAnnotationAxisFinalSection
            source="TIMEDB"
            dataset={dataset}
            groupBy={groupBy}
            groupType={groupType}
            title="ceRNA Axis Final Results"
            emptyDescription="No TIMEDB annotation axis final result"
        />
    );
};

export default TIMEDBAnnotationAxisFinalSection;
