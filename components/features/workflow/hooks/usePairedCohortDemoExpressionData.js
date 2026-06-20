import useSWR from "swr";
import api from "@/lib/api/axios";
import { getPairedCohortDemoExpressionDataURL } from "@/lib/api/analysis";

const postPairedCohortDemoExpressionData = async ([url, payload]) => {
    const response = await api.post(url, payload);
    return response.data;
};

export const usePairedCohortDemoExpressionData = ({
    rnaType,
    genes,
}) => {
    const shouldFetch =
        Boolean(rnaType) &&
        Array.isArray(genes) &&
        genes.length > 0;

    const key = shouldFetch
        ? [
            getPairedCohortDemoExpressionDataURL(),
            {
                rna_type: rnaType,
                genes,
            },
        ]
        : null;

    const { data, error, isLoading, mutate } = useSWR(
        key,
        postPairedCohortDemoExpressionData
    );

    return {
        expressionData: data ?? null,

        workflowType: data?.workflow_type ?? null,
        rnaType: data?.rna_type ?? rnaType ?? null,
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],

        isLoading,
        isError: error,
        mutate,
    };
};
