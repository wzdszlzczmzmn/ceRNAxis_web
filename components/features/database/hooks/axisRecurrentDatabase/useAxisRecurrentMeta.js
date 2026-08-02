"use client";

import { useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getAxisRecurrentMetaURL,
} from "@/lib/api/database/axisRecurrentDatabase";


const normalizeDefaultSort = defaultSort => {
    const sortField = String(
        defaultSort?.sort_field || "dataset_count"
    ).trim();

    const sortOrder = (
        defaultSort?.sort_order === "ascend"
        || defaultSort?.sort_order === "descend"
    )
        ? defaultSort.sort_order
        : "descend";

    return {
        field: sortField,
        order: sortOrder,
    };
};


const useAxisRecurrentMeta = () => {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        getAxisRecurrentMetaURL(),
        fetcher,
    );

    const filterOptions = useMemo(() => {
        const fields = Array.isArray(data?.fields)
            ? data.fields.filter(field =>
                (
                    field?.field_type === "items"
                    || field?.field_type === "number"
                )
                && field?.field_name
            )
            : [];

        return {
            table_name: data?.table_name || "",
            fields,
        };
    }, [data]);

    const defaultFilters = useMemo(() => {
        const value = data?.default_filters;

        if (
            !value
            || typeof value !== "object"
            || Array.isArray(value)
        ) {
            return {};
        }

        return { ...value };
    }, [data]);

    const defaultSort = useMemo(
        () => normalizeDefaultSort(
            data?.default_sort
        ),
        [data],
    );

    const columnMeta = useMemo(
        () => Array.isArray(data?.columns)
            ? data.columns
            : [],
        [data],
    );

    return {
        meta: data ?? null,
        patternMeta: data?.pattern ?? null,
        columnMeta,
        filterOptions,
        defaultFilters,
        defaultSort,

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};


export default useAxisRecurrentMeta;
