import { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationAvailableURL,
} from "@/lib/api/database/datasetAnnotation";


export const SCST_ANNOTATION_VISUALIZATION_KEYS = [
    "annotation_network",
    "axis_final",
    "cmap",
    "volcano",
    "log2fc_correlation",
    "exp_correlation",
    "survival",
    "deg_pathway",
    "CMdrug",
];


const toArray = value => {
    return Array.isArray(value)
        ? value
        : [];
};


const toNumber = (
    value,
    fallback = 0,
) => {
    const parsed = Number(value);

    return Number.isFinite(parsed)
        ? parsed
        : fallback;
};


const toObject = value => {
    return (
        value
        && typeof value === "object"
        && !Array.isArray(value)
    )
        ? value
        : {};
};


const normalizeGroupValueOption = option => {
    const value = option?.value ?? null;

    return {
        value,
        label: option?.label ?? value ?? "",
        count: toNumber(option?.count),

        available: Boolean(option?.available),
        availableVisualizationCount: toNumber(
            option?.available_visualization_count
        ),

        visualizations: toObject(
            option?.visualizations
        ),

        raw: option ?? null,
    };
};


const normalizeVisualizationGroupValueOption = ({
    visualizationKey,
    groupValueOption,
}) => {
    if (!groupValueOption?.available) {
        return null;
    }

    const visualization = toObject(
        groupValueOption
            ?.visualizations
            ?.[visualizationKey]
    );

    if (!visualization.available) {
        return null;
    }

    const baseOption = {
        value: groupValueOption.value,
        label: groupValueOption.label,
        count: groupValueOption.count,

        /*
         * Preserve the complete backend visualization object so
         * future fields do not require changing this hook first.
         */
        visualizationAvailability: visualization,
    };

    if (
        visualizationKey
        === "annotation_network"
    ) {
        return {
            ...baseOption,

            networkSourceTaskType:
                visualization
                    ?.network_source_task_type
                ?? null,
        };
    }

    if (
        visualizationKey
        === "volcano"
    ) {
        return {
            ...baseOption,

            defaultRnaType:
                visualization
                    ?.default_rna_type
                ?? null,

            defaultDegScope:
                visualization
                    ?.default_deg_scope
                ?? null,

            availableDegRnaTypes: toArray(
                visualization
                    ?.available_deg_rna_types
            ),

            availableDegScopes: toArray(
                visualization
                    ?.available_deg_scopes
            ),
        };
    }

    if (
        visualizationKey
        === "log2fc_correlation"
    ) {
        return {
            ...baseOption,

            availableBackgroundTypes: toArray(
                visualization
                    ?.available_background_types
            ),
        };
    }

    return baseOption;
};


const buildVisualizationGroupValueOptions = (
    groupValueOptions
) => {
    const result = Object.fromEntries(
        SCST_ANNOTATION_VISUALIZATION_KEYS.map(
            key => [
                key,
                [],
            ]
        )
    );

    for (
        const groupValueOption
        of groupValueOptions
        ) {
        for (
            const visualizationKey
            of SCST_ANNOTATION_VISUALIZATION_KEYS
            ) {
            const option = (
                normalizeVisualizationGroupValueOption({
                    visualizationKey,
                    groupValueOption,
                })
            );

            if (option) {
                result[
                    visualizationKey
                    ].push(option);
            }
        }
    }

    return result;
};


const buildVisualizationGroupValues = (
    visualizationGroupValueOptions
) => {
    return Object.fromEntries(
        SCST_ANNOTATION_VISUALIZATION_KEYS.map(
            visualizationKey => [
                visualizationKey,
                toArray(
                    visualizationGroupValueOptions
                        ?.[visualizationKey]
                ).map(
                    option => option.value
                ),
            ]
        )
    );
};


const buildVisualizationDefaultGroupValues = ({
    defaultGroupValue,
    visualizationGroupValueOptions,
}) => {
    return Object.fromEntries(
        SCST_ANNOTATION_VISUALIZATION_KEYS.map(
            visualizationKey => {
                const options = toArray(
                    visualizationGroupValueOptions
                        ?.[visualizationKey]
                );

                const defaultOption = (
                    options.find(
                        option => (
                            option.value
                            === defaultGroupValue
                        )
                    )
                    ?? options[0]
                    ?? null
                );

                return [
                    visualizationKey,
                    defaultOption?.value ?? null,
                ];
            }
        )
    );
};


const buildVisualizationAvailability = (
    visualizationGroupValueOptions
) => {
    return Object.fromEntries(
        SCST_ANNOTATION_VISUALIZATION_KEYS.map(
            visualizationKey => [
                visualizationKey,
                toArray(
                    visualizationGroupValueOptions
                        ?.[visualizationKey]
                ).length > 0,
            ]
        )
    );
};


const normalizeGroupByOption = option => {
    const value = option?.value ?? null;

    const groupValueOptions = toArray(
        option?.group_value_options
    ).map(
        normalizeGroupValueOption
    );

    /*
     * Backend shape:
     *
     * group_by
     *   -> group_value
     *       -> visualizations
     *
     * Frontend shape prepared here:
     *
     * group_by
     *   -> visualization
     *       -> available group_value options
     */
    const visualizationGroupValueOptions = (
        buildVisualizationGroupValueOptions(
            groupValueOptions
        )
    );

    const visualizationGroupValues = (
        buildVisualizationGroupValues(
            visualizationGroupValueOptions
        )
    );

    const defaultGroupValue = (
        option?.default_group_value
        ?? null
    );

    const visualizationDefaultGroupValues = (
        buildVisualizationDefaultGroupValues({
            defaultGroupValue,
            visualizationGroupValueOptions,
        })
    );

    const visualizations = (
        buildVisualizationAvailability(
            visualizationGroupValueOptions
        )
    );

    const availableVisualizationCount = (
        Object.values(
            visualizations
        ).filter(Boolean).length
    );

    return {
        value,
        label: option?.label ?? value ?? "",

        available: Boolean(
            option?.available
            && availableVisualizationCount > 0
        ),

        annotationDirAvailable: Boolean(
            option?.annotation_dir_available
        ),

        groupValueCount: toNumber(
            option?.group_value_count
        ),

        skippedGroupValueCount: toNumber(
            option?.skipped_group_value_count
        ),

        availableGroupValueCount: toNumber(
            option?.available_group_value_count
        ),

        defaultGroupValue,

        /*
         * Original group-value data is retained for diagnostics
         * and any future cross-visualization use.
         */
        groupValues: toArray(
            option?.group_values
        ),
        groupValueOptions,

        /*
         * Primary fields for future visualization Sections.
         */
        visualizations,
        availableVisualizationCount,

        visualizationGroupValues,
        visualizationGroupValueOptions,
        visualizationDefaultGroupValues,

        raw: option ?? null,
    };
};


export const useSCSTDatasetAnnotationAvailable = ({
    datasetName,
    dataType,
}) => {
    const shouldFetch = Boolean(
        datasetName
        && ["sc", "st"].includes(dataType)
    );

    const url = shouldFetch
        ? getSCSTDatasetAnnotationAvailableURL({
            datasetName,
            dataType,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher,
    );

    const groupByOptions = useMemo(() => {
        return toArray(
            data?.group_by_options
        ).map(
            normalizeGroupByOption
        );
    }, [
        data?.group_by_options,
    ]);

    const availableGroupByOptions = useMemo(() => {
        return groupByOptions.filter(
            option => option.available
        );
    }, [
        groupByOptions,
    ]);

    return {
        annotationAvailability: data ?? null,

        source: data?.source ?? "SCST",
        dataType:
            data?.data_type ?? dataType ?? null,
        datasetName:
            data?.dataset_name
            ?? datasetName
            ?? null,

        available: Boolean(
            data?.available
            && availableGroupByOptions.length > 0
        ),

        idColumn:
            data?.id_column ?? null,

        sampleCount: toNumber(
            data?.sample_count
        ),

        configuredGroupByCount: toNumber(
            data?.configured_group_by_count
        ),

        availableGroupByCount: toNumber(
            data?.available_group_by_count
        ),

        defaultGroupBy:
            data?.default_group_by ?? null,

        /*
         * groupByOptions keeps every configured group-by entry.
         * availableGroupByOptions is the list intended for the
         * page-level Group By selector.
         */
        groupByOptions,
        availableGroupByOptions,

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
