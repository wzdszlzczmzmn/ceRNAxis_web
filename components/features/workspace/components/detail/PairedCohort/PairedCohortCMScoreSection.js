"use client";

import { useEffect, useState } from "react";

import CMScoreAnalysisView
    from "@/components/features/common/CMScore/CMScoreAnalysisView";

import { useWorkflowCMScoreOptions }
    from "@/components/features/workspace/hooks/CMScore/useWorkflowCMScoreOptions";
import { useWorkflowCMScoreResult }
    from "@/components/features/workspace/hooks/CMScore/useWorkflowCMScoreResult";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const TASK_TYPE = "PairedCohortTask";

const PairedCohortCMScoreSection = ({
    task,
    height = 660,
}) => {
    const taskData = getTaskData(task);
    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDataset, setSelectedDataset] = useState(null);

    const {
        options: itemOptions,
        defaultItem,
        isLoading: itemLoading,
        isError: itemError,
    } = useWorkflowCMScoreOptions({
        taskType: TASK_TYPE,
        taskUUID: isSuccess ? taskUUID : null,
    });

    useEffect(() => {
        setSelectedItem(prev =>
            itemOptions.some(item => item.value === prev)
                ? prev
                : defaultItem ?? itemOptions[0]?.value ?? null
        );
    }, [itemOptions, defaultItem]);

    const {
        cmScoreData,
        defaultDataset,
        datasetOptions,
        isLoading: resultLoading,
        isError: resultError,
    } = useWorkflowCMScoreResult({
        taskType: TASK_TYPE,
        taskUUID: isSuccess ? taskUUID : null,
        item: selectedItem,
    });

    useEffect(() => {
        setSelectedDataset(prev =>
            datasetOptions.some(item => item.value === prev)
                ? prev
                : defaultDataset ?? datasetOptions[0]?.value ?? null
        );
    }, [datasetOptions, defaultDataset]);

    return (
        <CMScoreAnalysisView
            taskType={TASK_TYPE}
            title="CM-Score Results"
            height={height}

            selectedItem={selectedItem}
            itemOptions={itemOptions}
            itemLoading={itemLoading}
            onItemChange={value => {
                setSelectedItem(value ?? null);
                setSelectedDataset(null);
            }}

            selectedDataset={selectedDataset}
            datasetOptions={datasetOptions}
            datasetLoading={resultLoading}
            onDatasetChange={value =>
                setSelectedDataset(value ?? null)
            }

            cmScoreData={cmScoreData}
            isLoading={resultLoading}
            isError={itemError || resultError}

            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "CM-score results are available only after the task succeeds."
                    : null
            }

            emptyDescription="No CM-score results available"
        />
    );
};

export default PairedCohortCMScoreSection;
