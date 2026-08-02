"use client";

import SurvivalKMAnalysisView
    from "@/components/features/common/SurvivalKM/SurvivalKMAnalysisView";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useHybridReferenceSurvivalKM
} from "@/components/features/workspace/hooks/SurvivalKM/useHybridReferenceSurvivalKM"


const HybridReferenceSurvivalSection = ({
    task,
    height = 620,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(
        taskData.status
    );

    const {
        survivalData,
        titlePrimary,
        titleSecondary,
        summary,
        isLoading,
        isError,
    } = useHybridReferenceSurvivalKM({
        taskUUID:
            isSuccess
                ? taskUUID
                : null,
    });

    return (
        <SurvivalKMAnalysisView
            title="Survival Analysis"
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
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Survival analysis is available only after the task succeeds."
                    : null
            }

            emptyDescription={
                "No hybrid reference survival analysis data"
            }

            showTcgaBasedTag
        />
    );
};


export default HybridReferenceSurvivalSection;
