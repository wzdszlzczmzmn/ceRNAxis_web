"use client";

import DatasetAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationAxisFinalSection";

const TIMEDBAnnotationAxisFinalSection = ({
    dataset,
}) => {
    return (
        <DatasetAnnotationAxisFinalSection
            source="TIMEDB"
            dataset={dataset}
            title="ceRNA Axis Final Results"
            emptyDescription="No TIMEDB annotation axis final result"
        />
    );
};

export default TIMEDBAnnotationAxisFinalSection;
