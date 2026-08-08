"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import NetworkResultCard
    from "@/components/features/common/NetworkResult/NetworkResultCard";
import SCSTAnnotationGroupValueSelector
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationGroupValueSelector";
import {
    useSCSTDatasetAnnotationNetworkResult,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationNetworkResult";


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


const SCSTAnnotationNetworkResultSection = ({
    dataset,
    dataType,
    groupBy,

    groupValueOptions = [],
    defaultGroupValue = null,
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
     * Bind the selected value to the current groupBy.
     *
     * This prevents one transient request such as:
     *
     *   new groupBy + previous groupValue
     *
     * before the effect has had a chance to reset the value.
     */
    const [
        selection,
        setSelection,
    ] = useState({
        groupBy: null,
        groupValue: null,
    });

    const selectedGroupValue = (
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
                groupBy: groupBy ?? null,
                groupValue: null,
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

            /*
             * Preserve a valid manual selection only while
             * remaining in the same groupBy.
             */
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

    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } = useSCSTDatasetAnnotationNetworkResult({
        dataset,
        dataType,
        groupBy,
        groupValue:
        selectedGroupValue,
    });

    const isAvailable = (
        Boolean(
            dataset
            && dataType
            && groupBy
        )
        && normalizedGroupValueOptions.length > 0
    );

    const handleGroupValueChange = value => {
        setSelection({
            groupBy,
            groupValue: value,
        });
    };

    return (
        <NetworkResultCard
            title="ceRNA Network"
            titleExtra={
                <SCSTAnnotationGroupValueSelector
                    options={
                        normalizedGroupValueOptions
                    }
                    value={
                        selectedGroupValue
                    }
                    onChange={
                        handleGroupValueChange
                    }
                />
            }
            networkData={networkData}
            isLoading={isNetworkLoading}
            isError={isNetworkError}
            onRefresh={mutateNetwork}
            missingDescription={
                !dataset
                    ? "Missing dataset."
                    : !dataType
                        ? "Missing SC/ST data type."
                        : !groupBy
                            ? "Missing annotation group by."
                            : !selectedGroupValue
                                ? "No network group value selected."
                                : null
            }
            isAvailable={isAvailable}
            unavailableDescription={
                "No network result is available for this annotation group."
            }
            emptyDescription={
                "No network result data found."
            }
        />
    );
};


export default SCSTAnnotationNetworkResultSection;
