"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Flex, Input, Modal, Progress, Row, Space, Typography } from "antd";
import BasicChip from "@/components/ui/chips/BasicChip"
import { Box } from "@mui/system"
import { FileTextOutlined } from "@ant-design/icons"

const { TextArea } = Input;
const { Text } = Typography;

const MAX_TOTAL_RNA_COUNT = 100;

const RNA_TYPES = [
    { key: "miRNA", label: "miRNA", color: "volcano" },
    { key: "mRNA", label: "mRNA", color: "blue" },
    { key: "lncRNA", label: "lncRNA", color: "green" },
    { key: "circRNA", label: "circRNA", color: "purple" },
];

const initialInputValue = {
    miRNA: "",
    mRNA: "",
    lncRNA: "",
    circRNA: "",
};

const INVALID_SEPARATOR_PATTERN = /[，；;\n\r\t、]/;

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

const RNAListUploadBox = ({ onUpload, loading = false }) => {
    const [inputValue, setInputValue] = useState(initialInputValue);

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

    const handleInputChange = (type, value) => {
        setInputValue(prev => ({
            ...prev,
            [type]: value,
        }));
    };

    const handleUpload = () => {
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

        onUpload?.(parsedRnas);
    };

    const handleReset = () => {
        setInputValue(initialInputValue);
    };

    return (
        <Card
            title={
                <Box component='span' sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                    Upload RNA List
                </Box>
            }
        >
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Alert
                    showIcon
                    type="info"
                    message={
                        <Box component='span' sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            RNA Input Rules:
                        </Box>
                    }
                    description={
                        <Box component='span' sx={{ fontSize: '14px' }}>
                            Input RNA names separated only by English commas (,).
                            Maximum {MAX_TOTAL_RNA_COUNT} RNAs in total.
                        </Box>
                    }
                    icon={
                        <FileTextOutlined
                            style={{ fontSize: '24px', color: 'rgb(22, 119, 255)', marginRight: '12px' }}/>
                    }
                />

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
                            Upload
                        </Button>

                        <Button onClick={handleReset}>
                            Reset
                        </Button>
                    </Space>
                </Flex>
            </Space>
        </Card>
    );
};

export default RNAListUploadBox;
