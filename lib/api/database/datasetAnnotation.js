import { DATABASE_API_BASE } from "@/lib/api/config"

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

export const getTCGADatasetAnnotationNetworkURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_network/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationNetworkURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_network/?${params.toString()}`;
};

export const getDatasetAnnotationNetworkURL = ({
    source,
    datasetName,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationNetworkURL(datasetName);
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationNetworkURL(datasetName);
    }

    throw new Error(`Unsupported dataset annotation source: ${source}`);
};

export const getTCGADatasetAnnotationAxisFinalURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_axis_final/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationAxisFinalURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_axis_final/?${params.toString()}`;
};

export const getDatasetAnnotationAxisFinalURL = ({
    source,
    datasetName,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationAxisFinalURL(datasetName);
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationAxisFinalURL(datasetName);
    }

    throw new Error(
        `Unsupported dataset annotation axis final source: ${source}`
    );
};

export const getTCGADatasetAnnotationCMapURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/tcga_dataset_annotation_cmap/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationCMapURL = datasetName => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_cmap/?${params.toString()}`;
};

export const getDatasetAnnotationCMapURL = ({
    source,
    datasetName,
}) => {
    if (!source || !datasetName) return null;

    if (source === "TCGA") {
        return getTCGADatasetAnnotationCMapURL(datasetName);
    }

    if (source === "TIMEDB") {
        return getTIMEDBDatasetAnnotationCMapURL(datasetName);
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
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
        rna_type: rnaType,
        deg_scope: degScope,
        deg_method: degMethod,
        use_padj: String(usePadj),
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_deg_volcano/?${params.toString()}`;
};

export const getDatasetAnnotationDEGVolcanoURL = ({
    source,
    datasetName,
    rnaType = "mRNA",
    degScope = "all",
    degMethod = "limma",
    usePadj = true,
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
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    if (interactionType) {
        params.set("type", interactionType);
    }

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_log2fc_correlation/?${params.toString()}`;
};

export const getDatasetAnnotationLog2FCCorrelationURL = ({
    source,
    datasetName,
    interactionType,
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
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_survival_km/?${params.toString()}`;
};

export const getDatasetAnnotationSurvivalKMURL = ({
    source,
    datasetName,
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
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_deg_pathway/?${params.toString()}`;
};

export const getDatasetAnnotationDEGPathwayURL = ({
    source,
    datasetName,
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
}) => {
    if (!datasetName) return null;

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_exp_correlation_options/?${params.toString()}`;
};

export const getTIMEDBDatasetAnnotationExpCorrelationPlotDataURL = ({
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

    return `${DATABASE_API_BASE}/timedb_dataset_annotation_exp_correlation_plot_data/?${params.toString()}`;
};

export const getDatasetAnnotationExpCorrelationOptionsURL = ({
    source,
    datasetName,
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
        });
    }

    throw new Error(
        `Unsupported dataset annotation expression correlation source: ${source}`
    );
};
