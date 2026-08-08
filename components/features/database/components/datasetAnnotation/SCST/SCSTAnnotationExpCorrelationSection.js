"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import ExpCorrelationAnalysisView
    from "@/components/features/common/ExpCorrelation/ExpCorrelationAnalysisView";
import {
    useSCSTDatasetAnnotationExpCorrelationOptions,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationExpCorrelationOptions";
import {
    useSCSTDatasetAnnotationExpCorrelationPlotData,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationExpCorrelationPlotData";


const normalizeGroupOptions = (
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
                && String(
                    item.value
                ).trim()
            )
        )
        .map(item => ({
            label:
                item.label
                ?? item.value,

            value:
            item.value,
        }));
};


const getInitialGroupValue = ({
    groupOptions,
    defaultGroupValue,
}) => {
    const defaultOption = (
        groupOptions.find(
            item => (
                item.value
                === defaultGroupValue
            )
        )
    );

    return (
        defaultOption?.value
        ?? groupOptions[0]?.value
        ?? null
    );
};


const SCSTAnnotationExpCorrelationSectionContent = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,

    height = 620,
}) => {
    /*
     * Dataset Annotation availability determines only which
     * group values have an Expression Correlation result.
     *
     * The Options API determines the actual selectable
     * interaction types and gene pairs for the selected group.
     */
    const groupOptions = useMemo(
        () => (
            normalizeGroupOptions(
                groupValueOptions
            )
        ),
        [
            groupValueOptions,
        ],
    );

    /*
     * Keep the same query state shape as the Workflow component.
     */
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
     * Initialize Group Value after availability becomes ready.
     *
     * Compared with Workflow, Dataset Annotation additionally has
     * a visualization-specific defaultGroupValue. Use it when it
     * remains valid; otherwise fall back to the first option.
     *
     * If a refreshed availability payload removes the current
     * group, reset type/gene selections together with groupValue.
     */
    useEffect(() => {
        setQueryConfig(prev => {
            const currentGroupStillValid = (
                groupOptions.some(
                    item => (
                        item.value
                        === prev.groupValue
                    )
                )
            );

            if (currentGroupStillValid) {
                return prev;
            }

            return {
                ...prev,

                groupValue:
                    getInitialGroupValue({
                        groupOptions,
                        defaultGroupValue,
                    }),

                type: null,
                gene1: null,
                gene2: null,
            };
        });
    }, [
        groupOptions,
        defaultGroupValue,
    ]);

    /*
     * Same two-stage data flow as Workflow:
     *
     * 1. selected groupValue -> Options API
     * 2. selected type/gene1/gene2 -> Plot Data API
     */
    const {
        optionsData,
        validTypes,
        availableTypes,
        results,

        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = (
        useSCSTDatasetAnnotationExpCorrelationOptions({
            dataset,
            dataType,
            groupBy,

            groupValue:
            queryConfig.groupValue,
        })
    );

    const {
        plotData,
        titlePrimary,
        titleSecondary,

        isLoading: isPlotLoading,
        isError: isPlotError,
    } = (
        useSCSTDatasetAnnotationExpCorrelationPlotData({
            dataset,
            dataType,
            groupBy,

            groupValue:
            queryConfig.groupValue,

            type:
            queryConfig.type,

            gene1:
            queryConfig.gene1,

            gene2:
            queryConfig.gene2,
        })
    );

    return (
        <ExpCorrelationAnalysisView
            title="Expression Correlation Plot"
            height={height}

            groupOptions={
                groupOptions
            }
            groupLabel={
                groupBy
                ?? "Group"
            }

            optionsData={
                optionsData
            }
            validTypes={
                validTypes
            }
            availableTypes={
                availableTypes
            }
            results={
                results
            }

            plotData={
                plotData
            }
            titlePrimary={
                titlePrimary
            }
            titleSecondary={
                titleSecondary
            }

            isOptionsLoading={
                isOptionsLoading
            }
            isOptionsError={
                isOptionsError
            }

            isPlotLoading={
                isPlotLoading
            }
            isPlotError={
                isPlotError
            }

            queryConfig={
                queryConfig
            }
            setQueryConfig={
                setQueryConfig
            }

            missingDescription={
                !dataset
                    ? "Missing dataset."
                    : !dataType
                        ? "Missing SC/ST data type."
                        : !groupBy
                            ? (
                                "Missing annotation "
                                + "Group By."
                            )
                            : null
            }

            unavailableDescription={
                (
                    dataset
                    && dataType
                    && groupBy
                    && groupOptions.length === 0
                )
                    ? (
                        "No Expression Correlation "
                        + "group value is available."
                    )
                    : null
            }

            emptyDescription={
                "No expression correlation data"
            }

            showTcgaBasedTag
            tcgaBasedTooltip={
                "Expression values for this correlation plot "
                + "are based on TCGA reference expression data."
            }
        />
    );
};


const SCSTAnnotationExpCorrelationSection = props => {
    /*
     * The local queryConfig does not include page-level groupBy.
     * Remount the inner component when the Dataset Annotation
     * context changes so an identical literal group value in a
     * different Group By cannot preserve stale type/gene state.
     */
    const sectionKey = [
        props.dataset ?? "",
        props.dataType ?? "",
        props.groupBy ?? "",
    ].join("::");

    return (
        <SCSTAnnotationExpCorrelationSectionContent
            key={sectionKey}
            {...props}
        />
    );
};


export default SCSTAnnotationExpCorrelationSection;
