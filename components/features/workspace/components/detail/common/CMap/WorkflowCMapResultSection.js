"use client";

import CMapResultCard
    from "@/components/features/common/CMap/CMapResultCard";
import { useWorkflowCMapResult }
    from "@/components/features/workspace/hooks/useWorkflowCMapResult";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const WorkflowCMapResultSection = ({
    task,
    title = "CMap Results",
}) => {
    const taskType = task?.task_type;
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const {
        columns,
        count,
        results,
        isLoading,
        isError,
    } = useWorkflowCMapResult({
        taskType,
        taskUUID: isSuccess ? taskUUID : null,
    });

    return (
        <CMapResultCard
            title={title}
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
            missingDescription={!taskUUID ? "Missing task UUID" : null}
            unavailableDescription={
                taskUUID && !isSuccess
                    ? "CMap result is available only after the task succeeds."
                    : null
            }
            emptyDescription="No CMap result"
        />
    );
};

export default WorkflowCMapResultSection;
