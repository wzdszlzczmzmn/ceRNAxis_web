import useSWR from "swr";

import api from "@/lib/api/axios";
import { getHybridReferenceDemoExpressionGeneListURL } from "@/lib/api/analysis";

const fetcher = async (url) => {
    const response = await api.get(url);
    return response.data;
};

export const useHybridReferenceDemoExpressionGeneList = ({
    rnaType,
}) => {
    const shouldFetch = Boolean(rnaType);

    const params = new URLSearchParams({
        rna_type: rnaType || "",
    });

    const {
        data,
        error,
        isLoading,
    } = useSWR(
        shouldFetch
            ? `${getHybridReferenceDemoExpressionGeneListURL()}?${params.toString()}`
            : null,
        fetcher
    );

    return {
        rnaType: data?.rna_type ?? rnaType,
        fileFormat: data?.file_format ?? "",
        sampleColumn: data?.sample_column ?? "",
        count: data?.count ?? 0,
        genes: data?.genes ?? [],
        isLoading,
        isError: Boolean(error),
        error,
    };
};
