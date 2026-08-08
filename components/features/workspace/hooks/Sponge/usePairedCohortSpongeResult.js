import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getPairedCohortSpongeResultURL } from "@/lib/api/analysis";


export const usePairedCohortSpongeResult = ({
    taskUUID,
}) => {
    const url = taskUUID
        ? getPairedCohortSpongeResultURL({
            taskUUID,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher,
    );

    return {
        uuid: data?.uuid,
        taskType: data?.task_type,
        taskName: data?.task_name,

        spongeFile: data?.sponge_file,
        count: data?.count ?? 0,
        columns: Array.isArray(data?.columns)
            ? data.columns
            : [],
        summary: data?.summary ?? null,

        projectMatchEnabled: (
            data?.axis_reference_match_enabled
            ?? data?.axis_project_match_enabled
            ?? false
        ),
        projectMatchSummary: (
            data?.axis_reference_match_summary
            ?? data?.axis_project_match_summary
            ?? null
        ),

        results: Array.isArray(data?.results)
            ? data.results
            : [],

        meta: {
            mapInfo: data?.map_info,
            degMethod: data?.deg_method,
            usePadj: data?.use_padj,
            cancerType: data?.cancer_type,
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
