"use client";

import DEGPathwayAnalysisView
    from "@/components/features/common/DEGPathway/DEGPathwayAnalysisView";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useHybridReferenceDEGPathway
} from "@/components/features/workspace/hooks/DEGPathway/useHybridReferenceDEGPathway"

const HybridReferenceDEGPathwaySection = ({
    task,
    height = 680,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const {
        pathwayData,
        title: pathwayTitle,
        summary,
        isLoading,
        isError,
    } = useHybridReferenceDEGPathway({
        taskUUID: isSuccess ? taskUUID : null,
    });

    return (
        <DEGPathwayAnalysisView
            title="DEG Pathway Enrichment Plot"
            height={height}

            pathwayData={pathwayData}
            pathwayTitle={pathwayTitle}
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
                    ? "DEG pathway enrichment plot is available only after the task succeeds."
                    : null
            }

            emptyDescription={
                "No hybrid reference DEG pathway enrichment data"
            }

            showTcgaBasedTag
            tcgaBasedTooltip={
                "DEG pathway enrichment is based on TCGA reference data."
            }
        />
    );
};

export default HybridReferenceDEGPathwaySection;
