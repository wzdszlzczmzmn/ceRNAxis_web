import useSWR from "swr";

import api from "@/lib/api/axios";
import { getHybridReferenceDemoExpressionDataURL } from "@/lib/api/analysis";

const fetcher = async ([url, payload]) => {
    const response = await api.post(url, payload);
    return response.data;
};

export const useHybridReferenceDemoExpressionData = ({
    rnaType,
    genes,
}) => {
    const normalizedGenes = Array.isArray(genes)
        ? genes.filter(Boolean)
        : [];

    const shouldFetch = Boolean(rnaType) && normalizedGenes.length > 0;

    const {
        data,
        error,
        isLoading,
    } = useSWR(
        shouldFetch
            ? [
                getHybridReferenceDemoExpressionDataURL(),
                {
                    rna_type: rnaType,
                    genes: normalizedGenes,
                },
            ]
            : null,
        fetcher
    );

    return {
        rnaType: data?.rna_type ?? rnaType,
        fileFormat: data?.file_format ?? "",
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],
        isLoading,
        isError: Boolean(error),
        error,
    };
};
