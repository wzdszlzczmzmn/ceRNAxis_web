"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DEGPathwayAnalysisView
    from "@/components/features/common/DEGPathway/DEGPathwayAnalysisView";
import {
    useSCSTDatasetAnnotationDEGPathway,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationDEGPathway";


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


const SCSTAnnotationDEGPathwaySectionContent = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,

    height = 680,
}) => {
    /*
     * Dataset Annotation availability already filters this list
     * to Group Values that have a DEG Pathway result.
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
     * preserve the selected group while it remains valid.
     *
     * Dataset Annotation additionally respects the visualization-
     * specific defaultGroupValue on initialization/fallback.
     */
    useEffect(() => {
        setGroupValue(prev => {
            const isValid = (
                groupOptions.some(
                    item => (
                        item.value
                        === prev
                    )
                )
            );

            if (isValid) {
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
        pathwayData,
        title: pathwayTitle,
        summary,

        isLoading: isPathwayLoading,
        isError: isPathwayError,
    } = (
        useSCSTDatasetAnnotationDEGPathway({
            dataset,
            dataType,
            groupBy,
            groupValue,
        })
    );

    return (
        <DEGPathwayAnalysisView
            title="DEG Pathway Enrichment Plot"
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

            pathwayData={
                pathwayData
            }
            pathwayTitle={
                pathwayTitle
            }
            summary={
                summary
            }

            isLoading={
                isPathwayLoading
            }

            isError={
                isPathwayError
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
                        "No DEG pathway enrichment "
                        + "group value is available."
                    )
                    : null
            }

            emptyDescription={
                "No DEG pathway enrichment data "
                + "for the selected group"
            }
        />
    );
};


const SCSTAnnotationDEGPathwaySection = props => {
    /*
     * groupValue is local state and does not itself encode groupBy.
     * Remount the inner section when the Dataset Annotation context
     * changes so an identical literal Group Value in another
     * Group By cannot preserve stale selection state.
     */
    const sectionKey = [
        props.dataset ?? "",
        props.dataType ?? "",
        props.groupBy ?? "",
    ].join("::");

    return (
        <SCSTAnnotationDEGPathwaySectionContent
            key={sectionKey}
            {...props}
        />
    );
};


export default SCSTAnnotationDEGPathwaySection;
