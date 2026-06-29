import useSWR from "swr";

import api from "@/lib/api/axios";
import { getHybridReferenceDemoSampleMetaURL } from "@/lib/api/analysis";

const fetcher = async (url) => {
    const response = await api.get(url);
    return response.data;
};

export const useHybridReferenceDemoSampleMeta = () => {
    const {
        data,
        error,
        isLoading,
    } = useSWR(
        getHybridReferenceDemoSampleMetaURL(),
        fetcher
    );

    return {
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        isLoading,
        isError: Boolean(error),
        error,
    };
};
