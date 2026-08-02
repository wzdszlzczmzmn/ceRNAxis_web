"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DEGPathwayAnalysisView
    from "@/components/features/common/DEGPathway/DEGPathwayAnalysisView";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceDEGPathway
} from "@/components/features/workspace/hooks/DEGPathway/useSCSTHybridReferenceDEGPathway"

const SCSTHybridReferenceDEGPathwaySection = ({
    task,
    vizInfo,
    height = 680,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(
        taskData.status
    );

    const groupOptions = useMemo(() => {
        const options =
            vizInfo?.groupInfo?.groupOptions;

        if (!Array.isArray(options)) {
            return [];
        }

        return options.map(item => ({
            value: item.value,
            label:
                item.label ??
                item.value,
        }));
    }, [
        vizInfo?.groupInfo?.groupOptions,
    ]);

    const [
        groupValue,
        setGroupValue,
    ] = useState(null);

    useEffect(() => {
        setGroupValue(prev => {
            const isValid =
                groupOptions.some(
                    item =>
                        item.value === prev
                );

            if (isValid) {
                return prev;
            }

            return (
                groupOptions[0]?.value ??
                null
            );
        });
    }, [groupOptions]);

    const {
        pathwayData,
        title: pathwayTitle,
        summary,

        isLoading: isPathwayLoading,
        isError: isPathwayError,
    } = useSCSTHybridReferenceDEGPathway({
        taskUUID:
            isSuccess
                ? taskUUID
                : null,

        groupValue,
    });

    return (
        <DEGPathwayAnalysisView
            title="DEG Pathway Enrichment Plot"
            height={height}

            groupOptions={groupOptions}
            groupValue={groupValue}
            groupLabel={
                vizInfo?.groupInfo?.groupCol ??
                "Group"
            }
            onGroupChange={setGroupValue}

            pathwayData={pathwayData}
            pathwayTitle={pathwayTitle}
            summary={summary}

            isLoading={
                Boolean(vizInfo?.isLoading) ||
                isPathwayLoading
            }

            isError={
                Boolean(vizInfo?.isError) ||
                isPathwayError
            }

            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "DEG pathway enrichment plot is available only after the task succeeds."
                    : null
            }

            emptyDescription={
                "No DEG pathway enrichment data for the selected group"
            }
        />
    );
};

export default SCSTHybridReferenceDEGPathwaySection;
