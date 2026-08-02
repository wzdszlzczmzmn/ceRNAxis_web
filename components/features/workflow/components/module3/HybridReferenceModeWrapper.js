"use client";

import { useState } from "react";
import {
    Alert,
    Button,
    Col,
    Collapse,
    Divider,
    Form,
    Input,
    InputNumber,
    Row, Segmented,
    Select,
    Space,
    Spin,
    Typography,
    Upload,
} from "antd";
import {
    ExperimentOutlined,
    FileExcelOutlined,
    FileSearchOutlined,
    InboxOutlined,
    InfoCircleFilled,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import { Box, Stack } from "@mui/system";
import Link from "next/link";

import api from "@/lib/api/axios";
import BasicChip from "@/components/ui/chips/BasicChip";
import ResultModal from "@/components/features/workflow/components/common/ResultModal";
import { useGlobalMessage } from "@/context/MessageContext";
import { useImmuneAnnotationList } from "@/components/features/workflow/hooks/useImmuneAnnotationList";
import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import {
    getHybridReferenceRunDemoURL,
    getHybridReferenceSubmitTaskURL, getSCSTHybridReferenceSubmitTaskURL,
} from "@/lib/api/analysis";

const { Dragger } = Upload;
const { Text, Link: AntLink } = Typography;

const TASK_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const TASK_NAME_MAX_LENGTH = 64;

const TCGA_TYPE_OPTIONS = [
    { label: "TCGA_ACC", value: "TCGA_ACC" },
    { label: "TCGA_BLCA", value: "TCGA_BLCA" },
    { label: "TCGA_BRCA", value: "TCGA_BRCA" },
    { label: "TCGA_CESC", value: "TCGA_CESC" },
    { label: "TCGA_CHOL", value: "TCGA_CHOL" },
    { label: "TCGA_COAD", value: "TCGA_COAD" },
    { label: "TCGA_DLBC", value: "TCGA_DLBC" },
    { label: "TCGA_ESCA", value: "TCGA_ESCA" },
    { label: "TCGA_GBM", value: "TCGA_GBM" },
    { label: "TCGA_HNSC", value: "TCGA_HNSC" },
    { label: "TCGA_KICH", value: "TCGA_KICH" },
    { label: "TCGA_KIRC", value: "TCGA_KIRC" },
    { label: "TCGA_KIRP", value: "TCGA_KIRP" },
    { label: "TCGA_LAML", value: "TCGA_LAML" },
    { label: "TCGA_LGG", value: "TCGA_LGG" },
    { label: "TCGA_LIHC", value: "TCGA_LIHC" },
    { label: "TCGA_LUAD", value: "TCGA_LUAD" },
    { label: "TCGA_LUSC", value: "TCGA_LUSC" },
    { label: "TCGA_MESO", value: "TCGA_MESO" },
    { label: "TCGA_OV", value: "TCGA_OV" },
    { label: "TCGA_PAAD", value: "TCGA_PAAD" },
    { label: "TCGA_PCPG", value: "TCGA_PCPG" },
    { label: "TCGA_PRAD", value: "TCGA_PRAD" },
    { label: "TCGA_READ", value: "TCGA_READ" },
    { label: "TCGA_SARC", value: "TCGA_SARC" },
    { label: "TCGA_SKCM", value: "TCGA_SKCM" },
    { label: "TCGA_STAD", value: "TCGA_STAD" },
    { label: "TCGA_TGCT", value: "TCGA_TGCT" },
    { label: "TCGA_THCA", value: "TCGA_THCA" },
    { label: "TCGA_THYM", value: "TCGA_THYM" },
    { label: "TCGA_UCEC", value: "TCGA_UCEC" },
    { label: "TCGA_UCS", value: "TCGA_UCS" },
    { label: "TCGA_UVM", value: "TCGA_UVM" },
];

const LNCRNA_TYPE_OPTIONS = [
    { label: "log2count", value: "log2count" },
    { label: "log2fpkm", value: "log2fpkm" },
    { label: "log2fpkmuq", value: "log2fpkmuq" },
    { label: "log2tpm", value: "log2tpm" },
];

const USE_PADJ_OPTIONS = [
    {
        label: "Use adjusted p-value",
        value: true,
    },
    {
        label: "Use raw p-value",
        value: false,
    },
];


const DATA_MODE_CONFIG = {
    bulk: {
        label: "Bulk RNA-seq",
        identifierColumn: "sample_id",
        expressionFileLabel: "mRNA expression matrix",
        metaFileLabel: "Sample meta file",
        defaultGroupColumn: "c_group",
        expressionAccept: ".csv,text/csv",
        metadataAccept: ".csv,text/csv",
        expressionHint: "Supported: CSV",
        metadataHint:
            "Supported: CSV, Required columns: sample_id, c_group",
    },

    sc: {
        label: "Single-cell",
        identifierColumn: "cell_id",
        expressionFileLabel: "Single-cell expression matrix",
        metaFileLabel: "Cell meta file",
        defaultGroupColumn: "Celltype (malignancy)",
        expressionAccept:
            ".parquet,application/vnd.apache.parquet,application/octet-stream",
        metadataAccept: ".csv,text/csv",
        expressionHint:
            "Supported: Parquet (.parquet), First column: cell_id",
        metadataHint:
            "Supported: CSV, First column: cell_id, and must contain the selected group column",
    },

    st: {
        label: "Spatial Transcriptomics",
        identifierColumn: "spot_id",
        expressionFileLabel: "Spatial expression matrix",
        metaFileLabel: "Spot meta file",
        defaultGroupColumn: "Celltype (malignancy)",
        expressionAccept:
            ".parquet,application/vnd.apache.parquet,application/octet-stream",
        metadataAccept: ".csv,text/csv",
        expressionHint:
            "Supported: Parquet (.parquet), First column: spot_id",
        metadataHint:
            "Supported: CSV, First column: spot_id, and must contain the selected group column",
    },
};

const initialWorkflowParams = {
    dataMode: "bulk",

    taskName: "",
    tcgaType: undefined,
    lncrnaType: "log2tpm",
    mapInfo: undefined,

    groupCol: "c_group",

    degMethod: "limma",
    usePadj: false,

    logfcCutoffMrna: 1,
    padjCutoffMrna: 0.05,
};

const initialFileState = {
    expressionFile: null,
    metaFile: null,
};

const demoWorkflowParams = {
    dataMode: "bulk",

    taskName: "demo_task_module3",
    tcgaType: "TCGA_ACC",
    lncrnaType: "log2tpm",
    mapInfo: "ImmiRImmiR_ACC",

    groupCol: "c_group",

    degMethod: "limma",
    usePadj: true,

    logfcCutoffMrna: 1,
    padjCutoffMrna: 0.05,
};

const makeSingleFileUploadProps = ({
    file,
    onChange,
    disabled,
    accept,
}) => ({
    multiple: false,
    maxCount: 1,
    accept,
    disabled,
    fileList: file ? [file] : [],
    beforeUpload: () => false,

    onChange: ({ fileList }) => {
        onChange(fileList?.[0] || null);
    },

    onRemove: () => {
        onChange(null);
    },
});

const getRawFile = uploadFile => {
    return uploadFile?.originFileObj || uploadFile || null;
};

const getFileExtension = fileName => {
    const normalizedName = String(fileName || "").trim().toLowerCase();
    const lastDotIndex = normalizedName.lastIndexOf(".");

    if (lastDotIndex < 0) {
        return "";
    }

    return normalizedName.slice(lastDotIndex);
};

const getTaskUUIDFromResponse = (response) => {
    return (
        response.data?.data?.uuid ||
        response.data?.uuid ||
        response.data?.task_uuid ||
        ""
    );
};

const getErrorMessage = (err, fallbackMessage) => {
    return (
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        fallbackMessage
    );
};

const HybridReferenceModeWrapper = () => {
    const [form] = Form.useForm();

    const [workflowParams, setWorkflowParams] = useState(initialWorkflowParams);
    const [files, setFiles] = useState(initialFileState);

    const dataMode = workflowParams.dataMode;

    const modeConfig = (
        DATA_MODE_CONFIG[dataMode] ||
        DATA_MODE_CONFIG.bulk
    );

    const isBulkMode = dataMode === "bulk";
    const isSCSTMode = dataMode === "sc" || dataMode === "st";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [taskUUID, setTaskUUID] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState(true);

    const messageApi = useGlobalMessage();

    const {
        immuneMapOptions,
        isLoading: isImmuneMapLoading,
        isError: isImmuneMapError,
    } = useImmuneAnnotationList();

    const updateWorkflowParams = (patch) => {
        setWorkflowParams(prev => ({
            ...prev,
            ...patch,
        }));
    };

    const updateFile = (field, file) => {
        setFiles(prev => ({
            ...prev,
            [field]: file,
        }));
    };

    const handleDataModeChange = nextMode => {
        const nextConfig = (
            DATA_MODE_CONFIG[nextMode] ||
            DATA_MODE_CONFIG.bulk
        );

        setWorkflowParams(prev => ({
            ...prev,
            dataMode: nextMode,
            groupCol: nextConfig.defaultGroupColumn,
        }));

        form.setFieldsValue({
            dataMode: nextMode,
            groupCol: nextConfig.defaultGroupColumn,
        });

        /*
         * 不同模式要求不同的标识列。
         * 切换模式时清除已选择文件，避免误用旧文件。
         */
        setFiles(initialFileState);
    };

    const handleLoadDemoInput = () => {
        setWorkflowParams(demoWorkflowParams);
        setFiles(initialFileState);
        form.setFieldsValue(demoWorkflowParams);
    };

    const validateBeforeSubmit = () => {
        const taskName = workflowParams.taskName?.trim();

        if (!taskName) {
            messageApi.error("Task name is required.");
            return false;
        }

        if (taskName.length > TASK_NAME_MAX_LENGTH) {
            messageApi.error(
                `Task name must be no more than ${TASK_NAME_MAX_LENGTH} characters.`
            );
            return false;
        }

        if (!TASK_NAME_PATTERN.test(taskName)) {
            messageApi.error(
                "Task name can only contain letters, numbers, underscores (_) and hyphens (-)."
            );
            return false;
        }

        if (!workflowParams.tcgaType) {
            messageApi.error("TCGA cancer type is required.");
            return false;
        }

        if (!workflowParams.lncrnaType) {
            messageApi.error("lncRNA value type is required.");
            return false;
        }

        if (!workflowParams.mapInfo) {
            messageApi.error("Immune annotation file is required.");
            return false;
        }

        if (!files.expressionFile) {
            messageApi.error(
                isBulkMode
                    ? "mRNA expression file is required."
                    : `${modeConfig.label} expression file is required.`
            );
            return false;
        }

        if (!files.metaFile) {
            messageApi.error(
                `${modeConfig.metaFileLabel} is required.`
            );
            return false;
        }

        const expressionRawFile = getRawFile(files.expressionFile);
        const metadataRawFile = getRawFile(files.metaFile);

        if (!expressionRawFile || !metadataRawFile) {
            messageApi.error("Invalid uploaded file.");
            return false;
        }

        const expressionExtension = getFileExtension(
            expressionRawFile.name
        );

        const metadataExtension = getFileExtension(
            metadataRawFile.name
        );

        if (isBulkMode && expressionExtension !== ".csv") {
            messageApi.error(
                "Bulk RNA-seq expression file must be a CSV (.csv) file."
            );
            return false;
        }

        if (isSCSTMode && expressionExtension !== ".parquet") {
            messageApi.error(
                `${modeConfig.label} expression file must be a Parquet (.parquet) file.`
            );
            return false;
        }

        if (metadataExtension !== ".csv") {
            messageApi.error(
                "Metadata file must be a CSV (.csv) file."
            );
            return false;
        }

        if (typeof workflowParams.usePadj !== "boolean") {
            messageApi.error("use_padj must be true or false.");
            return false;
        }

        if (workflowParams.logfcCutoffMrna == null) {
            messageApi.error("mRNA log2FC cutoff is required.");
            return false;
        }

        if (Number(workflowParams.logfcCutoffMrna) < 0) {
            messageApi.error(
                "mRNA log2FC cutoff must be greater than or equal to 0."
            );
            return false;
        }

        if (workflowParams.padjCutoffMrna == null) {
            messageApi.error("mRNA p-value cutoff is required.");
            return false;
        }

        const padjCutoff = Number(
            workflowParams.padjCutoffMrna
        );

        if (padjCutoff <= 0 || padjCutoff > 1) {
            messageApi.error(
                "mRNA p-value cutoff must be in the range (0, 1]."
            );
            return false;
        }

        if (isSCSTMode) {
            const groupCol = workflowParams.groupCol?.trim();

            if (!groupCol) {
                messageApi.error(
                    "Metadata group column is required."
                );
                return false;
            }

            if (groupCol.length > 128) {
                messageApi.error(
                    "Metadata group column must be no more than 128 characters."
                );
                return false;
            }

            if (groupCol === modeConfig.identifierColumn) {
                messageApi.error(
                    `Metadata group column cannot be '${modeConfig.identifierColumn}'.`
                );
                return false;
            }
        }

        return true;
    };

    const buildSubmitFormData = () => {
        const formData = new FormData();

        const expressionRawFile = getRawFile(
            files.expressionFile
        );
        const metadataRawFile = getRawFile(
            files.metaFile
        );

        formData.append(
            "task_name",
            workflowParams.taskName.trim()
        );

        formData.append(
            "tcga_type",
            workflowParams.tcgaType
        );

        formData.append(
            "lncrna_type",
            workflowParams.lncrnaType
        );

        formData.append(
            "map_info",
            workflowParams.mapInfo
        );

        formData.append(
            "use_padj",
            String(workflowParams.usePadj)
        );

        formData.append(
            "logfc_cutoff_mrna",
            String(workflowParams.logfcCutoffMrna)
        );

        formData.append(
            "padj_cutoff_mrna",
            String(workflowParams.padjCutoffMrna)
        );

        formData.append(
            "meta_file",
            metadataRawFile
        );

        if (isBulkMode) {
            formData.append(
                "mrna_file",
                expressionRawFile
            );

            formData.append(
                "deg_method",
                workflowParams.degMethod
            );
        } else {
            formData.append(
                "data_type",
                dataMode
            );

            formData.append(
                "group_col",
                workflowParams.groupCol.trim()
            );

            formData.append(
                "exp_file",
                expressionRawFile
            );
        }

        return formData;
    };

    const handleRunDemo = async () => {
        try {
            setIsSubmitting(true);

            const response = await api.post(
                getHybridReferenceRunDemoURL(),
                {},
                {
                    timeout: 600000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const uuid = getTaskUUIDFromResponse(response);

            setTaskUUID(uuid);
            setSubmissionStatus(true);
            setIsModelOpen(true);
            messageApi.success("Run demo success!");
        } catch (err) {
            setTaskUUID("");
            setSubmissionStatus(false);
            setIsModelOpen(true);

            const message = getErrorMessage(err, "Run demo failed!");
            messageApi.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateBeforeSubmit()) {
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = buildSubmitFormData();

            const submitURL = isBulkMode
                ? getHybridReferenceSubmitTaskURL()
                : getSCSTHybridReferenceSubmitTaskURL();

            const response = await api.post(
                submitURL,
                formData,
                {
                    timeout: 600000,
                }
            );

            const uuid = getTaskUUIDFromResponse(response);

            if (!uuid) {
                throw new Error(
                    "Task submitted, but no task UUID was returned."
                );
            }

            setTaskUUID(uuid);
            setSubmissionStatus(true);
            setIsModelOpen(true);

            messageApi.success(
                `${modeConfig.label} task submitted successfully.`
            );
        } catch (err) {
            setTaskUUID("");
            setSubmissionStatus(false);
            setIsModelOpen(true);

            const errorMessage = getErrorMessage(
                err,
                `${modeConfig.label} task submission failed.`
            );

            messageApi.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setWorkflowParams(initialWorkflowParams);
        setFiles(initialFileState);

        form.resetFields();

        form.setFieldsValue(initialWorkflowParams);
    };

    if (isImmuneMapLoading) {
        return <LoadingView containerSx={{ height: "420px" }}/>;
    }

    if (isImmuneMapError) {
        return <ErrorView containerSx={{ height: "420px" }}/>;
    }

    if (!immuneMapOptions.length) {
        return (
            <EmptyView
                bordered
                description="No Available Immune Annotation File."
                containerSx={{ height: "420px" }}
            />
        );
    }

    return (
        <Spin
            spinning={isSubmitting}
            tip="Submitting, please wait..."
            size="large"
        >
            <Stack spacing={4}>
                <Stack spacing={2}>
                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            <Box
                                component="h6"
                                sx={{
                                    fontSize: "40px",
                                    m: 0,
                                }}
                            >
                                Hybrid Reference Mode
                            </Box>

                            <BasicChip
                                value="Mode 3"
                                color="blue"
                                style={{
                                    height: "32px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    padding: "0 12px",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    marginTop: "10px",
                                }}
                            />
                        </Stack>

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={1.5}
                            alignItems={{
                                xs: "stretch",
                                md: "center",
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "text.secondary",
                                    minWidth: "132px",
                                }}
                            >
                                Input Data Mode:
                            </Box>

                            <Segmented
                                block
                                className="hybrid-data-mode-segmented"
                                value={workflowParams.dataMode}
                                options={[
                                    {
                                        label: "Bulk RNA-seq",
                                        value: "bulk",
                                    },
                                    {
                                        label: "Single-cell",
                                        value: "sc",
                                    },
                                    {
                                        label: "Spatial Transcriptomics",
                                        value: "st",
                                    },
                                ]}
                                onChange={handleDataModeChange}
                                disabled={isSubmitting}
                                style={{
                                    width: "100%",
                                    maxWidth: 620,
                                }}
                            />
                        </Stack>
                    </Stack>

                    <Divider/>

                    <Space wrap>
                        <Button
                            type="primary"
                            icon={<ExperimentOutlined/>}
                            disabled={isSubmitting}
                            onClick={handleRunDemo}
                        >
                            Run Demo
                        </Button>

                        <Button
                            danger
                            icon={<FileSearchOutlined/>}
                            disabled={isSubmitting}
                            href="/workspace/detail?taskId=d3498b29-bd4b-40fd-ba4b-afe8adbc2d1e"
                            target="_blank"
                        >
                            View Demo Result
                        </Button>

                        <Divider
                            type="vertical"
                            verticalAlign="middle"
                            style={{ height: 24 }}
                        />

                        <Button
                            type="primary"
                            icon={<QuestionCircleOutlined/>}
                            disabled={isSubmitting}
                            href='/tutorial'
                            target='_blank'
                        >
                            Submission Help
                        </Button>

                        <Button
                            danger
                            icon={<FileExcelOutlined/>}
                            onClick={handleLoadDemoInput}
                            disabled={isSubmitting}
                            href="/workflow/demoFiles?task_type=HybridReferenceTask"
                            target="_blank"
                        >
                            View Demo Files
                        </Button>
                    </Space>
                </Stack>

                <Alert
                    type="info"
                    showIcon
                    icon={
                        <InfoCircleFilled
                            style={{
                                fontSize: 24,
                                color: "rgb(22, 119, 255)",
                            }}
                        />
                    }
                    message={
                        <Box
                            component="span"
                            sx={{ fontWeight: "bold", fontSize: "16px" }}
                        >
                            Input file format requirements
                        </Box>
                    }
                    description={
                        <Box
                            component="span"
                            sx={{ fontSize: "14px" }}
                        >
                            Hybrid Reference Mode uses an uploaded{" "}
                            <b>mRNA expression matrix</b>, an uploaded{" "}
                            <b>{modeConfig.metaFileLabel.toLowerCase()}</b>, and
                            a selected TCGA reference cancer type to construct
                            ceRNA-related results.

                            <Box component="ul" sx={{ mb: 0 }}>
                                <li>
                                    Data mode:{" "}
                                    <b>{modeConfig.label}</b>
                                </li>

                                <li>
                                    Expression file format:{" "}
                                    <b>
                                        {isBulkMode
                                            ? "CSV"
                                            : "Parquet (.parquet)"}
                                    </b>
                                </li>

                                <li>
                                    Expression identifier column:{" "}
                                    <b>{modeConfig.identifierColumn}</b>
                                </li>

                                <li>
                                    Metadata file format: <b>CSV</b>
                                </li>

                                <li>
                                    Metadata identifier column:{" "}
                                    <b>{modeConfig.identifierColumn}</b>
                                </li>

                                {isBulkMode ? (
                                    <>
                                        <li>
                                            Metadata group column: <b>c_group</b>
                                        </li>

                                        <li>
                                            Case label: <b>case</b>
                                        </li>

                                        <li>
                                            Control label: <b>control</b>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        Metadata group column:{" "}
                                        <b>
                                            {workflowParams.groupCol ||
                                                modeConfig.defaultGroupColumn}
                                        </b>
                                    </li>
                                )}

                                <li>
                                    Cancer type: used as the TCGA reference.
                                </li>

                                <li>
                                    use_padj: if <b>TRUE</b>, adjusted p-value
                                    is used for DEG filtering; if <b>FALSE</b>,
                                    raw p-value is used.
                                </li>
                            </Box>
                        </Box>
                    }
                />

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialWorkflowParams}
                >
                    <Stack spacing={3}>
                        <Row gutter={[20, 16]}>
                            <Col xs={24} md={12}>
                                <Space
                                    direction="vertical"
                                    size={6}
                                    style={{ width: "100%" }}
                                >
                                    <Text strong>
                                        <span style={{ color: "#ff4d4f" }}>* </span>
                                        Task Name
                                    </Text>

                                    <Form.Item
                                        name="taskName"
                                        style={{ marginBottom: 0 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input task name.",
                                            },
                                            {
                                                max: TASK_NAME_MAX_LENGTH,
                                                message: `Task name must be no more than ${TASK_NAME_MAX_LENGTH} characters.`,
                                            },
                                            {
                                                pattern: TASK_NAME_PATTERN,
                                                message:
                                                    "Task name can only contain letters, numbers, underscores (_) and hyphens (-).",
                                            },
                                        ]}
                                    >
                                        <Input
                                            value={workflowParams.taskName}
                                            onChange={(event) =>
                                                updateWorkflowParams({
                                                    taskName: event.target.value,
                                                })
                                            }
                                            placeholder="Letters, numbers, underscores and hyphens only"
                                            allowClear
                                            disabled={isSubmitting}
                                            maxLength={TASK_NAME_MAX_LENGTH}
                                            showCount
                                        />
                                    </Form.Item>
                                </Space>
                            </Col>

                            <Col xs={24} md={12}>
                                <Space
                                    direction="vertical"
                                    size={6}
                                    style={{ width: "100%" }}
                                >
                                    <Text strong>
                                        <span style={{ color: "#ff4d4f" }}>* </span>
                                        TCGA Reference Cancer Type
                                    </Text>

                                    <Form.Item
                                        name="tcgaType"
                                        style={{ marginBottom: 0 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select TCGA cancer type.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={workflowParams.tcgaType}
                                            onChange={(value) =>
                                                updateWorkflowParams({
                                                    tcgaType: value,
                                                })
                                            }
                                            options={TCGA_TYPE_OPTIONS}
                                            placeholder="Select TCGA cancer type"
                                            style={{ width: "100%" }}
                                            disabled={isSubmitting}
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Row>

                        <Row gutter={[20, 16]}>
                            <Col xs={24} md={12}>
                                <Space
                                    direction="vertical"
                                    size={6}
                                    style={{ width: "100%" }}
                                >
                                    <Text strong>
                                        <span style={{ color: "#ff4d4f" }}>* </span>
                                        lncRNA Reference Value Type
                                    </Text>

                                    <Form.Item
                                        name="lncrnaType"
                                        style={{ marginBottom: 0 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select lncRNA value type.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={workflowParams.lncrnaType}
                                            onChange={(value) =>
                                                updateWorkflowParams({
                                                    lncrnaType: value,
                                                })
                                            }
                                            options={LNCRNA_TYPE_OPTIONS}
                                            placeholder="Select lncRNA value type"
                                            style={{ width: "100%" }}
                                            disabled={isSubmitting}
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                    </Form.Item>
                                </Space>
                            </Col>

                            <Col xs={24} md={12}>
                                <Space
                                    direction="vertical"
                                    size={6}
                                    style={{ width: "100%" }}
                                >
                                    <Space
                                        style={{
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text strong>
                                            <span style={{ color: "#ff4d4f" }}>* </span>
                                            Immune Annotation File
                                        </Text>

                                        <Link href="/workflow/immuneAnnotations">
                                            <AntLink>
                                                Explore Annotations
                                            </AntLink>
                                        </Link>
                                    </Space>

                                    <Form.Item
                                        name="mapInfo"
                                        style={{ marginBottom: 0 }}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select an immune annotation file.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            value={workflowParams.mapInfo}
                                            onChange={(value) =>
                                                updateWorkflowParams({
                                                    mapInfo: value,
                                                })
                                            }
                                            options={immuneMapOptions}
                                            placeholder="Select immune annotation file"
                                            style={{ width: "100%" }}
                                            disabled={
                                                isSubmitting ||
                                                isImmuneMapLoading ||
                                                isImmuneMapError
                                            }
                                            loading={isImmuneMapLoading}
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                    </Form.Item>
                                </Space>
                            </Col>
                        </Row>

                        {
                            isSCSTMode && (
                                <Row gutter={[20, 16]}>
                                    <Col xs={24} md={12}>
                                        <Space
                                            direction="vertical"
                                            size={6}
                                            style={{
                                                width: "100%",
                                            }}
                                        >
                                            <Text strong>
                        <span
                            style={{
                                color: "#ff4d4f",
                            }}
                        >
                            *{" "}
                        </span>
                                                Metadata Group Column
                                            </Text>

                                            <Form.Item
                                                name="groupCol"
                                                style={{
                                                    marginBottom: 0,
                                                }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: (
                                                            "Please input the metadata " +
                                                            "group column."
                                                        ),
                                                    },
                                                    {
                                                        max: 128,
                                                        message: (
                                                            "Group column must be no more " +
                                                            "than 128 characters."
                                                        ),
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    value={workflowParams.groupCol}
                                                    disabled={isSubmitting}
                                                    allowClear
                                                    maxLength={128}
                                                    placeholder={
                                                        "e.g. Celltype (malignancy), " +
                                                        "malignancy or cell_type"
                                                    }
                                                    onChange={event => {
                                                        updateWorkflowParams({
                                                            groupCol: event.target.value,
                                                        });
                                                    }}
                                                />
                                            </Form.Item>
                                        </Space>
                                    </Col>
                                </Row>
                            )
                        }

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={3}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label={modeConfig.expressionFileLabel}
                                    required
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.expressionFile,
                                            disabled: isSubmitting,
                                            accept: modeConfig.expressionAccept,
                                            onChange: file =>
                                                updateFile(
                                                    "expressionFile",
                                                    file
                                                ),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>

                                        <p className="ant-upload-text">
                                            Click or drag expression file to upload
                                        </p>

                                        <p className="ant-upload-hint">
                                            {modeConfig.expressionHint}
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label={modeConfig.metaFileLabel}
                                    required
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.metaFile,
                                            disabled: isSubmitting,
                                            accept: modeConfig.metadataAccept,
                                            onChange: file =>
                                                updateFile("metaFile", file),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>

                                        <p className="ant-upload-text">
                                            Click or drag metadata file to upload
                                        </p>

                                        <p className="ant-upload-hint">
                                            {isBulkMode
                                                ? modeConfig.metadataHint
                                                : (
                                                    `Supported: CSV, First column: ` +
                                                    `${modeConfig.identifierColumn}, ` +
                                                    `Required group column: ` +
                                                    `${workflowParams.groupCol ||
                                                    modeConfig.defaultGroupColumn}`
                                                )
                                            }
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>
                        </Stack>

                        <Collapse
                            activeKey="advanced"
                            items={[
                                {
                                    key: "advanced",
                                    label: "Advanced settings",
                                    children: (
                                        <Stack spacing={3}>
                                            {isBulkMode && (
                                                <Form.Item
                                                    label="DEG method"
                                                    name="degMethod"
                                                    required
                                                >
                                                    <Select
                                                        disabled={isSubmitting}
                                                        value={workflowParams.degMethod}
                                                        onChange={value =>
                                                            updateWorkflowParams({
                                                                degMethod: value,
                                                            })
                                                        }
                                                        options={[
                                                            {
                                                                label: "limma",
                                                                value: "limma",
                                                            },
                                                            {
                                                                label: "deseq2",
                                                                value: "deseq2",
                                                            },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            )}

                                            <Form.Item
                                                label="Use adjusted p-value"
                                                name="usePadj"
                                                required
                                                style={{ flex: 1 }}
                                                tooltip="If true, adjusted p-value will be used as the primary DEG filtering criterion. If false, raw p-value will be used."
                                            >
                                                <Select
                                                    disabled={isSubmitting}
                                                    value={workflowParams.usePadj}
                                                    onChange={(value) =>
                                                        updateWorkflowParams({
                                                            usePadj: value,
                                                        })
                                                    }
                                                    options={USE_PADJ_OPTIONS}
                                                />
                                            </Form.Item>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={3}
                                            >
                                                <Form.Item
                                                    label="mRNA log2FC cutoff"
                                                    name="logfcCutoffMrna"
                                                    required
                                                    style={{ flex: 1 }}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        step={0.1}
                                                        style={{ width: "100%" }}
                                                        disabled={isSubmitting}
                                                        value={
                                                            workflowParams.logfcCutoffMrna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                logfcCutoffMrna: value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="mRNA p-value cutoff"
                                                    name="padjCutoffMrna"
                                                    required
                                                    style={{ flex: 1 }}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        max={1}
                                                        step={0.01}
                                                        style={{ width: "100%" }}
                                                        disabled={isSubmitting}
                                                        value={
                                                            workflowParams.padjCutoffMrna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                padjCutoffMrna: value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>
                                            </Stack>
                                        </Stack>
                                    ),
                                },
                            ]}
                        />

                        <Divider/>

                        <Space>
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={isSubmitting}
                            >
                                Submit
                            </Button>

                            <Button
                                onClick={handleReset}
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Stack>
                </Form>

                <ResultModal
                    isModalOpen={isModalOpen}
                    setIsModelOpen={setIsModelOpen}
                    taskUUID={taskUUID}
                    submissionStatus={submissionStatus}
                />
            </Stack>
        </Spin>
    );
};

export default HybridReferenceModeWrapper;
