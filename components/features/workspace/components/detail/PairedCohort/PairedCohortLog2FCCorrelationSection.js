"use client";

import { useMemo } from "react";
import Log2FCCorrelationAnalysisView
    from "@/components/features/common/Log2FCCorrelation/Log2FCCorrelationAnalysisView";
import {
    useLog2FCCorrelationQueryConfig,
} from "@/components/features/common/Log2FCCorrelation/useLog2FCCorrelationQueryConfig";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    usePairedCohortLog2FCCorrelation
} from "@/components/features/workspace/hooks/Log2FCCorrelation/usePairedCohortLog2FCCorrelation"


const FALLBACK_BACKGROUND_TYPES = [
    "miRNA-mRNA",
    "miRNA-lncRNA",
    "miRNA-circRNA",
];


const PairedCohortLog2FCCorrelationSection = ({
    task,
    height = 620,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);

    const availableBackgroundTypes = useMemo(() => {
        const availableTypes =
            task?.data?.available_background_types;

        if (
            Array.isArray(availableTypes) &&
            availableTypes.length > 0
        ) {
            return availableTypes;
        }

        return FALLBACK_BACKGROUND_TYPES;
    }, [task]);

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
    } = usePairedCohortLog2FCCorrelation({
        taskUUID: isSuccess
            ? taskUUID
            : null,
        interactionType:
        queryConfig.interactionType,
    });

    return (
        <Log2FCCorrelationAnalysisView
            title="Log2FC Correlation Plot"
            height={height}

            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}

            correlationData={correlationData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}

            availableTypes={
                availableBackgroundTypes
            }

            isLoading={isLoading}
            isError={isError}

            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Log2FC correlation plot is available only after the task succeeds."
                    : null
            }
        />
    );
};


export default PairedCohortLog2FCCorrelationSection;
