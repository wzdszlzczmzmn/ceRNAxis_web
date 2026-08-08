import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";


const toArray = value => {
    return Array.isArray(value)
        ? value
        : [];
};


const normalizeGroupByValue = value => {
    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();
};


const findGroupByOption = ({
    value,
    options,
}) => {
    const normalizedValue = (
        normalizeGroupByValue(value)
    );

    if (!normalizedValue) {
        return null;
    }

    return (
        options.find(
            option => (
                normalizeGroupByValue(
                    option?.value
                )
                === normalizedValue
            )
        )
        ?? null
    );
};


/*
 * SC/ST page-level selection owns Group By only.
 *
 * Group Value selection intentionally belongs to each
 * visualization Section independently.
 */
export const useSCSTDatasetAnnotationGroupBySelection = ({
    datasetName,
    groupByOptions,
    defaultGroupBy,
    initialGroupBy = null,
    isLoading = false,
}) => {
    const initializedDatasetRef = useRef(null);

    const normalizedOptions = useMemo(() => {
        return toArray(
            groupByOptions
        ).filter(
            option => option?.available
        );
    }, [
        groupByOptions,
    ]);

    const [
        groupBy,
        setGroupBy,
    ] = useState(null);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (
            normalizedOptions.length === 0
        ) {
            setGroupBy(null);
            initializedDatasetRef.current = (
                datasetName
            );
            return;
        }

        const isNewDataset = (
            initializedDatasetRef.current
            !== datasetName
        );

        const initialOption = (
            findGroupByOption({
                value: initialGroupBy,
                options: normalizedOptions,
            })
        );

        const defaultOption = (
            findGroupByOption({
                value: defaultGroupBy,
                options: normalizedOptions,
            })
        );

        setGroupBy(previousGroupBy => {
            const previousOption = (
                findGroupByOption({
                    value: previousGroupBy,
                    options: normalizedOptions,
                })
            );

            if (
                !isNewDataset
                && previousOption
            ) {
                return previousOption.value;
            }

            if (initialOption) {
                return initialOption.value;
            }

            if (defaultOption) {
                return defaultOption.value;
            }

            return (
                normalizedOptions[0]
                    ?.value
                ?? null
            );
        });

        initializedDatasetRef.current = (
            datasetName
        );
    }, [
        datasetName,
        defaultGroupBy,
        initialGroupBy,
        normalizedOptions,
        isLoading,
    ]);

    const currentGroupByOption = useMemo(() => {
        return (
            findGroupByOption({
                value: groupBy,
                options: normalizedOptions,
            })
        );
    }, [
        groupBy,
        normalizedOptions,
    ]);

    return {
        groupBy,
        setGroupBy,

        groupByOptions: normalizedOptions,
        currentGroupByOption,
    };
};
