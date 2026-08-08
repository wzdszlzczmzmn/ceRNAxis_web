"use client";

import SpongeResultCard
    from "@/components/features/common/SpongeResult/SpongeResultCard";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useHybridReferenceSpongeResult
} from "@/components/features/workspace/hooks/Sponge/useHybridReferenceSpongeResult"


const HybridReferenceSpongeResultSection = ({
    task,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData?.uuid;
    const isSuccess = isTaskSuccess(
        taskData?.status
    );

    const {
        count,
        columns,
        summary,
        results,
        projectMatchEnabled,
        isLoading,
        isError,
    } = useHybridReferenceSpongeResult({
        taskUUID: isSuccess
            ? taskUUID
            : null,
    });

    const missingDescription = !taskUUID
        ? "Missing task UUID"
        : null;

    const unavailableDescription =
        taskUUID && !isSuccess
            ? (
                "Sponge result is available only " +
                "after the task succeeds."
            )
            : null;

    return (
        <SpongeResultCard
            title="Sponge Results"
            count={count}
            columns={columns}
            summary={summary}
            results={results}
            isLoading={isLoading}
            isError={isError}
            missingDescription={
                missingDescription
            }
            unavailableDescription={
                unavailableDescription
            }
            emptyDescription="No Sponge result"
            showProjectMatches={
                projectMatchEnabled
            }
        />
    );
};


export default HybridReferenceSpongeResultSection;
