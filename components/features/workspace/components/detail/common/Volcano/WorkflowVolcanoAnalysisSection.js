"use client";

import { useMemo } from "react";

import VolcanoAnalysisView
    from "@/components/features/common/Volcano/VolcanoAnalysisView";
import { useVolcanoQueryConfig }
    from "@/components/features/common/Volcano/useVolcanoQueryConfig";
import { useWorkflowDegVolcano }
    from "@/components/features/workspace/hooks/useWorkflowDegVolcano";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const FALLBACK_DEG_RNA_TYPES_BY_TASK_TYPE = {
    PairedCohortTask: ["mRNA", "miRNA", "lncRNA", "circRNA"],
    HybridReferenceTask: ["mRNA"],
};

const FALLBACK_DEG_SCOPES_BY_TASK_TYPE = {
    PairedCohortTask: ["all"],
    HybridReferenceTask: ["all"],
};

const getAvailableDegRnaTypes = ({ task, taskType }) => {
    const availableTypes = task?.data?.available_deg_rna_types;

    if (Array.isArray(availableTypes) && availableTypes.length > 0) {
        return availableTypes;
    }

    return FALLBACK_DEG_RNA_TYPES_BY_TASK_TYPE[taskType] ?? [];
};

const getAvailableDegScopes = ({ task, taskType }) => {
    const availableScopes = task?.data?.available_deg_scopes;

    if (Array.isArray(availableScopes) && availableScopes.length > 0) {
        return availableScopes;
    }

    return FALLBACK_DEG_SCOPES_BY_TASK_TYPE[taskType] ?? ["all"];
};

const WorkflowVolcanoAnalysisSection = ({
    task,
    title = "Expression Volcano Plot",
    height = 620,
    showDegScopeSelect = null,
}) => {
    const taskType = task?.task_type;
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const availableDegRnaTypes = useMemo(() => {
        return getAvailableDegRnaTypes({ task, taskType });
    }, [task, taskType]);

    const availableDegScopes = useMemo(() => {
        return getAvailableDegScopes({ task, taskType });
    }, [task, taskType]);

    const {
        queryConfig,
        setQueryConfig,
    } = useVolcanoQueryConfig({
        availableDegRnaTypes,
        availableDegScopes,
    });

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = useWorkflowDegVolcano({
        taskType,
        taskUUID: isSuccess ? taskUUID : null,
        rnaType: queryConfig.rnaType,
        degScope: queryConfig.degScope,
    });

    return (
        <VolcanoAnalysisView
            title={title}
            height={height}
            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}
            volcanoData={volcanoData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            isLoading={isLoading}
            isError={isError}
            availableDegRnaTypes={availableDegRnaTypes}
            availableDegScopes={availableDegScopes}
            cutoffsByRnaType={task?.data?.cutoffs ?? {}}
            usePadj={task?.data?.use_padj}
            showDegScopeSelect={showDegScopeSelect}
            missingDescription={!taskUUID ? "Missing task UUID" : null}
            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Volcano plot is available only after the task succeeds."
                    : null
            }
        />
    );
};

export default WorkflowVolcanoAnalysisSection;
