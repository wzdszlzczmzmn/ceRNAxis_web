import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortDemoSampleMetaURL } from "@/lib/api/analysis";

export const usePairedCohortDemoSampleMeta = () => {
    const { data, error, isLoading, mutate } = useSWR(
        getPairedCohortDemoSampleMetaURL(),
        fetcher
    );

    return {
        sampleMetaData: data ?? null,

        workflowType: data?.workflow_type ?? null,
        fileFormat: data?.file_format ?? null,
        count: data?.count ?? 0,
        columns: data?.columns ?? [],
        results: data?.results ?? [],

        isLoading,
        isError: error,
        mutate,
    };
};
