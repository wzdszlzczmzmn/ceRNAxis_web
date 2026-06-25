"use client";

import { useState } from "react";
import { Button, Descriptions, Empty, Space, Spin, Typography } from "antd";
import {
    DownloadOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { Box, Stack } from "@mui/system";

import api from "@/lib/api/axios";
import { downloadBlob } from "@/lib/api/analysis";
import { useGlobalMessage } from "@/context/MessageContext";
import {
    useAliquotExpressionDownloadFiles,
} from "@/components/features/database/hooks/datasetDetail/useAliquotExpressionDownloadFiles";
import {
    getAliquotExpressionFileDownloadURL,
    parseBlobErrorMessage,
} from "@/lib/api/database/datasetDetail";

const { Text } = Typography;

const getFileLabel = (fileItem) => {
    const {
        file_type,
        value_type,
        source_rna_type,
    } = fileItem;

    if (file_type === "annotation") {
        return "Annotation";
    }

    if (source_rna_type === "isoform" && value_type) {
        return value_type.toUpperCase();
    }

    if (value_type) {
        return value_type.toUpperCase();
    }

    return file_type || "File";
};

const AliquotExpressionFileDescriptions = ({
    dataset,
    column = 2,
    title = "Aliquot Expression Files",
}) => {
    const [downloadingFileId, setDownloadingFileId] = useState(null);

    const messageApi = useGlobalMessage();

    const {
        availableAliquotExpressionFiles,
        availableIsoformFiles,
        isLoading,
        isError,
        error,
    } = useAliquotExpressionDownloadFiles(dataset);

    const handleDownloadFile = async (fileItem) => {
        const {
            file_id,
            dataset,
            file_type,
            value_type,
            filename,
        } = fileItem;

        if (!dataset) {
            messageApi.error("Missing dataset.");
            return;
        }

        if (!file_type) {
            messageApi.error("Missing file type.");
            return;
        }

        if (file_type === "expression" && !value_type) {
            messageApi.error("Missing value type for expression file.");
            return;
        }

        try {
            setDownloadingFileId(file_id);

            const response = await api.get(
                getAliquotExpressionFileDownloadURL({
                    dataset,
                    fileType: file_type,
                    valueType: value_type,
                }),
                {
                    responseType: "blob",
                    timeout: 600000,
                }
            );

            downloadBlob({
                blob: response.data,
                filename:
                    filename ||
                    (
                        file_type === "annotation"
                            ? `${dataset}_annotation.csv`
                            : `${dataset}_${value_type}_aliquot_exp.csv`
                    ),
            });

            messageApi.success("Download succeeded.");
        } catch (err) {
            const message = await parseBlobErrorMessage(err);
            messageApi.error(message);
        } finally {
            setDownloadingFileId(null);
        }
    };

    const renderFileItem = (fileItem) => {
        const {
            file_id,
            filename,
            dataset,
            file_type,
        } = fileItem;

        if (!filename) {
            return "--";
        }

        return (
            <Space
                size={12}
                wrap
                style={{
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Space size={8} wrap>
                    <FileTextOutlined />
                    <Text>{filename}</Text>
                </Space>

                <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<DownloadOutlined />}
                    loading={downloadingFileId === file_id}
                    disabled={!dataset || !file_type}
                    onClick={() => handleDownloadFile(fileItem)}
                >
                    Download
                </Button>
            </Space>
        );
    };

    const buildDescriptionItems = (files) => {
        return files.map((fileItem, index) => ({
            key:
                fileItem.file_id ||
                `${fileItem.dataset}-${fileItem.file_type}-${fileItem.value_type}-${index}`,
            label: getFileLabel(fileItem),
            children: renderFileItem(fileItem),
            span: 1,
        }));
    };

    const renderDescriptionsSection = ({
        sectionTitle,
        files,
        emptyDescription,
        showEmpty = true,
    }) => {
        if (!files.length && !showEmpty) {
            return null;
        }

        return (
            <Box sx={{ mb: 4 }}>
                <Box
                    component="h6"
                    sx={{
                        fontSize: "24px",
                        fontWeight: 500,
                        m: 0,
                        mb: 2,
                    }}
                >
                    {sectionTitle}
                </Box>

                {files.length > 0 ? (
                    <Descriptions
                        bordered
                        column={column}
                        items={buildDescriptionItems(files)}
                    />
                ) : (
                    <Empty description={emptyDescription} />
                )}
            </Box>
        );
    };

    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    mb: "36px",
                    pb: "12px",
                }}
            >
                <Box component="h6" sx={{ fontSize: "36px", m: 0 }}>
                    {title}
                </Box>
            </Stack>

            {isLoading ? (
                <Spin />
            ) : isError ? (
                <Empty
                    description={
                        error?.response?.data?.detail ||
                        error?.message ||
                        "Failed to load aliquot expression files."
                    }
                />
            ) : (
                <>
                    {renderDescriptionsSection({
                        sectionTitle: "Expression Files",
                        files: availableAliquotExpressionFiles,
                        emptyDescription: dataset
                            ? "No aliquot expression files available."
                            : "Missing dataset.",
                        showEmpty: true,
                    })}

                    {renderDescriptionsSection({
                        sectionTitle: "Isoform Files",
                        files: availableIsoformFiles,
                        emptyDescription: "No isoform files available.",
                        showEmpty: false,
                    })}
                </>
            )}
        </Box>
    );
};

export default AliquotExpressionFileDescriptions;
