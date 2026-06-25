import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortSurvivalKMURL } from "@/lib/api/analysis";

export const usePairedCohortSurvivalKM = (taskUUID) => {
    const url = getPairedCohortSurvivalKMURL(taskUUID);

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        survivalData: data ?? null,
        title: data?.title ?? "ceRNA axis-based survival analysis",
        titlePrimary: data?.task_name ?? "",
        titleSecondary: data?.survival_file ?? "",
        summary: data?.summary ?? null,
        groups: data?.groups ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
