"use client";

import { useMemo } from "react";

import VolcanoAnalysisView
    from "@/components/features/common/Volcano/VolcanoAnalysisView";
import {
    useVolcanoQueryConfig,
} from "@/components/features/common/Volcano/useVolcanoQueryConfig";
import {
    usePairedCohortDegVolcano,
} from "@/components/features/workspace/hooks/Volcano/usePairedCohortDegVolcano";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";


const FALLBACK_DEG_RNA_TYPES = [
    "mRNA",
];

const FALLBACK_DEG_SCOPES = [
    "all",
];

const EMPTY_CUTOFFS = Object.freeze({});


const PairedCohortVolcanoAnalysisSection = ({
    task,
    height = 620,
}) => {
    const taskData = getTaskData(task);
    const taskUUID = taskData?.uuid;
    const isSuccess =
        isTaskSuccess(taskData?.status);

    const availableDegRnaTypes = useMemo(
        () =>
            taskData?.available_deg_rna_types?.length
                ? taskData.available_deg_rna_types
                : FALLBACK_DEG_RNA_TYPES,
        [
            taskData?.available_deg_rna_types,
        ]
    );

    const availableDegScopes = useMemo(
        () =>
            taskData?.available_deg_scopes?.length
                ? taskData.available_deg_scopes
                : FALLBACK_DEG_SCOPES,
        [
            taskData?.available_deg_scopes,
        ]
    );

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
    } = usePairedCohortDegVolcano({
        taskUUID: isSuccess ? taskUUID : null,
        rnaType: queryConfig.rnaType,
        degScope: queryConfig.degScope,
    });


    return (
        <VolcanoAnalysisView
            title="Expression Volcano Plot"
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
            cutoffsByRnaType={taskData?.cutoffs ?? EMPTY_CUTOFFS}
            usePadj={taskData?.use_padj}
            showDegScopeSelect={availableDegScopes.length > 1}
            missingDescription={!taskUUID ? "Missing task UUID" : null}
            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Volcano plot is available only after the task succeeds."
                    : null
            }
        />
    );
};


export default PairedCohortVolcanoAnalysisSection;
