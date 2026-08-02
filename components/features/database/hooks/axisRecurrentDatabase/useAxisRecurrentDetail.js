"use client";

import { useMemo } from "react";
import useSWR from "swr";

import api from "@/lib/api/axios";
import {
    getAxisRecurrentDetailURL,
} from "@/lib/api/database/axisRecurrentDatabase";


const fetcher = async url => {
    const response = await api.get(url);
    return response.data;
};


const normalizeSignature = value => {
    if (Array.isArray(value)) {
        return String(value[0] || "").trim();
    }

    return String(value || "").trim();
};


const useAxisRecurrentDetail = signature => {
    const normalizedSignature = normalizeSignature(
        signature
    );

    const url = useMemo(() => {
        if (!normalizedSignature) {
            return null;
        }

        return getAxisRecurrentDetailURL(
            normalizedSignature
        );
    }, [normalizedSignature]);

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    } = useSWR(
        url,
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
        },
    );

    const records = Array.isArray(data?.results)
        ? data.results
        : [];

    return {
        data: data ?? null,
        success: data?.success === true,

        signature: normalizedSignature,
        summary: data?.summary ?? null,
        statistics: data?.statistics ?? null,
        records,
        count: Number(data?.count ?? records.length),

        isLoading: Boolean(url) && isLoading,
        isValidating,
        isError: Boolean(error),
        error,

        mutate,
    };
};


export default useAxisRecurrentDetail;
