"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import ExpCorrelationAnalysisView
    from "@/components/features/common/ExpCorrelation/ExpCorrelationAnalysisView";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceExpCorrelationOptions
} from "@/components/features/workspace/hooks/ExpCorrelation/useSCSTHybridReferenceExpCorrelationOptions"
import {
    useSCSTHybridReferenceExpCorrelationPlotData
} from "@/components/features/workspace/hooks/ExpCorrelation/useSCSTHybridReferenceExpCorrelationPlotData"


const SCSTHybridReferenceExpCorrelationSection = ({
    task,
    vizInfo,
    height = 620,
}) => {
    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;

    const isSuccess = isTaskSuccess(
        taskData.status
    );

    /*
     * Group options come from vizInfo.
     */
    const groupOptions = useMemo(() => {
        const options =
            vizInfo?.groupInfo?.groupOptions;

        if (!Array.isArray(options)) {
            return [];
        }

        return options.map(item => ({
            label:
                item.label ??
                item.value,

            value:
            item.value,
        }));
    }, [
        vizInfo?.groupInfo?.groupOptions,
    ]);

    const [
        queryConfig,
        setQueryConfig,
    ] = useState({
        groupValue: null,
        type: null,
        gene1: null,
        gene2: null,
    });

    /*
     * Initialize groupValue once vizInfo becomes available.
     *
     * Also protects against vizInfo being refreshed and
     * the old group disappearing.
     */
    useEffect(() => {
        setQueryConfig(prev => {
            const currentGroupStillValid =
                groupOptions.some(
                    item =>
                        item.value ===
                        prev.groupValue
                );

            if (currentGroupStillValid) {
                return prev;
            }

            return {
                ...prev,

                groupValue:
                    groupOptions[0]?.value ??
                    null,

                type: null,
                gene1: null,
                gene2: null,
            };
        });
    }, [groupOptions]);

    const {
        optionsData,
        validTypes,
        availableTypes,
        results,

        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useSCSTHybridReferenceExpCorrelationOptions({
        taskUUID:
            isSuccess
                ? taskUUID
                : null,

        groupValue:
        queryConfig.groupValue,
    });

    const {
        plotData,
        titlePrimary,
        titleSecondary,

        isLoading: isPlotLoading,
        isError: isPlotError,
    } = useSCSTHybridReferenceExpCorrelationPlotData({
        taskUUID:
            isSuccess
                ? taskUUID
                : null,

        groupValue:
        queryConfig.groupValue,

        type:
        queryConfig.type,

        gene1:
        queryConfig.gene1,

        gene2:
        queryConfig.gene2,
    });

    return (
        <ExpCorrelationAnalysisView
            title="Expression Correlation Plot"
            height={height}

            groupOptions={groupOptions}
            groupLabel={
                vizInfo?.groupInfo?.groupCol ??
                "Group"
            }

            optionsData={optionsData}
            validTypes={validTypes}
            availableTypes={availableTypes}
            results={results}

            plotData={plotData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}

            isOptionsLoading={
                Boolean(vizInfo?.isLoading) ||
                isOptionsLoading
            }

            isOptionsError={
                Boolean(vizInfo?.isError) ||
                isOptionsError
            }

            isPlotLoading={
                isPlotLoading
            }

            isPlotError={
                isPlotError
            }

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

            emptyDescription={
                "No expression correlation data"
            }

            showTcgaBasedTag
            tcgaBasedTooltip={
                "Expression values for this correlation plot are based on TCGA reference expression data."
            }
        />
    );
};


export default SCSTHybridReferenceExpCorrelationSection;
