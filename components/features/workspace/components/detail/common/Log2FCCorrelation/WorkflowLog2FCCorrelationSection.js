"use client";

import { useMemo } from "react";

import Log2FCCorrelationAnalysisView
    from "@/components/features/common/Log2FCCorrelation/Log2FCCorrelationAnalysisView";
import { useLog2FCCorrelationQueryConfig }
    from "@/components/features/common/Log2FCCorrelation/useLog2FCCorrelationQueryConfig";
import { useWorkflowLog2FCCorrelation }
    from "@/components/features/workspace/hooks/useWorkflowLog2FCCorrelation";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const FALLBACK_BACKGROUND_TYPES_BY_TASK_TYPE = {
    PairedCohortTask: [
        "miRNA-mRNA",
        "miRNA-lncRNA",
        "miRNA-circRNA",
    ],
    HybridReferenceTask: [
        "miRNA-mRNA",
        "miRNA-lncRNA",
    ],
};

const getAvailableBackgroundTypes = ({
    task,
    taskType,
}) => {
    const availableTypes = task?.data?.available_background_types;

    if (Array.isArray(availableTypes) && availableTypes.length > 0) {
        return availableTypes;
    }

    return FALLBACK_BACKGROUND_TYPES_BY_TASK_TYPE[taskType] ?? [];
};

const WorkflowLog2FCCorrelationSection = ({
    task,
    title = "Log2FC Correlation Plot",
    height = 620,
}) => {
    const taskType = task?.task_type;
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const availableBackgroundTypes = useMemo(() => {
        return getAvailableBackgroundTypes({
            task,
            taskType,
        });
    }, [task, taskType]);

    const {
        queryConfig,
        setQueryConfig,
    } = useLog2FCCorrelationQueryConfig({
        availableTypes: availableBackgroundTypes,
    });

    const {
        correlationData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = useWorkflowLog2FCCorrelation({
        taskType,
        taskUUID: isSuccess ? taskUUID : null,
        interactionType: queryConfig.interactionType,
    });

    return (
        <Log2FCCorrelationAnalysisView
            title={title}
            height={height}
            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}
            correlationData={correlationData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            availableTypes={availableBackgroundTypes}
            isLoading={isLoading}
            isError={isError}
            missingDescription={!taskUUID ? "Missing task UUID" : null}
            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Log2FC correlation plot is available only after the task succeeds."
                    : null
            }
        />
    );
};

export default WorkflowLog2FCCorrelationSection;
