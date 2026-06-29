"use client";

import SurvivalKMAnalysisView
    from "@/components/features/common/SurvivalKM/SurvivalKMAnalysisView";
import { useWorkflowSurvivalKM }
    from "@/components/features/workspace/hooks/useWorkflowSurvivalKM";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const EMPTY_DESCRIPTION_BY_TASK_TYPE = {
    PairedCohortTask: "No survival analysis data",
    HybridReferenceTask: "No hybrid reference survival analysis data",
};

const WorkflowSurvivalKMSection = ({
    task,
    title = "Survival Analysis",
    height = 620,
}) => {
    const taskType = task?.task_type;
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);
    const isHybridReferenceTask = taskType === "HybridReferenceTask";

    const {
        survivalData,
        titlePrimary,
        titleSecondary,
        summary,
        isLoading,
        isError,
    } = useWorkflowSurvivalKM({
        taskType,
        taskUUID: isSuccess ? taskUUID : null,
    });

    return (
        <SurvivalKMAnalysisView
            title={title}
            height={height}
            survivalData={survivalData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            summary={summary}
            isLoading={isLoading}
            isError={isError}
            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : !taskType
                        ? "Missing task type"
                        : null
            }
            unavailableDescription={
                taskUUID && taskType && !isSuccess
                    ? "Survival analysis is available only after the task succeeds."
                    : null
            }
            emptyDescription={
                EMPTY_DESCRIPTION_BY_TASK_TYPE[taskType] ??
                "No survival analysis data"
            }
            showTcgaBasedTag={isHybridReferenceTask}
        />
    );
};

export default WorkflowSurvivalKMSection;
