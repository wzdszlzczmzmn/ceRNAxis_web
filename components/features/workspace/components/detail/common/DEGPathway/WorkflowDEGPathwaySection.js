"use client";

import DEGPathwayAnalysisView
    from "@/components/features/common/DEGPathway/DEGPathwayAnalysisView";
import { useWorkflowDEGPathway }
    from "@/components/features/workspace/hooks/useWorkflowDEGPathway";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const EMPTY_DESCRIPTION_BY_TASK_TYPE = {
    PairedCohortTask: "No DEG pathway enrichment data",
    HybridReferenceTask: "No hybrid reference DEG pathway enrichment data",
};

const WorkflowDEGPathwaySection = ({
    task,
    title = "DEG Pathway Enrichment Plot",
    height = 680,
}) => {
    const taskType = task?.task_type;
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);
    const isHybridReferenceTask = taskType === "HybridReferenceTask";

    const {
        pathwayData,
        title: pathwayTitle,
        summary,
        isLoading,
        isError,
    } = useWorkflowDEGPathway({
        taskType,
        taskUUID: isSuccess ? taskUUID : null,
    });

    return (
        <DEGPathwayAnalysisView
            title={title}
            height={height}
            pathwayData={pathwayData}
            pathwayTitle={pathwayTitle}
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
                    ? "DEG pathway enrichment plot is available only after the task succeeds."
                    : null
            }
            emptyDescription={
                EMPTY_DESCRIPTION_BY_TASK_TYPE[taskType] ??
                "No DEG pathway enrichment data"
            }
            showTcgaBasedTag={isHybridReferenceTask}
            tcgaBasedTooltip="DEG pathway enrichment is based on TCGA reference data."
        />
    );
};

export default WorkflowDEGPathwaySection;
