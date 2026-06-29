"use client";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import { useDatasetAnnotationAxisFinal }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationAxisFinal";

const DatasetAnnotationAxisFinalSection = ({
    source,
    dataset,
    title = "ceRNA Axis Final Results",
    emptyDescription = "No ceRNA axis final result",
}) => {
    const {
        count,
        columns,
        results,
        isLoading,
        isError,
    } = useDatasetAnnotationAxisFinal({
        source,
        datasetName: dataset,
    });

    return (
        <AxisFinalResultCard
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

export default DatasetAnnotationAxisFinalSection;
