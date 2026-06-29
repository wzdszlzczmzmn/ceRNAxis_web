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

export const getCustomListQuerySubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/custom_list_query_task_submit/`;
};

export const getQueryTaskURL = () => {
    return `${ANALYSIS_API_BASE}/query_task/`;
}

export const buildWorkflowTaskQueryURL = (taskId) => {
    const params = new URLSearchParams({
        taskUUID: taskId,
    });

    return `${ANALYSIS_API_BASE}/query_task/?${params.toString()}`;
};

export const getCustomListQueryNetworkResultURL = (taskUUID) => {
    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/custom_list_query_network/?${params.toString()}`;
};

export const getPairedCohortSubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_task_submit/`;
};

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

export const getPairedCohortDegVolcanoURL = ({
    taskUUID,
    rnaType,
}) => {
    if (!taskUUID || !rnaType) return null

    const params = new URLSearchParams({
        taskUUID,
        rna_type: rnaType,
    })

    return `${ANALYSIS_API_BASE}/paired_cohort_deg_volcano/?${params.toString()}`
}

export const getPairedCohortLog2FCCorrelationURL = ({
    taskUUID,
    interactionType,
}) => {
    if (!taskUUID || !interactionType) return null;

    const params = new URLSearchParams({
        taskUUID,
        type: interactionType,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_correlation/?${params.toString()}`;
};

export const getPairedCohortExpCorrelationOptionsURL = ({
    taskUUID,
}) => {
    if (!taskUUID) return null;

    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_exp_correlation_options/?${params.toString()}`;
};

export const getPairedCohortExpCorrelationPlotDataURL = ({
    taskUUID,
    gene1,
    gene2,
    type,
}) => {
    if (!taskUUID || !gene1 || !gene2 || !type) return null;

    const params = new URLSearchParams({
        taskUUID,
        gene1,
        gene2,
        type,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_exp_correlation_plot_data/?${params.toString()}`;
};

export const getPairedCohortTaskNetworkURL = (taskUUID) => {
    if (!taskUUID) return null;

    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/paired_cohort_task_network/?${params.toString()}`;
};

export const getWorkflowTaskResultDownloadURL = (taskUUID) => {
    if (!taskUUID) return null;

    const params = new URLSearchParams({
        taskUUID,
    });

    return `${ANALYSIS_API_BASE}/workflow_task_result_download/?${params.toString()}`;
};


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


export const getCustomListQueryRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/custom_list_query_run_demo/`;
};

export const getPairedCohortRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_run_demo/`;
};

export const getHybridReferenceRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_run_demo/`;
};

export const getPairedCohortSurvivalKMURL = (taskUUID) => {
    if (!taskUUID) {
        return null;
    }

    return `${ANALYSIS_API_BASE}/paired_cohort_survival_km/?taskUUID=${encodeURIComponent(
        taskUUID
    )}`;
};

export const getHybridReferenceSubmitTaskURL = () => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_task_submit/`;
};

export const getPairedCohortDEGPathwayURL = (taskUUID) => {
    if (!taskUUID) return null;

    return `${ANALYSIS_API_BASE}/paired_cohort_deg_pathway/?taskUUID=${taskUUID}`;
};

export const getHybridReferenceUploadedFileDownloadURL = ({
    taskUUID,
    fileType,
}) => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_uploaded_file_download/?taskUUID=${taskUUID}&file_type=${fileType}`;
};

export const getHybridReferenceTaskNetworkURL = (taskUUID) => {
    return `${ANALYSIS_API_BASE}/hybrid_reference_task_network/?taskUUID=${taskUUID}`;
};

export const getWorkflowAxisFinalURL = ({
    taskType,
    taskUUID,
}) => {
    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_axis_final/?taskUUID=${taskUUID}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_axis_final/?taskUUID=${taskUUID}`;
    }

    throw new Error(`Unsupported axis final task type: ${taskType}`);
};

export const getWorkflowCMapResultURL = ({
    taskType,
    taskUUID,
}) => {
    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_cmap_result/?taskUUID=${taskUUID}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_cmap_result/?taskUUID=${taskUUID}`;
    }

    throw new Error(`Unsupported CMap task type: ${taskType}`);
};

export const getWorkflowLog2FCCorrelationURL = ({
    taskType,
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

    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_correlation/?${params.toString()}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_correlation/?${params.toString()}`;
    }

    throw new Error(`Unsupported log2FC correlation task type: ${taskType}`);
};

export const getWorkflowDegVolcanoURL = ({
    taskType,
    taskUUID,
    rnaType,
    degScope,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (rnaType) {
        params.set("rna_type", rnaType);
    }

    if (degScope) {
        params.set("deg_scope", degScope);
    }

    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_deg_volcano/?${params.toString()}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_deg_volcano/?${params.toString()}`;
    }

    throw new Error(`Unsupported DEG volcano task type: ${taskType}`);
};

export const getWorkflowExpCorrelationOptionsURL = ({
    taskType,
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_exp_correlation_options/?${params.toString()}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_exp_correlation_options/?${params.toString()}`;
    }

    throw new Error(`Unsupported expression correlation task type: ${taskType}`);
};

export const getWorkflowExpCorrelationPlotDataURL = ({
    taskType,
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

    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_exp_correlation_plot_data/?${params.toString()}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_exp_correlation_plot_data/?${params.toString()}`;
    }

    throw new Error(`Unsupported expression correlation task type: ${taskType}`);
};

export const getWorkflowSurvivalKMURL = ({
    taskType,
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_survival_km/?${params.toString()}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_survival_km/?${params.toString()}`;
    }

    throw new Error(`Unsupported survival KM task type: ${taskType}`);
};

export const getWorkflowDEGPathwayURL = ({
    taskType,
    taskUUID,
}) => {
    const params = new URLSearchParams();

    if (taskUUID) {
        params.set("taskUUID", taskUUID);
    }

    if (taskType === "PairedCohortTask") {
        return `${ANALYSIS_API_BASE}/paired_cohort_deg_pathway/?${params.toString()}`;
    }

    if (taskType === "HybridReferenceTask") {
        return `${ANALYSIS_API_BASE}/hybrid_reference_deg_pathway/?${params.toString()}`;
    }

    throw new Error(`Unsupported DEG pathway task type: ${taskType}`);
};

export const getWorkflowTaskNetworkURL = ({
    taskType,
    taskUUID,
}) => {
    if (!taskType || !taskUUID) return null;

    if (taskType === "PairedCohortTask") {
        return getPairedCohortTaskNetworkURL(taskUUID);
    }

    if (taskType === "HybridReferenceTask") {
        return getHybridReferenceTaskNetworkURL(taskUUID);
    }

    throw new Error(`Unsupported workflow network task type: ${taskType}`);
};
