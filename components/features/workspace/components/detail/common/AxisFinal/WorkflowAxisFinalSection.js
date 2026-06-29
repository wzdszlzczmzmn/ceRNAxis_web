"use client";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import { useWorkflowAxisFinal }
    from "@/components/features/workspace/hooks/useWorkflowAxisFinal";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const WorkflowAxisFinalSection = ({
    task,
    title = "ceRNA Axis Final Results",
}) => {
    const taskType = task?.task_type;
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const {
        count,
        columns,
        results,
        isLoading,
        isError,
    } = useWorkflowAxisFinal({
        taskType,
        taskUUID: isSuccess ? taskUUID : null,
    });

    return (
        <AxisFinalResultCard
            title={title}
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
            missingDescription={!taskUUID ? "Missing task UUID" : null}
            unavailableDescription={
                taskUUID && !isSuccess
                    ? "ceRNA axis final result is available only after the task succeeds."
                    : null
            }
            emptyDescription="No ceRNA axis final result"
        />
    );
};

export default WorkflowAxisFinalSection;
