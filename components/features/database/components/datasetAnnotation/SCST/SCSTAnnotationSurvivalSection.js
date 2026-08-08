"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import SurvivalKMAnalysisView
    from "@/components/features/common/SurvivalKM/SurvivalKMAnalysisView";
import {
    useSCSTDatasetAnnotationSurvivalKM,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationSurvivalKM";


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
            value:
            item.value,

            label:
                item.label
                ?? item.value,
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


const SCSTAnnotationSurvivalSectionContent = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,

    height = 620,
}) => {
    /*
     * Dataset Annotation availability already filters this list
     * to Group Values with a survival result file.
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

    const [
        groupValue,
        setGroupValue,
    ] = useState(null);

    /*
     * Match the Workflow component:
     * preserve the current selection while it remains valid.
     *
     * Dataset Annotation additionally respects the visualization-
     * specific defaultGroupValue when initialization is needed.
     */
    useEffect(() => {
        setGroupValue(prev => {
            const currentGroupStillValid = (
                groupOptions.some(
                    item => (
                        item.value
                        === prev
                    )
                )
            );

            if (currentGroupStillValid) {
                return prev;
            }

            return (
                getInitialGroupValue({
                    groupOptions,
                    defaultGroupValue,
                })
            );
        });
    }, [
        groupOptions,
        defaultGroupValue,
    ]);

    const {
        survivalData,
        titlePrimary,
        titleSecondary,
        summary,

        isLoading: isSurvivalLoading,
        isError: isSurvivalError,
    } = (
        useSCSTDatasetAnnotationSurvivalKM({
            dataset,
            dataType,
            groupBy,
            groupValue,
        })
    );

    return (
        <SurvivalKMAnalysisView
            title="Survival Analysis"
            height={height}

            groupOptions={
                groupOptions
            }
            groupValue={
                groupValue
            }
            groupLabel={
                groupBy
                ?? "Group"
            }
            onGroupChange={
                setGroupValue
            }

            survivalData={
                survivalData
            }
            titlePrimary={
                titlePrimary
            }
            titleSecondary={
                titleSecondary
            }
            summary={
                summary
            }

            isLoading={
                isSurvivalLoading
            }

            isError={
                isSurvivalError
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
                        "No Survival Analysis "
                        + "group value is available."
                    )
                    : null
            }

            emptyDescription={
                "No survival analysis data "
                + "for the selected group"
            }

            showTcgaBasedTag
        />
    );
};


const SCSTAnnotationSurvivalSection = props => {
    /*
     * The local groupValue state does not include page-level
     * groupBy. Remount when the Dataset Annotation context changes
     * so identical literal Group Values in different Group By
     * fields cannot preserve stale selection state.
     */
    const sectionKey = [
        props.dataset ?? "",
        props.dataType ?? "",
        props.groupBy ?? "",
    ].join("::");

    return (
        <SCSTAnnotationSurvivalSectionContent
            key={sectionKey}
            {...props}
        />
    );
};


export default SCSTAnnotationSurvivalSection;
