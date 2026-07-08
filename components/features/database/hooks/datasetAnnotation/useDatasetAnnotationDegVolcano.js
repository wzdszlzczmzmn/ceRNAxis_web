import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationDEGVolcanoURL } from "@/lib/api/database/datasetAnnotation"

const EMPTY_SUMMARY = {
    raw_count: 0,
    cleaned_count: 0,
    dropped_count: 0,
    not_sig: 0,
    down: 0,
    up: 0,
};

const EMPTY_GROUPS = {
    NotSig: [],
    Down: [],
    Up: [],
};

const GROUPS = ["NotSig", "Down", "Up"];

const DEG_SCOPE_LABEL_MAP = {
    all: "All",
    intersect: "Intersect",
};

const normalizeVolcanoData = data => {
    if (!data) return null;

    const normalizedGroups = {};

    GROUPS.forEach(group => {
        normalizedGroups[group] = (data.groups?.[group] || []).map(item => ({
            gene_name: item.gene_name,
            log2FC: item.log2FC,
            pvalue: item.pvalue,
            neg_log10_pvalue: item.neg_log10_pvalue,
        }));
    });

    return {
        ...data,
        summary: data.summary ?? EMPTY_SUMMARY,
        groups: normalizedGroups,
    };
};

const formatTitleSecondary = ({
    volcanoData,
    rnaType,
    degScope,
}) => {
    if (!volcanoData) {
        return [rnaType, degScope]
            .filter(Boolean)
            .join(" · ");
    }

    const scopeLabel = DEG_SCOPE_LABEL_MAP[volcanoData.deg_scope] ??
        volcanoData.deg_scope;

    return [
        volcanoData.deg_method,
        volcanoData.rna_type,
        scopeLabel,
    ]
        .filter(Boolean)
        .join(" · ");
};

export const useDatasetAnnotationDegVolcano = ({
    source,
    datasetName,
    rnaType,
    degScope = "all",
    degMethod = "limma",
    usePadj = true,
    groupBy = null,
    groupType = null,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const shouldFetch = Boolean(
        source &&
        datasetName &&
        rnaType &&
        degScope &&
        degMethod &&
        (!isTIMEDB || (groupBy && groupType))
    );

    const url = shouldFetch
        ? getDatasetAnnotationDEGVolcanoURL({
            source,
            datasetName,
            rnaType,
            degScope,
            degMethod,
            usePadj,
            groupBy,
            groupType,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    const volcanoData = normalizeVolcanoData(data);

    return {
        volcanoData,

        source: volcanoData?.source ?? source ?? null,
        datasetName: volcanoData?.dataset_name ?? datasetName ?? null,

        groupBy: volcanoData?.group_by ?? groupBy ?? null,
        groupType: volcanoData?.group_type ?? groupType ?? null,

        annotationDirName: volcanoData?.annotation_dir_name ?? null,
        annotationFilePrefix: volcanoData?.annotation_file_prefix ?? null,
        networkSourceTaskType: volcanoData?.network_source_task_type ?? null,

        degMethod: volcanoData?.deg_method ?? degMethod ?? null,
        rnaType: volcanoData?.rna_type ?? rnaType ?? null,
        degScope: volcanoData?.deg_scope ?? degScope ?? null,
        degFile: volcanoData?.deg_file ?? null,

        availableDegRnaTypes: volcanoData?.available_deg_rna_types ?? [],
        availableDegScopes: volcanoData?.available_deg_scopes ?? [],

        titlePrimary: volcanoData?.dataset_name ?? datasetName ?? null,
        titleSecondary: formatTitleSecondary({
            volcanoData,
            rnaType,
            degScope,
        }),

        summary: volcanoData?.summary ?? EMPTY_SUMMARY,
        groups: volcanoData?.groups ?? EMPTY_GROUPS,

        meta: {
            source: volcanoData?.source,
            networkSourceTaskType: volcanoData?.network_source_task_type,
            degMethod: volcanoData?.deg_method,
            usePadj: volcanoData?.use_padj,
            groupBy: volcanoData?.group_by ?? groupBy ?? null,
            groupType: volcanoData?.group_type ?? groupType ?? null,
        },

        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
