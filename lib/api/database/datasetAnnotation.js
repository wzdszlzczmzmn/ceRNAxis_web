import { DATABASE_API_BASE } from "@/lib/api/config"

const buildSCSTVisualizationParams = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    if (!dataset) {
        throw new Error(
            "Missing SC/ST dataset annotation dataset."
        );
    }

    if (!["sc", "st"].includes(dataType)) {
        throw new Error(
            "Invalid SC/ST dataset annotation data type."
        );
    }

    if (!groupBy) {
        throw new Error(
            "Missing SC/ST dataset annotation group by."
        );
    }

    if (!groupValue) {
        throw new Error(
            "Missing SC/ST dataset annotation group value."
        );
    }

    return new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
    });
};

const requireValue = (value, message) => {
    if (
        value === null
        || value === undefined
        || String(value).trim() === ""
    ) {
        throw new Error(message);
    }

    return String(value).trim();
};

export const getTCGADatasetAnnotationAvailableURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset_name: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_available/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationAvailableURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset_name: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_available/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationAvailableURL = ({
    datasetName,
    dataType,
}) => {
    if (!datasetName) {
        throw new Error(
            "Missing SC/ST dataset annotation dataset."
        );
    }

    if (!["sc", "st"].includes(dataType)) {
        throw new Error(
            "Invalid SC/ST dataset annotation data type."
        );
    }

    const params = new URLSearchParams({
        dataset: datasetName,
        data_type: dataType,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_available/`
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationAvailableURL = ({
    source,
    datasetName,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationAvailableURL(datasetName);
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationAvailableURL(datasetName);
    }

    throw new Error(`Unsupported dataset annotation source: ${source}`);
};

export const getTIMEDBDatasetGroupByOptionsURL = ({
    datasetName,
}) => {
    const params = new URLSearchParams();

    params.set("dataset", datasetName);

    return `${DATABASE_API_BASE}/timedb_dataset_group_by_options/?${params.toString()}`;
};

export const getTCGADatasetAnnotationNetworkURL = ({
    datasetName,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_network/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationNetworkURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_network/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationNetworkURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const params = buildSCSTVisualizationParams({
        dataset,
        dataType,
        groupBy,
        groupValue,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_network/`
        + `?${params.toString()}`
    );
};


export const getDatasetAnnotationNetworkURL = ({
    source,
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationNetworkURL({
            datasetName,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationNetworkURL({
            datasetName,
            groupBy,
            groupType,
        });
    }

    throw new Error(`Unsupported dataset annotation source: ${source}`);
};

export const getTCGADatasetAnnotationAxisFinalURL = ({
    datasetName,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_axis_final/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationAxisFinalURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_axis_final/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationAxisFinalURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const params = buildSCSTVisualizationParams({
        dataset,
        dataType,
        groupBy,
        groupValue,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_axis_final/`
        + `?${params.toString()}`
    );
};


export const getDatasetAnnotationAxisFinalURL = ({
    source,
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationAxisFinalURL({
            datasetName,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationAxisFinalURL({
            datasetName,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation axis final source: ${source}`
    );
};

export const getTCGADatasetAnnotationCMapURL = ({
    datasetName,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_cmap/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationCMapURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_cmap/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationCMapURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const params = buildSCSTVisualizationParams({
        dataset,
        dataType,
        groupBy,
        groupValue,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_cmap/`
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationCMapURL = ({
    source,
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationCMapURL({
            datasetName,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationCMapURL({
            datasetName,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation CMap source: ${source}`
    );
};

export const getTCGADatasetAnnotationDEGVolcanoURL = ({
    datasetName,
    rnaType = "mRNA",
    degScope = "all",
    degMethod = "limma",
    usePadj = true,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
        rna_type: rnaType,
        deg_scope: degScope,
        deg_method: degMethod,
        use_padj: String(usePadj),
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_deg_volcano/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationDEGVolcanoURL = ({
    datasetName,
    rnaType = "mRNA",
    degScope = "all",
    degMethod = "limma",
    usePadj = true,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
        rna_type: rnaType,
        deg_scope: degScope,
        deg_method: degMethod,
        use_padj: String(usePadj),
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_deg_volcano/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationDEGVolcanoURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
    rnaType = "mRNA",
    degScope = "all",
    degMethod = "limma",
    usePadj = false,
}) => {
    const params = buildSCSTVisualizationParams({
        dataset,
        dataType,
        groupBy,
        groupValue,
    });

    if (!rnaType) {
        throw new Error(
            "Missing SC/ST Dataset Annotation DEG RNA type."
        );
    }

    if (!degScope) {
        throw new Error(
            "Missing SC/ST Dataset Annotation DEG scope."
        );
    }

    if (!degMethod) {
        throw new Error(
            "Missing SC/ST Dataset Annotation DEG method."
        );
    }

    params.set(
        "rna_type",
        rnaType,
    );

    params.set(
        "deg_scope",
        degScope,
    );

    params.set(
        "deg_method",
        degMethod,
    );

    params.set(
        "use_padj",
        usePadj
            ? "true"
            : "false",
    );

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_deg_volcano/`
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationDEGVolcanoURL = ({
    source,
    datasetName,
    rnaType = "mRNA",
    degScope = "all",
    degMethod = "limma",
    usePadj = true,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationDEGVolcanoURL({
            datasetName,
            rnaType,
            degScope,
            degMethod,
            usePadj,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationDEGVolcanoURL({
            datasetName,
            rnaType,
            degScope,
            degMethod,
            usePadj,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation DEG volcano source: ${source}`
    );
};

export const getTCGADatasetAnnotationLog2FCCorrelationURL = ({
    datasetName,
    interactionType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (interactionType) {
        params.set("type", interactionType);
    }

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_log2fc_correlation/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationLog2FCCorrelationURL = ({
    datasetName,
    interactionType,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (interactionType) {
        params.set("type", interactionType);
    }

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_log2fc_correlation/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationLog2FCCorrelationURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
    interactionType,
}) => {
    if (!dataset) {
        throw new Error(
            "Missing SC/ST Dataset Annotation dataset."
        );
    }

    if (!["sc", "st"].includes(dataType)) {
        throw new Error(
            "Invalid SC/ST Dataset Annotation data type."
        );
    }

    if (!groupBy) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group by."
        );
    }

    if (!groupValue) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group value."
        );
    }

    if (!interactionType) {
        throw new Error(
            "Missing SC/ST Dataset Annotation interaction type."
        );
    }

    const params = new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
        type: interactionType,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_log2fc_correlation/`
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationLog2FCCorrelationURL = ({
    source,
    datasetName,
    interactionType,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationLog2FCCorrelationURL({
            datasetName,
            interactionType,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationLog2FCCorrelationURL({
            datasetName,
            interactionType,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation log2FC correlation source: ${source}`
    );
};

export const getTCGADatasetAnnotationSurvivalKMURL = ({
    datasetName,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_survival_km/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationSurvivalKMURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_survival_km/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationSurvivalKMURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    if (!dataset) {
        throw new Error(
            "Missing SC/ST Dataset Annotation dataset."
        );
    }

    if (!["sc", "st"].includes(dataType)) {
        throw new Error(
            "Invalid SC/ST Dataset Annotation data type."
        );
    }

    if (!groupBy) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group by."
        );
    }

    if (!groupValue) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group value."
        );
    }

    const params = new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_survival_km/`
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationSurvivalKMURL = ({
    source,
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationSurvivalKMURL({
            datasetName,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationSurvivalKMURL({
            datasetName,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation survival source: ${source}`
    );
};

export const getTCGADatasetAnnotationDEGPathwayURL = ({
    datasetName,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_deg_pathway/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationDEGPathwayURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_deg_pathway/?${params.toString()}`;
};

export const getSCSTDatasetAnnotationDEGPathwayURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    if (!dataset) {
        throw new Error(
            "Missing SC/ST Dataset Annotation dataset."
        );
    }

    if (!["sc", "st"].includes(dataType)) {
        throw new Error(
            "Invalid SC/ST Dataset Annotation data type."
        );
    }

    if (!groupBy) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group by."
        );
    }

    if (!groupValue) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group value."
        );
    }

    const params = new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
    });

    return (
        `${DATABASE_API_BASE}/scst_dataset_annotation_deg_pathway/`
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationDEGPathwayURL = ({
    source,
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationDEGPathwayURL({
            datasetName,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationDEGPathwayURL({
            datasetName,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation DEG pathway source: ${source}`
    );
};

export const getTCGADatasetAnnotationExpCorrelationOptionsURL = ({
    datasetName,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_exp_correlation_options/?${params.toString()}`;
};

export const getTCGADatasetAnnotationExpCorrelationPlotDataURL = ({
    datasetName,
    type,
    gene1,
    gene2,
}) => {
    if (!datasetName || !type || !gene1 || !gene2) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
        type,
        gene1,
        gene2,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_exp_correlation_plot_data/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationExpCorrelationOptionsURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_exp_correlation_options/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationExpCorrelationPlotDataURL = ({
    datasetName,
    type,
    gene1,
    gene2,
    groupBy,
    groupType,
}) => {
    if (!datasetName || !type || !gene1 || !gene2) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
        type,
        gene1,
        gene2,
    });

    if (groupBy) {
        params.set("group_by", groupBy);
    }

    if (groupType) {
        params.set("group_type", groupType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_exp_correlation_plot_data/?${params.toString()}`;
};

const buildSCSTDatasetAnnotationExpCorrelationParams = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    if (!dataset) {
        throw new Error(
            "Missing SC/ST Dataset Annotation dataset."
        );
    }

    if (!["sc", "st"].includes(dataType)) {
        throw new Error(
            "Invalid SC/ST Dataset Annotation data type."
        );
    }

    if (!groupBy) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group by."
        );
    }

    if (!groupValue) {
        throw new Error(
            "Missing SC/ST Dataset Annotation group value."
        );
    }

    return new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
    });
};


export const getSCSTDatasetAnnotationExpCorrelationOptionsURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const params = (
        buildSCSTDatasetAnnotationExpCorrelationParams({
            dataset,
            dataType,
            groupBy,
            groupValue,
        })
    );

    return (
        `${DATABASE_API_BASE}/`
        + "scst_dataset_annotation_exp_correlation_options/"
        + `?${params.toString()}`
    );
};


export const getSCSTDatasetAnnotationExpCorrelationPlotDataURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
    type,
    gene1,
    gene2,
}) => {
    const params = (
        buildSCSTDatasetAnnotationExpCorrelationParams({
            dataset,
            dataType,
            groupBy,
            groupValue,
        })
    );

    if (!type) {
        throw new Error(
            "Missing SC/ST Dataset Annotation correlation type."
        );
    }

    if (!gene1) {
        throw new Error(
            "Missing SC/ST Dataset Annotation gene1."
        );
    }

    if (!gene2) {
        throw new Error(
            "Missing SC/ST Dataset Annotation gene2."
        );
    }

    params.set(
        "type",
        type,
    );

    params.set(
        "gene1",
        gene1,
    );

    params.set(
        "gene2",
        gene2,
    );

    return (
        `${DATABASE_API_BASE}/`
        + "scst_dataset_annotation_exp_correlation_plot_data/"
        + `?${params.toString()}`
    );
};

export const getDatasetAnnotationExpCorrelationOptionsURL = ({
    source,
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationExpCorrelationOptionsURL({
            datasetName,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationExpCorrelationOptionsURL({
            datasetName,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation expression correlation source: ${source}`
    );
};

export const getDatasetAnnotationExpCorrelationPlotDataURL = ({
    source,
    datasetName,
    type,
    gene1,
    gene2,
    groupBy,
    groupType,
}) => {
    if (!source || !datasetName || !type || !gene1 || !gene2) {
        return null;
    }

    if (source === "TCGA") {
        return getTCGADatasetAnnotationExpCorrelationPlotDataURL({
            datasetName,
            type,
            gene1,
            gene2,
        });
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationExpCorrelationPlotDataURL({
            datasetName,
            type,
            gene1,
            gene2,
            groupBy,
            groupType,
        });
    }

    throw new Error(
        `Unsupported dataset annotation expression correlation source: ${source}`
    );
};

// Sponge URLs
export const getTCGADatasetAnnotationSpongeURL = ({
    datasetName,
}) => {
    if (!datasetName) {
        throw new Error(
            "Missing TCGA dataset annotation Sponge dataset."
        );
    }

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return (
        `${DATABASE_API_BASE}/tcga_dataset_annotation_sponge/` +
        `?${params.toString()}`
    );
};


export const getTIMEDBDatasetAnnotationSpongeURL = ({
    datasetName,
    groupBy,
    groupType,
}) => {
    if (!datasetName) {
        throw new Error(
            "Missing TIMEDB dataset annotation Sponge dataset."
        );
    }

    if (!groupBy) {
        throw new Error(
            "Missing TIMEDB dataset annotation Sponge group_by."
        );
    }

    if (!groupType) {
        throw new Error(
            "Missing TIMEDB dataset annotation Sponge group_type."
        );
    }

    const params = new URLSearchParams({
        dataset: datasetName,
        group_by: groupBy,
        group_type: groupType,
    });

    return (
        `${DATABASE_API_BASE}/timedb_dataset_annotation_sponge/` +
        `?${params.toString()}`
    );
};

export const getTCGADatasetAnnotationCMScoreOptionsURL = ({
    dataset,
}) => {
    const params = new URLSearchParams({
        dataset: requireValue(
            dataset,
            "Missing TCGA dataset."
        ),
    });

    return (
        `${DATABASE_API_BASE}/`
        + "tcga_dataset_annotation_cm_score_options/"
        + `?${params.toString()}`
    );
};


export const getTCGADatasetAnnotationCMScoreResultURL = ({
    dataset,
    item,
}) => {
    const params = new URLSearchParams({
        dataset: requireValue(
            dataset,
            "Missing TCGA dataset."
        ),
        item: requireValue(
            item,
            "Missing CM-score item."
        ),
    });

    return (
        `${DATABASE_API_BASE}/`
        + "tcga_dataset_annotation_cm_score_result/"
        + `?${params.toString()}`
    );
};


export const getTIMEDBDatasetAnnotationCMScoreOptionsURL = ({
    dataset,
    groupBy,
    groupType,
}) => {
    const params = new URLSearchParams({
        dataset: requireValue(
            dataset,
            "Missing TIMEDB dataset."
        ),
        group_by: requireValue(
            groupBy,
            "Missing TIMEDB group_by."
        ),
        group_type: requireValue(
            groupType,
            "Missing TIMEDB group_type."
        ),
    });

    return (
        `${DATABASE_API_BASE}/`
        + "timedb_dataset_annotation_cm_score_options/"
        + `?${params.toString()}`
    );
};


export const getTIMEDBDatasetAnnotationCMScoreResultURL = ({
    dataset,
    groupBy,
    groupType,
    item,
}) => {
    const params = new URLSearchParams({
        dataset,
        group_by: groupBy,
        group_type: groupType,
        item,
    });

    return (
        `${DATABASE_API_BASE}/`
        + "timedb_dataset_annotation_cm_score_result/"
        + `?${params.toString()}`
    );
};


export const getSCSTDatasetAnnotationCMScoreOptionsURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
}) => {
    const params = new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
    });

    return (
        `${DATABASE_API_BASE}/`
        + "scst_dataset_annotation_cm_score_options/"
        + `?${params.toString()}`
    );
};


export const getSCSTDatasetAnnotationCMScoreResultURL = ({
    dataset,
    dataType,
    groupBy,
    groupValue,
    item,
}) => {
    const params = new URLSearchParams({
        dataset,
        data_type: dataType,
        group_by: groupBy,
        group_value: groupValue,
        item,
    });

    return (
        `${DATABASE_API_BASE}/`
        + "scst_dataset_annotation_cm_score_result/"
        + `?${params.toString()}`
    );
};
