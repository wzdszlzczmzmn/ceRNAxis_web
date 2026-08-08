"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import CMapResultCard
    from "@/components/features/common/CMap/CMapResultCard";
import SCSTAnnotationGroupValueSelector
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationGroupValueSelector";
import {
    useSCSTDatasetAnnotationCMapResult,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationCMapResult";


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


const SCSTAnnotationCMapResultSection = ({
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
     * The CMap group-value selection belongs to this Section.
     *
     * Binding the state to groupBy prevents a transient request
     * with a newly selected groupBy and the previous groupValue.
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
             * Preserve the user's manual CMap group-value choice
             * only while staying within the same Group By.
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
        columns,
        count,
        results,
        isLoading,
        isError,
    } = useSCSTDatasetAnnotationCMapResult({
        dataset,
        dataType,
        groupBy,
        groupValue:
        selectedGroupValue,
    });

    const handleGroupValueChange = value => {
        setSelection({
            groupBy,
            groupValue: value,
        });
    };

    return (
        <CMapResultCard
            title="CMap Results"
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
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
        />
    );
};


export default SCSTAnnotationCMapResultSection;
