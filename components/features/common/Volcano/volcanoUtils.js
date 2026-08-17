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

const GROUPS = [
    "NotSig",
    "Down",
    "Up",
];


export const normalizeVolcanoData = data => {
    if (!data) {
        return null;
    }

    const groups = {};

    GROUPS.forEach(group => {
        groups[group] = (
            data.groups?.[group] ?? []
        ).map(item => ({
            gene_name: item.gene_name,
            log2FC: item.log2FC,
            pvalue: item.pvalue,
            neg_log10_pvalue: item.neg_log10_pvalue,
            is_zero_pvalue: Boolean(item.is_zero_pvalue),
        }));
    });

    return {
        ...data,
        summary: data.summary ?? EMPTY_SUMMARY,
        groups,
    };
};


export const formatVolcanoTitleSecondary = ({
    volcanoData,
    rnaType,
    degScope,
}) => {
    if (!volcanoData) {
        return [
            rnaType,
            degScope,
        ]
            .filter(Boolean)
            .join(" · ");
    }

    const scopeLabel = {
        all: "All",
        intersect: "Intersect",
    }[
        volcanoData.deg_scope
        ] ?? volcanoData.deg_scope;


    return [
        volcanoData.deg_method,
        volcanoData.rna_type,
        scopeLabel,
    ]
        .filter(Boolean)
        .join(" · ");
};


export const normalizeVolcanoResult = ({
    data,
    error,
    isLoading,
    mutate,
    taskUUID,
    taskType,
    rnaType,
    degScope,
}) => {
    const volcanoData =
        normalizeVolcanoData(data);


    return {
        volcanoData,
        uuid:
            volcanoData?.uuid ??
            taskUUID ??
            null,
        taskType:
            volcanoData?.task_type ??
            taskType ??
            null,
        taskName:
            volcanoData?.task_name ??
            null,
        degMethod:
            volcanoData?.deg_method ??
            null,
        rnaType:
            volcanoData?.rna_type ??
            rnaType ??
            null,
        degScope:
            volcanoData?.deg_scope ??
            degScope ??
            null,
        degFile:
            volcanoData?.deg_file ??
            null,
        availableDegRnaTypes:
            volcanoData?.available_deg_rna_types ??
            [],
        availableDegScopes:
            volcanoData?.available_deg_scopes ??
            [],
        titlePrimary:
            volcanoData?.task_name ??
            taskUUID ??
            null,
        titleSecondary:
            formatVolcanoTitleSecondary({
                volcanoData,
                rnaType,
                degScope,
            }),
        summary:
            volcanoData?.summary ??
            EMPTY_SUMMARY,
        groups:
            volcanoData?.groups ??
            EMPTY_GROUPS,
        meta: {
            mapInfo: volcanoData?.map_info,
            degMethod: volcanoData?.deg_method,
            usePadj: volcanoData?.use_padj,
            tcgaType: volcanoData?.tcga_type,
            lncrnaType: volcanoData?.lncrna_type,
        },
        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
