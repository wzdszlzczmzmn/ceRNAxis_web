"use client";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import { useDatasetAnnotationAxisFinal }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationAxisFinal";

const DatasetAnnotationAxisFinalSection = ({
    source,
    dataset,
    groupBy = null,
    groupType = null,
    title = "ceRNA Axis Final Results",
    emptyDescription = "No ceRNA axis final result",
}) => {
    const isTIMEDB = source === "TIMEDB";

    const {
        count,
        columns,
        results,
        isLoading,
        isError,
    } = useDatasetAnnotationAxisFinal({
        source,
        datasetName: dataset,
        groupBy,
        groupType,
    });

    const missingDescription = !dataset
        ? "Missing dataset"
        : isTIMEDB && (!groupBy || !groupType)
            ? "Missing annotation group type."
            : null;

    const unavailableDescription = dataset && !source
        ? "Missing annotation source."
        : isTIMEDB && (!groupBy || !groupType)
            ? "TIMEDB annotation axis final result requires a valid group type."
            : null;

    return (
        <AxisFinalResultCard
            title={title}
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
            missingDescription={missingDescription}
            unavailableDescription={unavailableDescription}
            emptyDescription={emptyDescription}
        />
    );
};

export default DatasetAnnotationAxisFinalSection;
