import { getTaskData, isTaskSuccess } from "@/components/features/workspace/components/taskInformation/taskStatusUtils"
import { useEffect, useMemo, useState } from "react"
import { useWorkflowCMScoreOptions } from "@/components/features/workspace/hooks/CMScore/useWorkflowCMScoreOptions"
import { useWorkflowCMScoreResult } from "@/components/features/workspace/hooks/CMScore/useWorkflowCMScoreResult"
import CMScoreAnalysisView from "@/components/features/common/CMScore/CMScoreAnalysisView"

const TASK_TYPE = "SCSTHybridReferenceTask";

const SCSTHybridReferenceCMScoreSection = ({
    task,
    vizInfo,
    height = 660,
}) => {
    const taskData = getTaskData(task);
    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const groupOptions = useMemo(() => {
        const options =
            vizInfo?.groupInfo?.groupOptions;

        return Array.isArray(options)
            ? options.map(item => ({
                value: item.value,
                label: item.label ?? item.value,
            }))
            : [];
    }, [
        vizInfo?.groupInfo?.groupOptions,
    ]);

    const [groupValue, setGroupValue] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedDataset, setSelectedDataset] = useState(null);

    useEffect(() => {
        setGroupValue(prev =>
            groupOptions.some(
                item => item.value === prev
            )
                ? prev
                : groupOptions[0]?.value ?? null
        );
    }, [groupOptions]);

    const {
        options: itemOptions,
        defaultItem,
        isLoading: itemLoading,
        isError: itemError,
    } = useWorkflowCMScoreOptions({
        taskType: TASK_TYPE,
        taskUUID:
            isSuccess && groupValue
                ? taskUUID
                : null,
        groupValue,
    });

    const resolvedItem = useMemo(() => {
        if (
            selectedItem &&
            itemOptions.some(
                item => item.value === selectedItem
            )
        ) {
            return selectedItem;
        }

        return (
            defaultItem ??
            itemOptions[0]?.value ??
            null
        );
    }, [
        selectedItem,
        itemOptions,
        defaultItem,
    ]);

    const {
        cmScoreData,
        defaultDataset,
        datasetOptions,
        isLoading: resultLoading,
        isError: resultError,
    } = useWorkflowCMScoreResult({
        taskType: TASK_TYPE,
        taskUUID:
            isSuccess && groupValue
                ? taskUUID
                : null,
        groupValue,
        item: resolvedItem,
    });

    const resolvedDataset = useMemo(() => {
        if (
            selectedDataset &&
            datasetOptions.some(
                item => item.value === selectedDataset
            )
        ) {
            return selectedDataset;
        }

        return (
            defaultDataset ??
            datasetOptions[0]?.value ??
            null
        );
    }, [
        selectedDataset,
        datasetOptions,
        defaultDataset,
    ]);

    const handleGroupChange = value => {
        setGroupValue(value ?? null);
        setSelectedItem(null);
        setSelectedDataset(null);
    };

    const handleItemChange = value => {
        setSelectedItem(value ?? null);
        setSelectedDataset(null);
    };

    return (
        <CMScoreAnalysisView
            taskType={TASK_TYPE}
            title="CM-Score Results"
            height={height}

            groupOptions={groupOptions}
            groupValue={groupValue}
            groupLabel={
                vizInfo?.groupInfo?.groupCol ??
                "Group"
            }
            onGroupChange={handleGroupChange}

            selectedItem={resolvedItem}
            itemOptions={itemOptions}
            itemLoading={itemLoading}
            onItemChange={handleItemChange}

            selectedDataset={resolvedDataset}
            datasetOptions={datasetOptions}
            datasetLoading={resultLoading}
            onDatasetChange={value =>
                setSelectedDataset(value ?? null)
            }

            cmScoreData={cmScoreData}

            isLoading={resultLoading}
            isError={itemError || resultError}

            emptyDescription={
                "No CM-score results available for the selected group"
            }
        />
    );
};

export default SCSTHybridReferenceCMScoreSection
