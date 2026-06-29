import useSWR from "swr";

import api from "@/lib/api/axios";
import { getHybridReferenceDemoInfoURL } from "@/lib/api/analysis";

const fetcher = async (url) => {
    const response = await api.get(url);
    return response.data;
};

export const useHybridReferenceDemoInfo = () => {
    const {
        data,
        error,
        isLoading,
    } = useSWR(
        getHybridReferenceDemoInfoURL(),
        fetcher
    );

    return {
        demoInfo: data,
        isLoading,
        isError: Boolean(error),
        error,
    };
};
