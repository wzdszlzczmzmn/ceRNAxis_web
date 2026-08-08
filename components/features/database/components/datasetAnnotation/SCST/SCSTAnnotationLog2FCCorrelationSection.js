"use client";

import {
    useMemo,
} from "react";

import Log2FCCorrelationAnalysisView
    from "@/components/features/common/Log2FCCorrelation/Log2FCCorrelationAnalysisView";
import {
    useSCSTLog2FCCorrelationQueryConfig,
} from "@/components/features/common/Log2FCCorrelation/useSCSTLog2FCCorrelationQueryConfig";
import {
    useSCSTDatasetAnnotationLog2FCCorrelation,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationLog2FCCorrelation";


const normalizeDatasetAnnotationGroupOptions = (
    groupValueOptions
) => {
    if (!Array.isArray(groupValueOptions)) {
        return [];
    }

    return groupValueOptions
        .filter(
            item => (
                item
                && item.value !== null
                && item.value !== undefined
                && String(item.value).trim()
            )
        )
        .map(item => {
            /*
             * Current Dataset Annotation availability uses
             * camelCase after frontend normalization.
             *
             * The snake_case fallback makes this Section tolerant
             * of an un-normalized option without changing the
             * Workflow query-config hook.
             */
            const availableTypes = (
                Array.isArray(
                    item.availableBackgroundTypes
                )
                    ? item.availableBackgroundTypes
                    : Array.isArray(
                        item.available_background_types
                    )
                        ? item.available_background_types
                        : []
            );

            const backgroundAvailable = (
                item.backgroundAvailable
                ?? item.background_available
                ?? (availableTypes.length > 0)
            );

            return {
                value:
                item.value,

                label:
                    item.label
                    ?? item.value,

                background_available:
                    Boolean(
                        backgroundAvailable
                    ),

                available_background_types:
                availableTypes,
            };
        });
};


const prioritizeDefaultGroup = ({
    groupOptions,
    defaultGroupValue,
}) => {
    if (
        !defaultGroupValue
        || groupOptions.length <= 1
    ) {
        return groupOptions;
    }

    const defaultIndex = (
        groupOptions.findIndex(
            item => (
                item.value
                === defaultGroupValue
            )
        )
    );

    if (defaultIndex <= 0) {
        return groupOptions;
    }

    /*
     * Reorder only the options passed to the query-config hook.
     * The Select keeps the original Dataset Annotation order.
     */
    return [
        groupOptions[defaultIndex],
        ...groupOptions.slice(
            0,
            defaultIndex
        ),
        ...groupOptions.slice(
            defaultIndex + 1
        ),
    ];
};


const SCSTAnnotationLog2FCCorrelationSectionContent = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,

    height = 620,
}) => {
    /*
     * Convert Dataset Annotation availability to the exact shape
     * consumed by useSCSTLog2FCCorrelationQueryConfig:
     *
     * {
     *     value,
     *     label,
     *     background_available,
     *     available_background_types,
     * }
     */
    const groupOptions = useMemo(
        () => (
            normalizeDatasetAnnotationGroupOptions(
                groupValueOptions
            )
        ),
        [
            groupValueOptions,
        ],
    );

    /*
     * The shared Workflow hook initializes from the first
     * available group. Respect Dataset Annotation's
     * defaultGroupValue without changing the visible Select order.
     */
    const queryGroupOptions = useMemo(
        () => (
            prioritizeDefaultGroup({
                groupOptions,
                defaultGroupValue,
            })
        ),
        [
            groupOptions,
            defaultGroupValue,
        ],
    );

    /*
     * Options shown in the common analysis view.
     */
    const groupSelectOptions = useMemo(
        () => (
            groupOptions.map(item => ({
                value:
                item.value,

                label:
                item.label,

                disabled:
                    item.background_available
                    === false
                    || item
                        .available_background_types
                        .length === 0,
            }))
        ),
        [
            groupOptions,
        ],
    );

    /*
     * Reuse the Workflow query-state implementation unchanged.
     *
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
    } = (
        useSCSTLog2FCCorrelationQueryConfig({
            groupOptions:
            queryGroupOptions,
        })
    );

    /*
     * Match the Workflow Section:
     * always pass the current query state to the data hook.
     * The SWR hook itself decides whether the request is ready.
     */
    const {
        correlationData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = (
        useSCSTDatasetAnnotationLog2FCCorrelation({
            dataset,
            dataType,
            groupBy,

            groupValue:
            queryConfig.groupValue,

            interactionType:
            queryConfig.interactionType,
        })
    );

    const missingDescription = (
        !dataset
            ? "Missing dataset."
            : !dataType
                ? "Missing SC/ST data type."
                : !groupBy
                    ? "Missing annotation Group By."
                    : groupOptions.length === 0
                        ? (
                            "No Log2FC correlation "
                            + "group value is available."
                        )
                        : null
    );

    /*
     * Do not treat the hook's initial
     * groupValue=null / interactionType=null render as unavailable.
     */
    const unavailableDescription = (
        queryConfig.groupValue
        && availableTypes.length === 0
            ? (
                "No background interaction type "
                + "is available for the selected "
                + "group value."
            )
            : null
    );

    return (
        <Log2FCCorrelationAnalysisView
            title="Log2FC Correlation Plot"
            height={height}

            queryConfig={
                queryConfig
            }
            setQueryConfig={
                setQueryConfig
            }

            groupOptions={
                groupSelectOptions
            }
            groupLabel={
                groupBy
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

            isLoading={
                isLoading
            }
            isError={
                isError
            }

            missingDescription={
                missingDescription
            }

            unavailableDescription={
                unavailableDescription
            }
        />
    );
};


const SCSTAnnotationLog2FCCorrelationSection = props => {
    /*
     * The shared Workflow query-config hook does not know about
     * Dataset Annotation's page-level groupBy.
     *
     * Remount the inner Section whenever the annotation context
     * changes so a group value with the same literal name in two
     * different Group By fields is not accidentally preserved.
     */
    const sectionKey = [
        props.dataset ?? "",
        props.dataType ?? "",
        props.groupBy ?? "",
        props.defaultGroupValue ?? "",
    ].join("::");

    return (
        <SCSTAnnotationLog2FCCorrelationSectionContent
            key={sectionKey}
            {...props}
        />
    );
};


export default SCSTAnnotationLog2FCCorrelationSection;
