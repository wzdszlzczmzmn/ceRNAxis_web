import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortExpCorrelationOptionsURL } from "@/lib/api/analysis";

export const usePairedCohortExpCorrelationOptions = ({
    taskUUID,
}) => {
    const url = getPairedCohortExpCorrelationOptionsURL({
        taskUUID,
    });

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        optionsData: data ?? null,

        uuid: data?.uuid ?? taskUUID ?? null,
        taskName: data?.task_name ?? null,
        correlationFile: data?.correlation_file ?? null,
        validTypes: data?.valid_types ?? [],
        count: data?.count ?? 0,
        results: data?.results ?? [],

        isLoading,
        isError: error,
        mutate,
    };
};
