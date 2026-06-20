import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortDemoExpressionGeneListURL } from "@/lib/api/analysis";

export const usePairedCohortDemoExpressionGeneList = ({
    rnaType,
}) => {
    const url = getPairedCohortDemoExpressionGeneListURL({
        rnaType,
    });

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        geneListData: data ?? null,

        workflowType: data?.workflow_type ?? null,
        rnaType: data?.rna_type ?? rnaType ?? null,
        count: data?.count ?? 0,
        genes: data?.genes ?? data?.results ?? [],

        isLoading,
        isError: error,
        mutate,
    };
};
