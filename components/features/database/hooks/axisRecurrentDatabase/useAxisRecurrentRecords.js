"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "@/lib/api/axios";
import {
    getAxisRecurrentRecordsURL,
} from "@/lib/api/database/axisRecurrentDatabase";


const DEFAULT_PAGINATION = {
    current: 1,
    pageSize: 10,
    total: 0,
    numPages: 0,
};

const FALLBACK_SORTER = {
    field: "dataset_count",
    order: "descend",
};


const SINGLE_BOOLEAN_FILTER_FIELDS = new Set([
    "has_axis_final",
    "has_sponge",
    "has_both_result_context",
    "regulation_available",
]);


const normalizeFilters = value => {
    if (
        !value
        || typeof value !== "object"
        || Array.isArray(value)
    ) {
        return {};
    }

    const normalizedEntries = [];

    Object.entries(value).forEach(([
        fieldName,
        rawFieldValue,
    ]) => {
        let fieldValue = rawFieldValue;

        if (
            SINGLE_BOOLEAN_FILTER_FIELDS.has(fieldName)
            && Array.isArray(fieldValue)
        ) {
            const booleanValues = [
                ...new Set(
                    fieldValue.filter(item =>
                        typeof item === "boolean"
                    )
                ),
            ];

            if (booleanValues.length === 1) {
                [fieldValue] = booleanValues;
            } else {
                // [] or [true, false] both mean no effective filter.
                return;
            }
        }

        if (
            fieldValue === null
            || fieldValue === undefined
            || fieldValue === ""
        ) {
            return;
        }

        if (
            Array.isArray(fieldValue)
            && fieldValue.length === 0
        ) {
            return;
        }

        normalizedEntries.push([
            fieldName,
            fieldValue,
        ]);
    });

    return Object.fromEntries(
        normalizedEntries
    );
};


const normalizeSorter = value => {
    const field = String(
        value?.field
        || value?.sort_field
        || FALLBACK_SORTER.field
    ).trim();

    const order = (
        value?.order === "ascend"
        || value?.order === "descend"
        || value?.sort_order === "ascend"
        || value?.sort_order === "descend"
    )
        ? (
            value?.order
            || value?.sort_order
        )
        : FALLBACK_SORTER.order;

    return {
        field: field || FALLBACK_SORTER.field,
        order,
    };
};


const useAxisRecurrentRecords = ({
    initialPattern = "",
    defaultFilters = {},
    defaultSort = FALLBACK_SORTER,
    enabled = true,
} = {}) => {
    const normalizedDefaultFilters = useMemo(
        () => normalizeFilters(defaultFilters),
        [defaultFilters],
    );

    const normalizedDefaultSorter = useMemo(
        () => normalizeSorter(defaultSort),
        [defaultSort],
    );

    const [pattern, setPattern] = useState(
        () => String(initialPattern || "").trim()
    );
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState(
        DEFAULT_PAGINATION
    );
    const [sorter, setSorter] = useState(
        FALLBACK_SORTER
    );

    const [isConfigured, setIsConfigured] = useState(false);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!enabled || isConfigured) {
            return;
        }

        setFilters(normalizedDefaultFilters);
        setSorter(normalizedDefaultSorter);
        setPagination(DEFAULT_PAGINATION);
        setIsConfigured(true);
    }, [
        enabled,
        isConfigured,
        normalizedDefaultFilters,
        normalizedDefaultSorter,
    ]);

    const fetchRecords = useCallback(async () => {
        if (!enabled || !isConfigured) {
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(
                getAxisRecurrentRecordsURL(),
                {
                    page: pagination.current,
                    page_size: pagination.pageSize,
                    pattern,
                    filters: normalizeFilters(filters),
                    sort_field: sorter.field,
                    sort_order: sorter.order,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            const data = response.data || {};

            setRecords(
                Array.isArray(data.results)
                    ? data.results
                    : []
            );

            setPagination(prev => ({
                ...prev,
                current: data.page ?? prev.current,
                pageSize: data.page_size ?? prev.pageSize,
                total: data.count ?? 0,
                numPages: data.num_pages ?? 0,
            }));
        } catch (requestError) {
            setError(requestError);
            setRecords([]);
        } finally {
            setIsLoading(false);
        }
    }, [
        enabled,
        isConfigured,
        pagination.current,
        pagination.pageSize,
        pattern,
        filters,
        sorter.field,
        sorter.order,
    ]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleSearch = useCallback(value => {
        setPattern(String(value ?? "").trim());

        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, []);

    const handleFiltersChange = useCallback(nextFilters => {
        setFilters(
            normalizeFilters(nextFilters)
        );

        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(normalizedDefaultFilters);

        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, [normalizedDefaultFilters]);

    const handleTableChange = useCallback((
        nextPagination,
        _tableFilters,
        tableSorter,
    ) => {
        setPagination(prev => ({
            ...prev,
            current: nextPagination.current ?? prev.current,
            pageSize: nextPagination.pageSize ?? prev.pageSize,
        }));

        const normalizedTableSorter = Array.isArray(tableSorter)
            ? tableSorter[0]
            : tableSorter;

        const sortField = (
            normalizedTableSorter?.columnKey
            || normalizedTableSorter?.field
        );

        if (
            sortField
            && normalizedTableSorter?.order
        ) {
            setSorter({
                field: String(sortField),
                order: normalizedTableSorter.order,
            });
            return;
        }

        setSorter(normalizedDefaultSorter);
    }, [normalizedDefaultSorter]);

    return {
        records,
        pattern,
        filters,
        pagination,
        sorter,

        isReady: isConfigured,
        isLoading,
        isError: Boolean(error),
        error,

        setFilters: handleFiltersChange,
        clearFilters,
        handleSearch,
        handleTableChange,
        mutate: fetchRecords,
    };
};


export default useAxisRecurrentRecords;
