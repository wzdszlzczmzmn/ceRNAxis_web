"use client";

import { useDatasetAnnotationNetworkResult }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationNetworkResult";
import NetworkResultCard from "@/components/features/common/NetworkResult/NetworkResultCard"

const TCGAAnnotationNetworkResultWrapper = ({
    dataset,
}) => {
    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } = useDatasetAnnotationNetworkResult({
        source: "TCGA",
        datasetName: dataset,
    });

    return (
        <NetworkResultCard
            title="ceRNA Annotation Network"
            networkData={networkData}
            isLoading={isNetworkLoading}
            isError={isNetworkError}
            onRefresh={mutateNetwork}
            missingDescription={!dataset ? "Missing dataset." : null}
            isAvailable={Boolean(dataset)}
            unavailableDescription="Annotation network requires a valid dataset."
            emptyDescription="No TCGA annotation network data found."
        />
    );
};

export default TCGAAnnotationNetworkResultWrapper;
