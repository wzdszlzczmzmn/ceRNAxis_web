"use client";

import CMapResultCard
    from "@/components/features/common/CMap/CMapResultCard";
import { useDatasetAnnotationCMapResult }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationCMapResult";

const DatasetAnnotationCMapResultSection = ({
    source,
    dataset,
    title = "CMap Results",
    emptyDescription = "No CMap result",
}) => {
    const {
        columns,
        count,
        results,
        isLoading,
        isError,
    } = useDatasetAnnotationCMapResult({
        source,
        datasetName: dataset,
    });

    return (
        <CMapResultCard
            title={title}
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
            missingDescription={!dataset ? "Missing dataset" : null}
            unavailableDescription={
                dataset && !source
                    ? "Missing annotation source."
                    : null
            }
            emptyDescription={emptyDescription}
        />
    );
};

export default DatasetAnnotationCMapResultSection;
