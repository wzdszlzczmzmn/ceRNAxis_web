"use client";

import { useMemo } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Flex,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Typography,
} from "antd";
import BasicChip from "@/components/ui/chips/BasicChip";
import { Box } from "@mui/system";
import { FileTextOutlined } from "@ant-design/icons";
import { useImmuneAnnotationList } from "@/components/features/workflow/hooks/useImmuneAnnotationList";
import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import Link from "next/link";

const { TextArea } = Input;
const { Text, Link: AntLink } = Typography;

const MAX_TOTAL_RNA_COUNT = 100;

const RNA_TYPES = [
    { key: "miRNA", label: "miRNA", color: "volcano" },
    { key: "mRNA", label: "mRNA", color: "blue" },
    { key: "lncRNA", label: "lncRNA", color: "green" },
    { key: "circRNA", label: "circRNA", color: "purple" },
];

const TASK_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const TASK_NAME_MAX_LENGTH = 64;

const INVALID_SEPARATOR_PATTERN = /[，；;\n\r\t、]/;

const validateTaskName = (taskName) => {
    const value = taskName.trim();

    if (!value) {
        return {
            valid: false,
            message: "Please input a task name.",
        };
    }

    if (value.length > TASK_NAME_MAX_LENGTH) {
        return {
            valid: false,
            message: `Task name must be no more than ${TASK_NAME_MAX_LENGTH} characters.`,
        };
    }

    if (!TASK_NAME_PATTERN.test(value)) {
        return {
            valid: false,
            message: "Task name can only contain letters, numbers, underscores (_) and hyphens (-).",
        };
    }

    return {
        valid: true,
        value,
    };
};

const parseRnaInput = (text) => {
    return Array.from(
        new Set(
            text
                .split(",")
                .map(item => item.trim())
                .filter(Boolean)
        )
    );
};

const validateInput = (inputValue) => {
    for (const item of RNA_TYPES) {
        const value = inputValue[item.key];

        if (INVALID_SEPARATOR_PATTERN.test(value)) {
            return {
                valid: false,
                message: `${item.label} contains invalid separators. Only English commas "," are allowed.`,
            };
        }
    }

    return { valid: true };
};

const RNAListUploadBox = ({
    workflowParams,
    onWorkflowParamsChange,
    initialWorkflowParams,
    inputValue,
    onInputValueChange,
    initialInputValue,
    onUpload,
    loading = false,
}) => {
    const parsedRnas = useMemo(() => ({
        miRNA: parseRnaInput(inputValue.miRNA),
        mRNA: parseRnaInput(inputValue.mRNA),
        lncRNA: parseRnaInput(inputValue.lncRNA),
        circRNA: parseRnaInput(inputValue.circRNA),
    }), [inputValue]);

    const totalCount = useMemo(() => {
        return Object.values(parsedRnas).reduce(
            (sum, list) => sum + list.length,
            0
        );
    }, [parsedRnas]);

    const isOverLimit = totalCount > MAX_TOTAL_RNA_COUNT;
    const isEmpty = totalCount === 0;

    const handleWorkflowParamChange = (key, value) => {
        onWorkflowParamsChange?.({
            ...workflowParams,
            [key]: value,
        });
    };

    const handleInputChange = (type, value) => {
        onInputValueChange?.({
            ...inputValue,
            [type]: value,
        });
    };

    const handleUpload = () => {
        const taskNameValidation = validateTaskName(workflowParams.taskName);

        if (!taskNameValidation.valid) {
            Modal.warning({
                title: "Invalid task name",
                content: taskNameValidation.message,
            });
            return;
        }

        const taskName = taskNameValidation.value;

        if (!workflowParams.mapInfo) {
            Modal.warning({
                title: "Missing immune annotation file",
                content: "Please select an immune annotation file.",
            });
            return;
        }

        const validation = validateInput(inputValue);

        if (!validation.valid) {
            Modal.warning({
                title: "Invalid RNA input",
                content: validation.message,
            });
            return;
        }

        if (isEmpty) {
            Modal.warning({
                title: "Empty RNA input",
                content: "Please input at least one RNA name before uploading.",
            });
            return;
        }

        if (isOverLimit) {
            Modal.warning({
                title: "RNA count exceeded",
                content: `At most ${MAX_TOTAL_RNA_COUNT} RNA names can be uploaded.`,
            });
            return;
        }

        onUpload?.({
            task_name: taskName,
            map_info: workflowParams.mapInfo,
            rnas: parsedRnas,
        });
    };

    const handleReset = () => {
        onWorkflowParamsChange?.(initialWorkflowParams);
        onInputValueChange?.(initialInputValue);
    };

    const {
        immuneMapOptions,
        isLoading: isImmuneMapLoading,
        isError: isImmuneMapError,
    } = useImmuneAnnotationList();

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
        <Card
            title={
                <Box component="span" sx={{ fontWeight: "bold", fontSize: "24px" }}>
                    Upload RNA List
                </Box>
            }
        >
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Alert
                    showIcon
                    type="info"
                    message={
                        <Box component="span" sx={{ fontWeight: "bold", fontSize: "16px" }}>
                            RNA Input Rules:
                        </Box>
                    }
                    description={
                        <Box component="span" sx={{ fontSize: "14px" }}>
                            Input RNA names separated only by English commas (,).
                            Maximum {MAX_TOTAL_RNA_COUNT} RNAs in total.
                        </Box>
                    }
                    icon={
                        <FileTextOutlined
                            style={{
                                fontSize: "24px",
                                color: "rgb(22, 119, 255)",
                                marginRight: "12px",
                            }}
                        />
                    }
                />

                <Row gutter={[20, 16]}>
                    <Col xs={24} md={12}>
                        <Space direction="vertical" size={6} style={{ width: "100%" }}>
                            <Text strong>Task Name</Text>

                            <Input
                                value={workflowParams.taskName}
                                onChange={(e) =>
                                    handleWorkflowParamChange("taskName", e.target.value)
                                }
                                placeholder="Letters, numbers, underscores and hyphens only"
                                allowClear
                                disabled={loading}
                                maxLength={TASK_NAME_MAX_LENGTH}
                                showCount
                            />
                        </Space>
                    </Col>

                    <Col xs={24} md={12}>
                        <Space direction="vertical" size={6} style={{ width: "100%" }}>
                            <Space
                                style={{
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text strong>Immune Annotation File</Text>

                                <Link href="/workflow/immuneAnnotations">
                                    <AntLink>
                                        Explore Annotations
                                    </AntLink>
                                </Link>
                            </Space>

                            <Select
                                value={workflowParams.mapInfo}
                                onChange={(value) =>
                                    handleWorkflowParamChange("mapInfo", value)
                                }
                                options={immuneMapOptions}
                                placeholder="Select immune annotation file"
                                style={{ width: "100%" }}
                                disabled={loading || isImmuneMapLoading || isImmuneMapError}
                                loading={isImmuneMapLoading}
                                showSearch
                                optionFilterProp="label"
                            />
                        </Space>
                    </Col>
                </Row>

                <Row gutter={[20, 20]}>
                    {RNA_TYPES.map(item => {
                        const count = parsedRnas[item.key].length;

                        return (
                            <Col key={item.key} xs={24} md={12}>
                                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                                    <Space size={8}>
                                        <Text strong>{item.label}</Text>

                                        <BasicChip
                                            value={`${count} items`}
                                            color={item.color}
                                        />
                                    </Space>

                                    <TextArea
                                        value={inputValue[item.key]}
                                        onChange={(e) =>
                                            handleInputChange(item.key, e.target.value)
                                        }
                                        placeholder={`Input ${item.label} names, e.g. A, B, C`}
                                        autoSize={{ minRows: 3, maxRows: 6 }}
                                        allowClear
                                    />
                                </Space>
                            </Col>
                        );
                    })}
                </Row>

                <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap={12}
                >
                    <Space size={8}>
                        <Text strong>Total RNAs</Text>

                        <BasicChip
                            value={`${totalCount} / ${MAX_TOTAL_RNA_COUNT}`}
                            color={
                                isOverLimit
                                    ? "red"
                                    : totalCount > MAX_TOTAL_RNA_COUNT * 0.8
                                        ? "orange"
                                        : "blue"
                            }
                        />
                    </Space>

                    <Space>
                        <Button
                            type="primary"
                            loading={loading}
                            disabled={isEmpty || isOverLimit || loading}
                            onClick={handleUpload}
                        >
                            Submit Task
                        </Button>

                        <Button
                            danger
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </Button>
                    </Space>
                </Flex>
            </Space>
        </Card>
    );
};

export default RNAListUploadBox;
