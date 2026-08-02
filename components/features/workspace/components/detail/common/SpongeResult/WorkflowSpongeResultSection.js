"use client";

import SpongeResultCard
    from "@/components/features/common/SpongeResult/SpongeResultCard";

import { useWorkflowSpongeResult }
    from "@/components/features/workspace/hooks/useWorkflowSpongeResult";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";


const WorkflowSpongeResultSection = ({
    task,
    title = "Sponge Results",
}) => {
    const taskType = task?.task_type;
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
        isLoading,
        isError,
    } = useWorkflowSpongeResult({
        taskType,
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
            title={title}
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
            emptyDescription={
                "No Sponge result"
            }
        />
    );
};


export default WorkflowSpongeResultSection;
