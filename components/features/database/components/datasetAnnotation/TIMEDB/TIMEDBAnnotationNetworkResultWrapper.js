"use client";

import { useDatasetAnnotationNetworkResult }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationNetworkResult";
import NetworkResultCard from "@/components/features/common/NetworkResult/NetworkResultCard"

const TIMEDBAnnotationNetworkResultWrapper = ({
    dataset,
    groupBy,
    groupType,
}) => {
    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } = useDatasetAnnotationNetworkResult({
        source: "TIMEDB",
        datasetName: dataset,
        groupBy,
        groupType,
    });

    const isAvailable = Boolean(dataset && groupBy && groupType);

    return (
        <NetworkResultCard
            title="ceRNA Annotation Network"
            networkData={networkData}
            isLoading={isNetworkLoading}
            isError={isNetworkError}
            onRefresh={mutateNetwork}
            missingDescription={
                !dataset
                    ? "Missing dataset."
                    : !groupBy || !groupType
                        ? "Missing annotation group type."
                        : null
            }
            isAvailable={isAvailable}
            unavailableDescription="Annotation network requires a valid dataset and annotation group type."
            emptyDescription="No TIMEDB annotation network data found."
        />
    );
};

export default TIMEDBAnnotationNetworkResultWrapper;
