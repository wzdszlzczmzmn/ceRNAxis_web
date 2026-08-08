"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import CMScoreAnalysisView
    from "@/components/features/common/CMScore/CMScoreAnalysisView";
import {
    useSCSTDatasetAnnotationCMScoreOptions, useSCSTDatasetAnnotationCMScoreResult
} from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationCMScore"


const TASK_TYPE = "SCSTHybridReferenceTask";


const normalizeGroupOptions = options => (
    Array.isArray(options)
        ? options.map(item => ({
            value:
            item.value,

            label:
                item.label
                ?? item.value,
        }))
        : []
);


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


const SCSTAnnotationCMScoreSectionContent = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,

    height = 660,
}) => {
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

    const [
        selectedItem,
        setSelectedItem,
    ] = useState(null);

    const [
        selectedDataset,
        setSelectedDataset,
    ] = useState(null);

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
        options: itemOptions,
        defaultItem,
        isLoading: itemLoading,
        isError: itemError,
    } = useSCSTDatasetAnnotationCMScoreOptions({
        dataset,
        dataType,
        groupBy,
        groupValue,
    });

    const resolvedItem = useMemo(() => {
        if (
            selectedItem
            && itemOptions.some(
                item => (
                    item.value
                    === selectedItem
                )
            )
        ) {
            return selectedItem;
        }

        return (
            defaultItem
            ?? itemOptions[0]?.value
            ?? null
        );
    }, [
        selectedItem,
        itemOptions,
        defaultItem,
    ]);

    const {
        cmScoreData,
        defaultDataset,
        datasetOptions,
        isLoading: resultLoading,
        isError: resultError,
    } = useSCSTDatasetAnnotationCMScoreResult({
        dataset,
        dataType,
        groupBy,
        groupValue,
        item:
        resolvedItem,
    });

    const resolvedDataset = useMemo(() => {
        if (
            selectedDataset
            && datasetOptions.some(
                item => (
                    item.value
                    === selectedDataset
                )
            )
        ) {
            return selectedDataset;
        }

        return (
            defaultDataset
            ?? datasetOptions[0]?.value
            ?? null
        );
    }, [
        selectedDataset,
        datasetOptions,
        defaultDataset,
    ]);

    const handleGroupChange = value => {
        setGroupValue(
            value
            ?? null
        );

        setSelectedItem(
            null
        );

        setSelectedDataset(
            null
        );
    };

    const handleItemChange = value => {
        setSelectedItem(
            value
            ?? null
        );

        setSelectedDataset(
            null
        );
    };

    return (
        <CMScoreAnalysisView
            taskType={TASK_TYPE}
            title="CM-Score Results"
            height={height}

            groupOptions={groupOptions}
            groupValue={groupValue}
            groupLabel={
                groupBy
                ?? "Group"
            }
            onGroupChange={handleGroupChange}

            selectedItem={resolvedItem}
            itemOptions={itemOptions}
            itemLoading={itemLoading}
            onItemChange={handleItemChange}

            selectedDataset={resolvedDataset}
            datasetOptions={datasetOptions}
            datasetLoading={resultLoading}
            onDatasetChange={
                value => (
                    setSelectedDataset(
                        value
                        ?? null
                    )
                )
            }

            cmScoreData={cmScoreData}

            isLoading={resultLoading}
            isError={
                itemError
                || resultError
            }

            emptyDescription={
                "No CM-score results available "
                + "for the selected group"
            }
        />
    );
};


const SCSTAnnotationCMScoreSection = props => {
    const sectionKey = [
        props.dataset
        ?? "",
        props.dataType
        ?? "",
        props.groupBy
        ?? "",
    ].join("::");

    return (
        <SCSTAnnotationCMScoreSectionContent
            key={sectionKey}
            {...props}
        />
    );
};


export default SCSTAnnotationCMScoreSection;
