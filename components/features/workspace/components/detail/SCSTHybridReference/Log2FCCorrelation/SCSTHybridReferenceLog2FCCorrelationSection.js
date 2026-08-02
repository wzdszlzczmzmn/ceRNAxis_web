"use client";

import { useMemo } from "react";

import Log2FCCorrelationAnalysisView
    from "@/components/features/common/Log2FCCorrelation/Log2FCCorrelationAnalysisView";
import {
    useSCSTLog2FCCorrelationQueryConfig,
} from "@/components/features/common/Log2FCCorrelation/useSCSTLog2FCCorrelationQueryConfig";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceLog2FCCorrelation
} from "@/components/features/workspace/hooks/Log2FCCorrelation/useSCSTHybridReferenceLog2FCCorrelation"


const SCSTHybridReferenceLog2FCCorrelationSection = ({
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
     * Raw group metadata is kept here because
     * available_background_types belongs to each group.
     */
    const groupOptions = useMemo(() => {
        const options =
            vizInfo?.groupInfo?.groupOptions;

        return Array.isArray(options)
            ? options
            : [];
    }, [
        vizInfo?.groupInfo?.groupOptions,
    ]);

    /*
     * Options actually shown by Antd Select.
     *
     * A group without background data remains visible,
     * but cannot be selected.
     */
    const groupSelectOptions = useMemo(() => {
        return groupOptions.map(item => {
            const availableTypes =
                Array.isArray(
                    item.available_background_types
                )
                    ? item.available_background_types
                    : [];

            return {
                value: item.value,
                label: item.label ?? item.value,

                disabled:
                    item.background_available === false ||
                    availableTypes.length === 0,
            };
        });
    }, [groupOptions]);

    /*
     * queryConfig:
     *
     * {
     *     groupValue,
     *     interactionType,
     * }
     */
    const {
        queryConfig,
        setQueryConfig,
        availableTypes,
    } = useSCSTLog2FCCorrelationQueryConfig({
        groupOptions,
    });

    const {
        correlationData,
        titlePrimary,
        titleSecondary,
        isLoading: correlationIsLoading,
        isError: correlationIsError,
    } = useSCSTHybridReferenceLog2FCCorrelation({
        taskUUID:
            isSuccess
                ? taskUUID
                : null,

        groupValue:
        queryConfig.groupValue,

        interactionType:
        queryConfig.interactionType,
    });

    const isLoading =
        Boolean(vizInfo?.isLoading) ||
        correlationIsLoading;

    const isError =
        Boolean(vizInfo?.isError) ||
        correlationIsError;

    return (
        <Log2FCCorrelationAnalysisView
            title="Log2FC Correlation Plot"
            height={height}

            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}

            groupOptions={
                groupSelectOptions
            }
            groupLabel={
                vizInfo?.groupInfo?.groupCol
                ?? "Group"
            }

            availableTypes={
                availableTypes
            }

            correlationData={
                correlationData
            }
            titlePrimary={
                titlePrimary
            }
            titleSecondary={
                titleSecondary
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


export default SCSTHybridReferenceLog2FCCorrelationSection;
