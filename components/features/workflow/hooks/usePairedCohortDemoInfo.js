import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortDemoInfoURL } from "@/lib/api/analysis";

export const usePairedCohortDemoInfo = () => {
    const { data, error, isLoading, mutate } = useSWR(
        getPairedCohortDemoInfoURL(),
        fetcher
    );

    return {
        demoInfo: data ?? null,

        workflowType: data?.workflow_type ?? null,
        taskType: data?.task_type ?? null,
        description: data?.description ?? "",
        validRnaTypes: data?.valid_rna_types ?? [],

        csvFiles: data?.csv_files ?? {},
        parquetFiles: data?.parquet_files ?? {},
        fileStatus: data?.file_status ?? {},

        isLoading,
        isError: error,
        mutate,
    };
};
