"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import VolcanoAnalysisView
    from "@/components/features/common/Volcano/VolcanoAnalysisView";
import {
    useVolcanoQueryConfig,
} from "@/components/features/common/Volcano/useVolcanoQueryConfig";
import {
    useSCSTDatasetAnnotationDEGVolcano,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationDEGVolcano";


const FALLBACK_DEG_RNA_TYPES = [
    "mRNA",
];

const FALLBACK_DEG_SCOPES = [
    "all",
];

const DEFAULT_DATASET_ANNOTATION_CUTOFFS = Object.freeze({
    mRNA: Object.freeze({
        logfc_cutoff: 0.000001,
        pvalue_cutoff: 0.05,
    }),
});


const normalizeGroupValueOptions = options => {
    return (
        Array.isArray(options)
            ? options
            : []
    ).filter(
        option => (
            option
            && option.value !== null
            && option.value !== undefined
            && String(option.value).trim()
        )
    );
};


const findGroupValueOption = ({
    value,
    options,
}) => {
    if (
        value === null
        || value === undefined
    ) {
        return null;
    }

    return (
        options.find(
            option => (
                option.value === value
            )
        )
        ?? null
    );
};


const getInitialGroupValue = ({
    options,
    defaultGroupValue,
}) => {
    const defaultOption = (
        findGroupValueOption({
            value: defaultGroupValue,
            options,
        })
    );

    return (
        defaultOption?.value
        ?? options[0]?.value
        ?? null
    );
};


const SCSTAnnotationVolcanoAnalysisSection = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,

    height = 620,

    degMethod = "limma",
    usePadj = false,
    cutoffsByRnaType = DEFAULT_DATASET_ANNOTATION_CUTOFFS,
}) => {
    const normalizedGroupValueOptions = useMemo(
        () => (
            normalizeGroupValueOptions(
                groupValueOptions
            )
        ),
        [
            groupValueOptions,
        ],
    );

    /*
     * Volcano owns its own Group Value selection.
     *
     * Bind it to groupBy so changing the page-level Group By
     * immediately invalidates the previous Group Value before
     * a new request can be constructed.
     */
    const [
        selection,
        setSelection,
    ] = useState({
        groupBy: null,
        groupValue: null,
    });

    const groupValue = (
        selection.groupBy === groupBy
            ? selection.groupValue
            : null
    );

    useEffect(() => {
        if (
            !groupBy
            || normalizedGroupValueOptions.length === 0
        ) {
            setSelection({
                groupBy:
                    groupBy ?? null,
                groupValue:
                    null,
            });
            return;
        }

        setSelection(previousSelection => {
            const isSameGroupBy = (
                previousSelection.groupBy
                === groupBy
            );

            const previousOption = (
                isSameGroupBy
                    ? findGroupValueOption({
                        value:
                        previousSelection.groupValue,
                        options:
                        normalizedGroupValueOptions,
                    })
                    : null
            );

            if (previousOption) {
                return previousSelection;
            }

            return {
                groupBy,
                groupValue: getInitialGroupValue({
                    options:
                    normalizedGroupValueOptions,
                    defaultGroupValue,
                }),
            };
        });
    }, [
        groupBy,
        defaultGroupValue,
        normalizedGroupValueOptions,
    ]);

    const currentGroupOption = useMemo(
        () => (
            findGroupValueOption({
                value: groupValue,
                options:
                normalizedGroupValueOptions,
            })
        ),
        [
            groupValue,
            normalizedGroupValueOptions,
        ],
    );

    /*
     * These fields are already normalized by
     * useSCSTDatasetAnnotationAvailable().
     */
    const availableDegRnaTypes = useMemo(
        () => (
            currentGroupOption
                ?.availableDegRnaTypes
                ?.length
                ? currentGroupOption
                    .availableDegRnaTypes
                : FALLBACK_DEG_RNA_TYPES
        ),
        [
            currentGroupOption,
        ],
    );

    const availableDegScopes = useMemo(
        () => (
            currentGroupOption
                ?.availableDegScopes
                ?.length
                ? currentGroupOption
                    .availableDegScopes
                : FALLBACK_DEG_SCOPES
        ),
        [
            currentGroupOption,
        ],
    );

    const {
        queryConfig,
        setQueryConfig,
    } = useVolcanoQueryConfig({
        availableDegRnaTypes,
        availableDegScopes,
    });

    const queryReady = Boolean(
        groupValue
        && availableDegRnaTypes.includes(
            queryConfig.rnaType
        )
        && availableDegScopes.includes(
            queryConfig.degScope
        )
    );

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = useSCSTDatasetAnnotationDEGVolcano({
        dataset,
        dataType,
        groupBy,
        groupValue,

        rnaType: (
            queryReady
                ? queryConfig.rnaType
                : null
        ),

        degScope: (
            queryReady
                ? queryConfig.degScope
                : null
        ),

        degMethod,
        usePadj,
    });

    const handleGroupValueChange = value => {
        setSelection({
            groupBy,
            groupValue: value,
        });
    };

    return (
        <VolcanoAnalysisView
            title="Expression Volcano Plot"
            height={height}

            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}

            groupOptions={
                normalizedGroupValueOptions.map(
                    option => ({
                        label:
                            option.label
                            ?? option.value,
                        value:
                        option.value,
                    })
                )
            }
            groupValue={groupValue}
            groupLabel={
                groupBy
                || "Group"
            }
            onGroupChange={
                handleGroupValueChange
            }
            showGroupSelect

            volcanoData={volcanoData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}

            availableDegRnaTypes={
                availableDegRnaTypes
            }
            availableDegScopes={
                availableDegScopes
            }
            showDegScopeSelect={
                availableDegScopes.length > 1
            }

            cutoffsByRnaType={
                cutoffsByRnaType
            }
            usePadj={usePadj}

            isLoading={isLoading}
            isError={isError}

            missingDescription={
                !dataset
                    ? "Missing dataset."
                    : !dataType
                        ? "Missing SC/ST data type."
                        : !groupBy
                            ? "Missing annotation Group By."
                            : !groupValue
                                ? "No Volcano group value selected."
                                : null
            }

            unavailableDescription={
                !queryReady
                && groupValue
                    ? (
                        "No DEG configuration is available "
                        + "for the selected group value."
                    )
                    : null
            }
        />
    );
};


export default SCSTAnnotationVolcanoAnalysisSection;
