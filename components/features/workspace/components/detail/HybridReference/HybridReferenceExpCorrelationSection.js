"use client";

import { useState } from "react";

import ExpCorrelationAnalysisView
    from "@/components/features/common/ExpCorrelation/ExpCorrelationAnalysisView";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useHybridReferenceExpCorrelationOptions
} from "@/components/features/workspace/hooks/ExpCorrelation/useHybridReferenceExpCorrelationOptions"
import {
    useHybridReferenceExpCorrelationPlotData
} from "@/components/features/workspace/hooks/ExpCorrelation/useHybridReferenceExpCorrelationPlotData"


const HybridReferenceExpCorrelationSection = ({
    task,
    height = 620,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(
        taskData.status
    );

    const [
        queryConfig,
        setQueryConfig,
    ] = useState({
        type: null,
        gene1: null,
        gene2: null,
    });

    const {
        optionsData,
        validTypes,
        availableTypes,
        results,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useHybridReferenceExpCorrelationOptions({
        taskUUID: isSuccess
            ? taskUUID
            : null,
    });

    const {
        plotData,
        titlePrimary,
        titleSecondary,
        isLoading: isPlotLoading,
        isError: isPlotError,
    } = useHybridReferenceExpCorrelationPlotData({
        taskUUID: isSuccess
            ? taskUUID
            : null,

        type: queryConfig.type,
        gene1: queryConfig.gene1,
        gene2: queryConfig.gene2,
    });

    return (
        <ExpCorrelationAnalysisView
            title="Expression Correlation Plot"
            height={height}

            optionsData={optionsData}
            validTypes={validTypes}
            availableTypes={availableTypes}
            results={results}

            plotData={plotData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}

            isOptionsLoading={isOptionsLoading}
            isOptionsError={isOptionsError}

            isPlotLoading={isPlotLoading}
            isPlotError={isPlotError}

            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}

            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }

            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Expression correlation plot is available only after the task succeeds."
                    : null
            }

            emptyDescription="No expression correlation data"

            showTcgaBasedTag
            tcgaBasedTooltip={
                "Expression values for this correlation plot are based on TCGA reference expression data."
            }
        />
    );
};


export default HybridReferenceExpCorrelationSection;
