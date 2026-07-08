"use client";

import CMapResultCard
    from "@/components/features/common/CMap/CMapResultCard";
import { useDatasetAnnotationCMapResult }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationCMapResult";

const DatasetAnnotationCMapResultSection = ({
    source,
    dataset,
    groupBy = null,
    groupType = null,
    title = "CMap Results",
    emptyDescription = "No CMap result",
}) => {
    const isTIMEDB = source === "TIMEDB";

    const {
        columns,
        count,
        results,
        isLoading,
        isError,
    } = useDatasetAnnotationCMapResult({
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
            ? "TIMEDB annotation CMap result requires a valid group type."
            : null;

    return (
        <CMapResultCard
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

export default DatasetAnnotationCMapResultSection;
