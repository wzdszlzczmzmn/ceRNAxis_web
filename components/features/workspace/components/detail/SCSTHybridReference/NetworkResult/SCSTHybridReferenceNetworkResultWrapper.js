"use client";

import {
    useEffect, useMemo,
    useState,
} from "react";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceTaskNetworkResult,
} from "@/components/features/workspace/hooks/useSCSTHybridReferenceTaskNetworkResult";
import NetworkResultCard
    from "@/components/features/common/NetworkResult/NetworkResultCard";
import SCSTHybridReferenceNetworkGroupSelector
    from "./SCSTHybridReferenceNetworkGroupSelector";


const SCSTHybridReferenceNetworkResultWrapper = ({
    task,
    vizInfo,
}) => {
    const data = getTaskData(task);
    const taskUUID = data.uuid;
    const isSuccess = isTaskSuccess(data.status);

    const groupOptions = useMemo(
        () => (
            vizInfo?.groupInfo?.groupOptions
            ?? []
        ),
        [
            vizInfo?.groupInfo?.groupOptions,
        ]
    );

    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        if (
            groupOptions.length > 0
            && !selectedGroup
        ) {
            setSelectedGroup(
                groupOptions[0].value
            );
        }

    }, [
        groupOptions,
    ]);

    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } =
        useSCSTHybridReferenceTaskNetworkResult({
            taskUUID:
                isSuccess
                    ? taskUUID
                    : null,
            groupValue:
            selectedGroup,
        });


    return (
        <NetworkResultCard
            title="ceRNA Network"
            titleExtra={
                <SCSTHybridReferenceNetworkGroupSelector
                    groupOptions={groupOptions}
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                />
            }
            networkData={networkData}
            isLoading={isNetworkLoading}
            isError={isNetworkError}
            onRefresh={mutateNetwork}
            missingDescription={
                !taskUUID
                    ? "Missing task UUID."
                    : null
            }
            isAvailable={isSuccess}
            unavailableDescription={"Network result is available only after the task succeeds."}
            emptyDescription={"No network result data found."}
        />
    );
};


export default SCSTHybridReferenceNetworkResultWrapper;
