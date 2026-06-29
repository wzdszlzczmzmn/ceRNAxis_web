"use client";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import { useHybridReferenceTaskNetworkResult }
    from "@/components/features/workspace/hooks/useHybridReferenceTaskNetworkResult";
import NetworkResultCard from "@/components/features/common/NetworkResult/NetworkResultCard"

const HybridReferenceNetworkResultWrapper = ({
    task,
}) => {
    const data = getTaskData(task);

    const taskUUID = data.uuid;
    const isSuccess = isTaskSuccess(data.status);

    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } = useHybridReferenceTaskNetworkResult(isSuccess ? taskUUID : null);

    return (
        <NetworkResultCard
            title="ceRNA Network"
            networkData={networkData}
            isLoading={isNetworkLoading}
            isError={isNetworkError}
            onRefresh={mutateNetwork}
            missingDescription={!taskUUID ? "Missing task UUID." : null}
            isAvailable={isSuccess}
            unavailableDescription="Network result is available only after the task succeeds."
            emptyDescription="No network result data found."
        />
    );
};

export default HybridReferenceNetworkResultWrapper;
