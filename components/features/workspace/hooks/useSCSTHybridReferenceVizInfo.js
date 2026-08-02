import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTHybridReferenceVizInfoURL,
} from "@/lib/api/analysis";


export const useSCSTHybridReferenceVizInfo = ({
    taskUUID,
    enabled = true,
}) => {
    const shouldFetch = Boolean(
        enabled
        && taskUUID
    );

    const url = shouldFetch
        ? getSCSTHybridReferenceVizInfoURL({
            taskUUID,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    } = useSWR(
        url,
        fetcher
    );

    return {
        taskInfo: {
            uuid: data?.uuid,
            taskType: data?.task_type,
            taskName: data?.task_name,
            status: data?.status,
            statusLabel: data?.status_label,
            dataType: data?.data_type,
            dataTypeLabel: data?.data_type_label,
            tcgaType: data?.tcga_type,
            lncrnaType: data?.lncrna_type,
        },

        groupInfo: {
            metaFile: data?.meta_file,
            idColumn: data?.id_column,
            groupCol: data?.group_col,
            groupCount: data?.group_count ?? 0,
            sampleCount: data?.sample_count ?? 0,
            groupValues: data?.group_values ?? [],
            groupOptions: data?.group_options ?? [],
        },

        availability: {
            backgroundTypesByGroup:
                data?.available_background_types_by_group
                ?? {},
            degRNATypesByGroup:
                data?.available_deg_rna_types_by_group
                ?? {},
            degScopesByGroup:
                data?.available_deg_scopes_by_group
                ?? {},
        },

        rawData: data,

        isLoading,
        isValidating,
        isError: Boolean(error),
        error,
        mutate,
    };
};
