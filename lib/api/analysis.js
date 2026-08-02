import { ANALYSIS_API_BASE, DATABASE_API_BASE } from "@/lib/api/config"

export const downloadSingleFile = (url) => {
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadBlob = ({
    blob,
    filename,
}) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
};


// Immune Annotations URLs
export const getImmuneAnnotationListURL = () => {
    return `${ANALYSIS_API_BASE}/immune_annotations/`;
};

export const getImmuneAnnotationDataURL = (mapInfo) => {
    const params = new URLSearchParams({
        map_info: mapInfo,
    });

    return `${ANALYSIS_API_BASE}/immune_annotation/?${params.toString()}`;
};

export const getImmuneAnnotationDownloadURL = (mapInfo) => {
    const params = new URLSearchParams({
        map_info: mapInfo,
    });

    return `${ANALYSIS_API_BASE}/immune_annotation_download/?${params.toString()}`;
};


// Task Submit URLs
export const getCustomListQuerySubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/custom_list_query_task_submit/`;
};

export const getPairedCohortSubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_task_submit/`;
};

export const getHybridReferenceSubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_task_submit/`;
};

export const getSCSTHybridReferenceSubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/scst_hybrid_reference_task_submit/`
}


// Task Result Download URLs
export const getWorkflowTaskResultDownloadURL = (taskUUID) => {
    if (!taskUUID) return null;

    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/workflow_task_result_download/?${params.toString()}`;
};


// Query Task URLs
export const getQueryTaskURL = () => {
    return `${ANALYSIS_API_BASE}/query_task/`;
}

export const buildWorkflowTaskQueryURL = (taskId) => {
    const params = new URLSearchParams({
        taskUUID: taskId,
    });

    return `${ANALYSIS_API_BASE}/query_task/?${params.toString()}`;
};


// Workflow Demo File Info URLs
export const getPairedCohortDemoInfoURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_demo_info/`;
};

export const getPairedCohortDemoSampleMetaURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_demo_sample_meta/`;
};

export const getPairedCohortDemoExpressionGeneListURL = ({
    rnaType,
}) => {
    if (!rnaType) return null;

    const params = new URLSearchParams({
        rna_type: rnaType,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_demo_expression_gene_list/?${params.toString()}`;
};

export const getPairedCohortDemoExpressionDataURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_demo_expression_data/`;
};

export const getPairedCohortDemoFilesDownloadURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_demo_download_data/`;
};

export const getHybridReferenceDemoInfoURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_demo_info/`;
};

export const getHybridReferenceDemoSampleMetaURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_demo_sample_meta/`;
};

export const getHybridReferenceDemoExpressionGeneListURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_demo_expression_gene_list/`;
};

export const getHybridReferenceDemoExpressionDataURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_demo_expression_data/`;
};

export const getHybridReferenceDemoFilesDownloadURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_demo_files_download/`;
};


// Workflow Run Demo URLs
export const getCustomListQueryRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/custom_list_query_run_demo/`;
};

export const getPairedCohortRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_run_demo/`;
};

export const getHybridReferenceRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_run_demo/`;
};


// Workflow Uploaded File Download URLs
export const getPairedCohortUploadedFileDownloadURL = ({
    taskUUID,
    fileType,
}) => {
    const params = new URLSearchParams({
        taskUUID,
        file_type: fileType,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_uploaded_file_download/?${params.toString()}`;
};

export const getHybridReferenceUploadedFileDownloadURL = ({
    taskUUID,
    fileType,
}) => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_uploaded_file_download/?taskUUID=${taskUUID}&file_type=${fileType}`;
};

export const getSCSTHybridReferenceUploadedFileDownloadURL = ({
    taskUUID,
    fileType,
}) => {
    return (
        `${ANALYSIS_API_BASE}`
        + `/scst_hybrid_reference_uploaded_file_download/`
        + `?taskUUID=${taskUUID}`
        + `&file_type=${fileType}`
    );
};


// Workflow Network Result URLs
export const getCustomListQueryNetworkResultURL = (taskUUID) => {
    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/custom_list_query_network/?${params.toString()}`;
};

export const getPairedCohortTaskNetworkURL = (taskUUID) => {
    if (!taskUUID) return null;

    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_task_network/?${params.toString()}`;
};

export const getHybridReferenceTaskNetworkURL = (taskUUID) => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_task_network/?taskUUID=${taskUUID}`;
};

export const getSCSTHybridReferenceTaskNetworkURL = ({
    taskUUID,
    groupValue,
}) => {
    return (
        `${ANALYSIS_API_BASE}`
        + `/scst_hybrid_reference_task_network/`
        + `?taskUUID=${taskUUID}`
        + `&groupValue=${encodeURIComponent(groupValue)}`
    );
};


// Workflow Axis Final URLs
export const getPairedCohortAxisFinalURL = ({
    taskUUID,
}) => {
    return (
        `${ANALYSIS_API_BASE}`
        + `/paired_cohort_axis_final/`
        + `?taskUUID=${taskUUID}`
    );
};


export const getHybridReferenceAxisFinalURL = ({
    taskUUID,
}) => {
    return (
        `${ANALYSIS_API_BASE}`
        + `/hybrid_reference_axis_final/`
        + `?taskUUID=${taskUUID}`
    );
};


export const getSCSTHybridReferenceAxisFinalURL = ({
    taskUUID,
    groupValue,
}) => {
    return (
        `${ANALYSIS_API_BASE}`
        + `/scst_hybrid_reference_axis_final/`
        + `?taskUUID=${taskUUID}`
        + `&groupValue=${encodeURIComponent(groupValue)}`
    );
};


// Workflow Sponge Result URLs
export const getWorkflowSpongeResultURL = ({
    taskType,
    taskUUID,
}) => {
    if (!taskUUID) {
        throw new Error("Missing Sponge result task UUID.");
    }

    const encodedTaskUUID = encodeURIComponent(taskUUID);

    if (taskType === "PairedCohortTask") {
        return (
            `${ANALYSIS_API_BASE}/paired_cohort_sponge_result/` +
            `?taskUUID=${encodedTaskUUID}`
        );
    }

    if (taskType === "HybridReferenceTask") {
        return (
            `${ANALYSIS_API_BASE}/hybrid_reference_sponge_result/` +
            `?taskUUID=${encodedTaskUUID}`
        );
    }

    throw new Error(
        `Unsupported Sponge result task type: ${taskType}`
    );
};


// Workflow CMap Result URLs
export const getCustomListQueryCMapResultURL = ({
    taskUUID,
}) => {
    return (
        `${ANALYSIS_API_BASE}/custom_list_query_cmap_result/`
        + `?taskUUID=${encodeURIComponent(taskUUID)}`
    );
};


export const getPairedCohortCMapResultURL = ({
    taskUUID,
}) => {
    return (
        `${ANALYSIS_API_BASE}/paired_cohort_cmap_result/`
        + `?taskUUID=${encodeURIComponent(taskUUID)}`
    );
};


export const getHybridReferenceCMapResultURL = ({
    taskUUID,
}) => {
    return (
        `${ANALYSIS_API_BASE}/hybrid_reference_cmap_result/`
        + `?taskUUID=${encodeURIComponent(taskUUID)}`
    );
};


export const getSCSTHybridReferenceCMapResultURL = ({
    taskUUID,
    groupValue,
}) => {
    return (
        `${ANALYSIS_API_BASE}/scst_hybrid_reference_cmap_result/`
        + `?taskUUID=${encodeURIComponent(taskUUID)}`
        + `&groupValue=${encodeURIComponent(groupValue)}`
    );
};


// Workflow Deg Volcano URLs
export const getPairedCohortDegVolcanoURL = ({
    taskUUID,
    rnaType,
    degScope,
}) => {
    const params = new URLSearchParams();

    params.set(
        "taskUUID",
        taskUUID,
    );

    params.set(
        "rna_type",
        rnaType,
    );

    params.set(
        "deg_scope",
        degScope,
    );

    return (
        `${ANALYSIS_API_BASE}/paired_cohort_deg_volcano/?`
        + params.toString()
    );
};


export const getHybridReferenceDegVolcanoURL = ({
    taskUUID,
    rnaType,
    degScope,
}) => {
    const params = new URLSearchParams();

    params.set(
        "taskUUID",
        taskUUID,
    );

    params.set(
        "rna_type",
        rnaType,
    );

    params.set(
        "deg_scope",
        degScope,
    );

    return (
        `${ANALYSIS_API_BASE}/hybrid_reference_deg_volcano/?`
        + params.toString()
    );
};


export const getSCSTHybridReferenceDegVolcanoURL = ({
    taskUUID,
    groupValue,
    rnaType,
    degScope,
}) => {
    const params = new URLSearchParams();

    params.set(
        "taskUUID",
        taskUUID,
    );

    params.set(
        "groupValue",
        groupValue,
    );

    params.set(
        "rna_type",
        rnaType,
    );

    params.set(
        "deg_scope",
        degScope,
    );

    return (
        `${ANALYSIS_API_BASE}/scst_hybrid_reference_deg_volcano/?`
        + params.toString()
    );
};


// Workflow Log2 FC Correlation URLs
export const getPairedCohortLog2FCCorrelationURL = ({
    taskUUID,
    interactionType,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (interactionType) {
        params.set("type", interactionType);
    }

    return `${ANALYSIS_API_BASE}/paired_cohort_correlation/?${params.toString()}`;
};

export const getHybridReferenceLog2FCCorrelationURL = ({
    taskUUID,
    interactionType,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (interactionType) {
        params.set("type", interactionType);
    }

    return `${ANALYSIS_API_BASE}/hybrid_reference_correlation/?${params.toString()}`;
};

export const getSCSTHybridReferenceLog2FCCorrelationURL = ({
    taskUUID,
    groupValue,
    interactionType,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (groupValue) {
        params.set("groupValue", groupValue);
    }

    if (interactionType) {
        params.set("type", interactionType);
    }

    return `${ANALYSIS_API_BASE}/scst_hybrid_reference_correlation/?${params.toString()}`;
};


// Workflow Exp Correlation URLs
export const getPairedCohortExpCorrelationOptionsURL = ({
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    return (
        `${ANALYSIS_API_BASE}/paired_cohort_exp_correlation_options/` +
        `?${params.toString()}`
    );
};


export const getPairedCohortExpCorrelationPlotDataURL = ({
    taskUUID,
    gene1,
    gene2,
    type,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (gene1) {
        params.set("gene1", gene1);
    }

    if (gene2) {
        params.set("gene2", gene2);
    }

    if (type) {
        params.set("type", type);
    }

    return (
        `${ANALYSIS_API_BASE}/paired_cohort_exp_correlation_plot_data/` +
        `?${params.toString()}`
    );
};


export const getHybridReferenceExpCorrelationOptionsURL = ({
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    return (
        `${ANALYSIS_API_BASE}/hybrid_reference_exp_correlation_options/` +
        `?${params.toString()}`
    );
};


export const getHybridReferenceExpCorrelationPlotDataURL = ({
    taskUUID,
    gene1,
    gene2,
    type,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (gene1) {
        params.set("gene1", gene1);
    }

    if (gene2) {
        params.set("gene2", gene2);
    }

    if (type) {
        params.set("type", type);
    }

    return (
        `${ANALYSIS_API_BASE}/hybrid_reference_exp_correlation_plot_data/` +
        `?${params.toString()}`
    );
};

export const getSCSTHybridReferenceExpCorrelationOptionsURL = ({
    taskUUID,
    groupValue,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (groupValue) {
        params.set("groupValue", groupValue);
    }

    return (
        `${ANALYSIS_API_BASE}/scst_hybrid_reference_exp_correlation_options/` +
        `?${params.toString()}`
    );
};

export const getSCSTHybridReferenceExpCorrelationPlotDataURL = ({
    taskUUID,
    groupValue,
    gene1,
    gene2,
    type,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (groupValue) {
        params.set("groupValue", groupValue);
    }

    if (gene1) {
        params.set("gene1", gene1);
    }

    if (gene2) {
        params.set("gene2", gene2);
    }

    if (type) {
        params.set("type", type);
    }

    return (
        `${ANALYSIS_API_BASE}/scst_hybrid_reference_exp_correlation_plot_data/` +
        `?${params.toString()}`
    );
};


// Workflow Survival KM URLs
export const getPairedCohortSurvivalKMURL = ({
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    return `${ANALYSIS_API_BASE}/paired_cohort_survival_km/?${params.toString()}`;
};


export const getHybridReferenceSurvivalKMURL = ({
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    return `${ANALYSIS_API_BASE}/hybrid_reference_survival_km/?${params.toString()}`;
};

export const getSCSTHybridReferenceSurvivalKMURL = ({
    taskUUID,
    groupValue,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) params.set("taskUUID", taskUUID);
    if (groupValue) params.set("groupValue", groupValue);

    return `${ANALYSIS_API_BASE}/scst_hybrid_reference_survival_km/?${params.toString()}`;
};


// Workflow Deg Pathway URLs
export const getPairedCohortDEGPathwayURL = ({ taskUUID }) => {
    const params = new URLSearchParams();
    if (taskUUID) params.set("taskUUID", taskUUID);

    return `${ANALYSIS_API_BASE}/paired_cohort_deg_pathway/?${params.toString()}`;
};

export const getHybridReferenceDEGPathwayURL = ({ taskUUID }) => {
    const params = new URLSearchParams();
    if (taskUUID) params.set("taskUUID", taskUUID);

    return `${ANALYSIS_API_BASE}/hybrid_reference_deg_pathway/?${params.toString()}`;
};

export const getSCSTHybridReferenceDEGPathwayURL = ({
    taskUUID,
    groupValue,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) params.set("taskUUID", taskUUID);
    if (groupValue) params.set("groupValue", groupValue);

    return `${ANALYSIS_API_BASE}/scst_hybrid_reference_deg_pathway/?${params.toString()}`;
};


// Workflow Enrichment Result URLs
export const getCustomListQueryEnrichrResultURL = ({
    taskUUID,
    direction,
}) => {
    if (!taskUUID) {
        throw new Error("Missing taskUUID.");
    }

    if (!["up", "down"].includes(direction)) {
        throw new Error(
            `Unsupported Enrichr direction: ${direction}`
        );
    }

    const params = new URLSearchParams({
        taskUUID,
        direction,
    });

    return (
        `${ANALYSIS_API_BASE}/custom_list_query_enrichr_result/`
        + `?${params.toString()}`
    );
};


// Workflow CMScore URLs
export const getWorkflowCMScoreOptionsURL = ({
    taskType,
    taskUUID,
    groupValue = null,
}) => {
    if (!taskType) throw new Error("Missing taskType.");
    if (!taskUUID) throw new Error("Missing taskUUID.");

    const params = new URLSearchParams({
        taskType,
        taskUUID,
    });

    if (groupValue) {
        params.set("groupValue", groupValue);
    }

    return (
        `${ANALYSIS_API_BASE}/workflow_cm_score_options/`
        + `?${params.toString()}`
    );
};


export const getWorkflowCMScoreResultURL = ({
    taskType,
    taskUUID,
    item,
    groupValue = null,
}) => {
    if (!taskType) throw new Error("Missing taskType.");
    if (!taskUUID) throw new Error("Missing taskUUID.");
    if (!item) throw new Error("Missing item.");

    const params = new URLSearchParams({
        taskType,
        taskUUID,
        item,
    });

    if (groupValue) {
        params.set("groupValue", groupValue);
    }

    return (
        `${ANALYSIS_API_BASE}/workflow_cm_score_result/`
        + `?${params.toString()}`
    );
};


// Workflow Viz Info URLs
export const getSCSTHybridReferenceVizInfoURL = ({
    taskUUID,
}) => {
    if (!taskUUID) {
        throw new Error(
            "Missing SC/ST Hybrid Reference task UUID."
        );
    }

    const encodedTaskUUID = encodeURIComponent(
        taskUUID
    );

    return (
        `${ANALYSIS_API_BASE}`
        + "/scst_hybrid_reference_viz_info/"
        + `?taskUUID=${encodedTaskUUID}`
    );
};
