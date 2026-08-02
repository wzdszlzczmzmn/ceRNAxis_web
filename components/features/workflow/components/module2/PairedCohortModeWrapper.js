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
    Row,
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
import { getPairedCohortRunDemoURL, getPairedCohortSubmitTaskURL } from "@/lib/api/analysis"

const { Dragger } = Upload;
const { Text, Link: AntLink } = Typography;

const TASK_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const TASK_NAME_MAX_LENGTH = 64;

const CANCER_TYPE_OPTIONS = [
    "MEL",
    "LUAD",
    "OS",
    "STAD",
    "BRCA",
    "CRC",
    "NSCLC",
    "OV",
    "LUSC",
    "UCEC",
    "CESC",
    "HCC",
    "AML",
    "ALL",
    "PRAD",
    "SCLC",
    "NBL",
    "MM",
    "Lymphoma",
    "PAAD",
    "",
].map(value => ({
    label: value || "None",
    value,
}));

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

const initialWorkflowParams = {
    taskName: "",
    mapInfo: undefined,

    degMethod: "limma",
    cancerType: "",
    usePadj: true,

    logfcCutoffMrna: 1,
    padjCutoffMrna: 0.05,

    logfcCutoffMirna: 1,
    padjCutoffMirna: 0.05,

    logfcCutoffLncrna: 1,
    padjCutoffLncrna: 0.05,

    logfcCutoffCircrna: 1,
    padjCutoffCircrna: 0.05,
};

const initialFileState = {
    mrnaFile: null,
    mirnaFile: null,
    lncrnaFile: null,
    circrnaFile: null,
    metaFile: null,
};

const demoWorkflowParams = {
    taskName: "demo_task_module2",
    mapInfo: "ImmiRImmiR_ACC",

    degMethod: "limma",
    cancerType: "LUAD",
    usePadj: true,

    logfcCutoffMrna: 1,
    padjCutoffMrna: 0.1,

    logfcCutoffMirna: 0.5,
    padjCutoffMirna: 0.3,

    logfcCutoffLncrna: 0.5,
    padjCutoffLncrna: 0.3,

    logfcCutoffCircrna: 0.5,
    padjCutoffCircrna: 0.3,
};

const acceptedFileTypes = ".csv";

const makeSingleFileUploadProps = ({
    file,
    onChange,
    disabled,
}) => ({
    multiple: false,
    maxCount: 1,
    accept: acceptedFileTypes,
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

const Module2SubmitWrapper = () => {
    const [form] = Form.useForm();

    const [workflowParams, setWorkflowParams] = useState(initialWorkflowParams);
    const [files, setFiles] = useState(initialFileState);

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
        setWorkflowParams((prev) => ({
            ...prev,
            ...patch,
        }));
    };

    const updateFile = (field, file) => {
        setFiles((prev) => ({
            ...prev,
            [field]: file,
        }));
    };

    const handleLoadDemoInput = () => {
        setWorkflowParams(demoWorkflowParams);
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

        if (!workflowParams.mapInfo) {
            messageApi.error("Immune annotation file is required.");
            return false;
        }

        if (!files.mrnaFile) {
            messageApi.error("mRNA expression file is required.");
            return false;
        }

        if (!files.mirnaFile) {
            messageApi.error("miRNA expression file is required.");
            return false;
        }

        if (!files.lncrnaFile && !files.circrnaFile) {
            messageApi.error("At least one of lncRNA or circRNA expression file is required.");
            return false;
        }

        if (!files.metaFile) {
            messageApi.error("Sample meta file is required.");
            return false;
        }

        const validCancerTypes = CANCER_TYPE_OPTIONS.map(option => option.value);

        if (!validCancerTypes.includes(workflowParams.cancerType)) {
            messageApi.error("Invalid cancer type.");
            return false;
        }

        if (typeof workflowParams.usePadj !== "boolean") {
            messageApi.error("use_padj must be true or false.");
            return false;
        }

        return true;
    };

    const buildSubmitFormData = () => {
        const formData = new FormData();

        formData.append("task_name", workflowParams.taskName.trim());
        formData.append("map_info", workflowParams.mapInfo);

        formData.append("mrna_file", files.mrnaFile.originFileObj);
        formData.append("mirna_file", files.mirnaFile.originFileObj);

        if (files.lncrnaFile) {
            formData.append("lncrna_file", files.lncrnaFile.originFileObj);
        }

        if (files.circrnaFile) {
            formData.append("circrna_file", files.circrnaFile.originFileObj);
        }

        formData.append("meta_file", files.metaFile.originFileObj);

        formData.append("deg_method", workflowParams.degMethod);
        formData.append("cancer_type", workflowParams.cancerType ?? "");
        formData.append("use_padj", String(workflowParams.usePadj));

        formData.append(
            "logfc_cutoff_mrna",
            String(workflowParams.logfcCutoffMrna)
        );
        formData.append(
            "padj_cutoff_mrna",
            String(workflowParams.padjCutoffMrna)
        );

        formData.append(
            "logfc_cutoff_mirna",
            String(workflowParams.logfcCutoffMirna)
        );
        formData.append(
            "padj_cutoff_mirna",
            String(workflowParams.padjCutoffMirna)
        );

        formData.append(
            "logfc_cutoff_lncrna",
            String(workflowParams.logfcCutoffLncrna)
        );
        formData.append(
            "padj_cutoff_lncrna",
            String(workflowParams.padjCutoffLncrna)
        );

        formData.append(
            "logfc_cutoff_circrna",
            String(workflowParams.logfcCutoffCircrna)
        );
        formData.append(
            "padj_cutoff_circrna",
            String(workflowParams.padjCutoffCircrna)
        );

        return formData;
    };

    const handleRunDemo = async () => {
        try {
            setIsSubmitting(true);

            const response = await api.post(
                getPairedCohortRunDemoURL(),
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

            const response = await api.post(
                getPairedCohortSubmitTaskURL(),
                formData,
                {
                    timeout: 600000,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const uuid = getTaskUUIDFromResponse(response);

            setTaskUUID(uuid);
            setSubmissionStatus(true);
            setIsModelOpen(true);
            messageApi.success("Submit Success!");
        } catch (err) {
            setTaskUUID("");
            setSubmissionStatus(false);
            setIsModelOpen(true);

            const message = getErrorMessage(err, "Submit Fail!");
            messageApi.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setWorkflowParams(initialWorkflowParams);
        setFiles(initialFileState);
        form.resetFields();
    };

    if (isImmuneMapLoading) {
        return <LoadingView containerSx={{ height: "420px" }} />;
    }

    if (isImmuneMapError) {
        return <ErrorView containerSx={{ height: "420px" }} />;
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
                            Paired Cohort Mode
                        </Box>

                        <BasicChip
                            value="Mode 2"
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

                    <Divider />

                    <Space wrap>
                        <Button
                            type="primary"
                            icon={<ExperimentOutlined />}
                            disabled={isSubmitting}
                            onClick={handleRunDemo}
                        >
                            Run Demo
                        </Button>

                        <Button
                            danger
                            icon={<FileSearchOutlined />}
                            disabled={isSubmitting}
                            href='/workspace/detail?taskId=37051bf6-5b88-4ec8-a958-b36a28070109'
                            target='_blank'
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
                            icon={<QuestionCircleOutlined />}
                            disabled={isSubmitting}
                            href='/tutorial'
                            target='_blank'
                        >
                            Submission Help
                        </Button>

                        <Button
                            danger
                            icon={<FileExcelOutlined />}
                            onClick={handleLoadDemoInput}
                            disabled={isSubmitting}
                            href='/workflow/demoFiles?task_type=PairedCohortTask'
                            target='_blank'
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
                        <Box component="span" sx={{ fontSize: "14px" }}>
                            Expression matrix files require <b>mRNA</b> and <b>miRNA</b>.{" "}
                            At least one of <b>lncRNA</b> or <b>circRNA</b> must be provided.
                            All expression matrix files and meta file should follow the
                            platform-defined format. The backend will use fixed columns:
                            <Box component="ul" sx={{ mb: 0 }}>
                                <li>
                                    Expression sample column: <b>sample_id</b>
                                </li>
                                <li>
                                    Meta sample column: <b>sample_id</b>
                                </li>
                                <li>
                                    Meta group column: <b>c_group</b>
                                </li>
                                <li>
                                    Case label: <b>case</b>
                                </li>
                                <li>
                                    Control label: <b>control</b>
                                </li>
                                <li>
                                    lncRNA / circRNA rule: <b>at least one is required</b>
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

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={3}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label="mRNA expression matrix"
                                    required
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.mrnaFile,
                                            disabled: isSubmitting,
                                            onChange: (file) =>
                                                updateFile("mrnaFile", file),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag mRNA file to upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Supported: CSV
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label="miRNA expression matrix"
                                    required
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.mirnaFile,
                                            disabled: isSubmitting,
                                            onChange: (file) =>
                                                updateFile("mirnaFile", file),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag miRNA file to upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Supported: CSV
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>
                        </Stack>

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={3}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label="lncRNA expression matrix"
                                    extra="Optional if circRNA expression matrix is provided."
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.lncrnaFile,
                                            disabled: isSubmitting,
                                            onChange: (file) =>
                                                updateFile("lncrnaFile", file),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined/>
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag lncRNA file to upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Supported: CSV. Required only when circRNA is not provided.
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label="circRNA expression matrix"
                                    extra="Optional if lncRNA expression matrix is provided."
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.circrnaFile,
                                            disabled: isSubmitting,
                                            onChange: (file) =>
                                                updateFile("circrnaFile", file),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined/>
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag circRNA file to upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Supported: CSV. Required only when lncRNA is not provided.
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>
                        </Stack>

                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={3}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Form.Item
                                    label="Sample meta file"
                                    required
                                >
                                    <Dragger
                                        {...makeSingleFileUploadProps({
                                            file: files.metaFile,
                                            disabled: isSubmitting,
                                            onChange: (file) =>
                                                updateFile("metaFile", file),
                                        })}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag meta file to upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Supported: CSV, Required columns:
                                            sample_id, c_group
                                        </p>
                                    </Dragger>
                                </Form.Item>
                            </Box>

                            <Box sx={{ flex: 1 }} />
                        </Stack>

                        <Collapse
                            activeKey='advanced'
                            items={[
                                {
                                    key: "advanced",
                                    label: "Advanced settings",
                                    children: (
                                        <Stack spacing={3}>
                                            <Form.Item
                                                label="DEG method"
                                                name="degMethod"
                                                required
                                            >
                                                <Select
                                                    disabled={isSubmitting}
                                                    value={workflowParams.degMethod}
                                                    onChange={(value) =>
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

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={3}
                                            >
                                                <Form.Item
                                                    label="Cancer type"
                                                    name="cancerType"
                                                    style={{ flex: 1 }}
                                                    tooltip="Used to filter matching cancer-relevant cell lines. Empty means no cancer-type filtering."
                                                >
                                                    <Select
                                                        disabled={isSubmitting}
                                                        value={workflowParams.cancerType}
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                cancerType: value,
                                                            })
                                                        }
                                                        options={CANCER_TYPE_OPTIONS}
                                                        showSearch
                                                        optionFilterProp="label"
                                                    />
                                                </Form.Item>

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
                                            </Stack>

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
                                                                logfcCutoffMrna:
                                                                value,
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
                                                                padjCutoffMrna:
                                                                value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>
                                            </Stack>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={3}
                                            >
                                                <Form.Item
                                                    label="miRNA log2FC cutoff"
                                                    name="logfcCutoffMirna"
                                                    required
                                                    style={{ flex: 1 }}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        step={0.1}
                                                        style={{ width: "100%" }}
                                                        disabled={isSubmitting}
                                                        value={
                                                            workflowParams.logfcCutoffMirna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                logfcCutoffMirna:
                                                                value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="miRNA p-value cutoff"
                                                    name="padjCutoffMirna"
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
                                                            workflowParams.padjCutoffMirna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                padjCutoffMirna:
                                                                value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>
                                            </Stack>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={3}
                                            >
                                                <Form.Item
                                                    label="lncRNA log2FC cutoff"
                                                    name="logfcCutoffLncrna"
                                                    required
                                                    style={{ flex: 1 }}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        step={0.1}
                                                        style={{ width: "100%" }}
                                                        disabled={isSubmitting}
                                                        value={
                                                            workflowParams.logfcCutoffLncrna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                logfcCutoffLncrna:
                                                                value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="lncRNA p-value cutoff"
                                                    name="padjCutoffLncrna"
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
                                                            workflowParams.padjCutoffLncrna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                padjCutoffLncrna:
                                                                value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>
                                            </Stack>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                spacing={3}
                                            >
                                                <Form.Item
                                                    label="circRNA log2FC cutoff"
                                                    name="logfcCutoffCircrna"
                                                    required
                                                    style={{ flex: 1 }}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        step={0.1}
                                                        style={{ width: "100%" }}
                                                        disabled={isSubmitting}
                                                        value={
                                                            workflowParams.logfcCutoffCircrna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                logfcCutoffCircrna: value,
                                                            })
                                                        }
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="circRNA p-value cutoff"
                                                    name="padjCutoffCircrna"
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
                                                            workflowParams.padjCutoffCircrna
                                                        }
                                                        onChange={(value) =>
                                                            updateWorkflowParams({
                                                                padjCutoffCircrna: value,
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

                        <Divider />

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

export default Module2SubmitWrapper;
