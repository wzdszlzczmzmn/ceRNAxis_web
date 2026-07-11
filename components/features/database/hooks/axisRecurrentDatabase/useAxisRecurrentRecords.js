"use client";

import {
    useCallback,
    useEffect,
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

const DEFAULT_SORTER = {
    field: "project_count",
    order: "descend",
};


const useAxisRecurrentRecords = () => {
    const [pattern, setPattern] = useState("");
    const [filters, setFilters] = useState({});

    const [pagination, setPagination] = useState(
        DEFAULT_PAGINATION
    );

    const [sorter, setSorter] = useState(
        DEFAULT_SORTER
    );

    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(
                getAxisRecurrentRecordsURL(),
                {
                    page: pagination.current,
                    page_size: pagination.pageSize,

                    pattern,
                    filters,

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

            setRecords(data.results || []);

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

    const handleSearch = useCallback((value) => {
        setPattern(String(value ?? "").trim());

        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, []);

    const handleFiltersChange = useCallback((nextFilters) => {
        setFilters(nextFilters);

        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});

        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    }, []);

    const handleTableChange = useCallback((
        nextPagination,
        _tableFilters,
        tableSorter,
    ) => {
        setPagination(prev => ({
            ...prev,
            current: nextPagination.current,
            pageSize: nextPagination.pageSize,
        }));

        const normalizedSorter = Array.isArray(tableSorter)
            ? tableSorter[0]
            : tableSorter;

        setSorter({
            field: normalizedSorter?.field || "project_count",
            order: normalizedSorter?.order || "descend",
        });
    }, []);

    return {
        records,
        pattern,
        filters,
        pagination,
        sorter,

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
