"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import SCSTAnnotationGroupValueSelector
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationGroupValueSelector";
import {
    useSCSTDatasetAnnotationAxisFinal,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationAxisFinal";


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


const SCSTAnnotationAxisFinalSection = ({
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
     * Bind the selection to the current groupBy.
     *
     * When groupBy changes, selectedGroupValue becomes null
     * immediately, preventing a transient request using the new
     * groupBy together with the previous groupValue.
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
             * Preserve a valid manual choice while the page
             * remains on the same Group By.
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
        count,
        columns,
        results,
        isLoading,
        isError,
    } = useSCSTDatasetAnnotationAxisFinal({
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
        <AxisFinalResultCard
            title="ceRNA Axis Final Results"
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


export default SCSTAnnotationAxisFinalSection;
