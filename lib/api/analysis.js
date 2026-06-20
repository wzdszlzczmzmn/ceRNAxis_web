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

export const getCustomListQueryRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/custom_list_query_run_demo/`;
};

export const getPairedCohortRunDemoURL = () => {
    return `${ANALYSIS_API_BASE}/paired_cohort_run_demo/`;
};
