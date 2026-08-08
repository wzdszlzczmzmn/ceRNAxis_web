"use client";

import {
    useMemo,
    useState,
} from "react";

import CMScoreAnalysisView
    from "@/components/features/common/CMScore/CMScoreAnalysisView";
import {
    useTCGADatasetAnnotationCMScoreOptions, useTCGADatasetAnnotationCMScoreResult
} from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationCMScore"



const TASK_TYPE = "PairedCohortTask";


const TCGAAnnotationCMScoreSectionContent = ({
    dataset,
    height = 660,
}) => {
    const [
        selectedItem,
        setSelectedItem,
    ] = useState(null);

    const [
        selectedDataset,
        setSelectedDataset,
    ] = useState(null);

    const {
        options: itemOptions,
        defaultItem,
        isLoading: itemLoading,
        isError: itemError,
    } = useTCGADatasetAnnotationCMScoreOptions({
        dataset,
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
    } = useTCGADatasetAnnotationCMScoreResult({
        dataset,
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
                + "for this dataset"
            }
        />
    );
};


const TCGAAnnotationCMScoreSection = props => (
    <TCGAAnnotationCMScoreSectionContent
        key={
            props.dataset
            ?? "none"
        }
        {...props}
    />
);


export default TCGAAnnotationCMScoreSection;
