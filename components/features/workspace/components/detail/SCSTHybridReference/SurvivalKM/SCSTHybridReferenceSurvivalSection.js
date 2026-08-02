"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import SurvivalKMAnalysisView
    from "@/components/features/common/SurvivalKM/SurvivalKMAnalysisView";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceSurvivalKM
} from "@/components/features/workspace/hooks/SurvivalKM/useSCSTHybridReferenceSurvivalKM"

const SCSTHybridReferenceSurvivalSection = ({
    task,
    vizInfo,
    height = 620,
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
            label: item.label ?? item.value,
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
            if (
                groupOptions.some(
                    item => item.value === prev
                )
            ) {
                return prev;
            }

            return (
                groupOptions[0]?.value ??
                null
            );
        });
    }, [groupOptions]);

    const {
        survivalData,
        titlePrimary,
        titleSecondary,
        summary,

        isLoading: isSurvivalLoading,
        isError: isSurvivalError,
    } = useSCSTHybridReferenceSurvivalKM({
        taskUUID:
            isSuccess
                ? taskUUID
                : null,

        groupValue,
    });

    return (
        <SurvivalKMAnalysisView
            title="Survival Analysis"
            height={height}

            groupOptions={groupOptions}
            groupValue={groupValue}
            groupLabel={
                vizInfo?.groupInfo?.groupCol ??
                "Group"
            }
            onGroupChange={setGroupValue}

            survivalData={survivalData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            summary={summary}

            isLoading={
                Boolean(vizInfo?.isLoading) ||
                isSurvivalLoading
            }

            isError={
                Boolean(vizInfo?.isError) ||
                isSurvivalError
            }

            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Survival analysis is available only after the task succeeds."
                    : null
            }

            emptyDescription={
                "No survival analysis data for the selected group"
            }

            showTcgaBasedTag
        />
    );
};

export default SCSTHybridReferenceSurvivalSection;
