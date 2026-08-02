"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import VolcanoAnalysisView
    from "@/components/features/common/Volcano/VolcanoAnalysisView";
import { useVolcanoQueryConfig }
    from "@/components/features/common/Volcano/useVolcanoQueryConfig";
import { useSCSTHybridReferenceDegVolcano }
    from "@/components/features/workspace/hooks/Volcano/useSCSTHybridReferenceDegVolcano";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const FALLBACK_DEG_RNA_TYPES = ["mRNA"];
const FALLBACK_DEG_SCOPES = ["all"];
const EMPTY_CUTOFFS = Object.freeze({});

const SCSTHybridReferenceVolcanoAnalysisSection = ({
    task,
    vizInfo,
    height = 620,
}) => {
    const taskData = getTaskData(task);
    const taskUUID = taskData?.uuid;
    const isSuccess = isTaskSuccess(taskData?.status);

    const groupOptions = useMemo(() => {
        const options = vizInfo?.groupInfo?.groupOptions;

        if (!Array.isArray(options)) {
            return [];
        }

        return options.map(item => ({
            ...item,
            value: item.value,
            label: item.label ?? item.value,
        }));
    }, [
        vizInfo?.groupInfo?.groupOptions,
    ]);

    const groupLabel =
        vizInfo?.groupInfo?.groupCol ||
        "Group";

    const [groupValue, setGroupValue] =
        useState(null);

    useEffect(() => {
        setGroupValue(prev =>
            groupOptions.some(
                item => item.value === prev
            )
                ? prev
                : groupOptions[0]?.value ?? null
        );
    }, [groupOptions]);

    const currentGroupOption = useMemo(
        () => groupOptions.find(
            item => item.value === groupValue
        ) ?? null,
        [groupOptions, groupValue]
    );

    const availableDegRnaTypes = useMemo(
        () => (
            currentGroupOption
                ?.available_deg_rna_types
                ?.length
                ? currentGroupOption
                    .available_deg_rna_types
                : FALLBACK_DEG_RNA_TYPES
        ),
        [currentGroupOption]
    );

    const availableDegScopes = useMemo(
        () => (
            currentGroupOption
                ?.available_deg_scopes
                ?.length
                ? currentGroupOption
                    .available_deg_scopes
                : FALLBACK_DEG_SCOPES
        ),
        [currentGroupOption]
    );

    const {
        queryConfig,
        setQueryConfig,
    } = useVolcanoQueryConfig({
        availableDegRnaTypes,
        availableDegScopes,
    });

    const queryReady = Boolean(
        groupValue &&
        availableDegRnaTypes.includes(
            queryConfig.rnaType
        ) &&
        availableDegScopes.includes(
            queryConfig.degScope
        )
    );

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = useSCSTHybridReferenceDegVolcano({
        taskUUID:
            isSuccess && queryReady
                ? taskUUID
                : null,

        groupValue,
        rnaType: queryConfig.rnaType,
        degScope: queryConfig.degScope,
    });

    return (
        <VolcanoAnalysisView
            title="Expression Volcano Plot"
            height={height}

            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}

            groupOptions={groupOptions}
            groupValue={groupValue}
            groupLabel={groupLabel}
            onGroupChange={setGroupValue}
            showGroupSelect

            volcanoData={volcanoData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}

            availableDegRnaTypes={availableDegRnaTypes}
            availableDegScopes={availableDegScopes}
            showDegScopeSelect={availableDegScopes.length > 1}
            cutoffsByRnaType={taskData?.cutoffs ?? EMPTY_CUTOFFS}
            usePadj={taskData?.use_padj}

            isLoading={isLoading}
            isError={isError}

            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Volcano plot is available only after the task succeeds."
                    : null
            }
        />
    );
};

export default SCSTHybridReferenceVolcanoAnalysisSection;
