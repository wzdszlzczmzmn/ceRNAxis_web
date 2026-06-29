"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Descriptions, Space, Typography } from "antd";
import {
    DownloadOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { Box } from "@mui/system";

import { getTaskData } from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    downloadBlob,
    getPairedCohortUploadedFileDownloadURL,
} from "@/lib/api/analysis";
import api from "@/lib/api/axios";
import { useGlobalMessage } from "@/context/MessageContext";
import { parseBlobErrorMessage } from "@/lib/api/database/datasetDetail";

const { Text } = Typography;

const FILE_FIELD_CONFIGS = [
    {
        key: "mrna_file",
        label: "mRNA Expression Matrix",
        required: true,
    },
    {
        key: "mirna_file",
        label: "miRNA Expression Matrix",
        required: true,
    },
    {
        key: "lncrna_file",
        label: "lncRNA Expression Matrix",
        required: false,
        optionalNote: "Required only when circRNA is not provided.",
    },
    {
        key: "circrna_file",
        label: "circRNA Expression Matrix",
        required: false,
        optionalNote: "Required only when lncRNA is not provided.",
    },
    {
        key: "meta_file",
        label: "Sample Meta File",
        required: true,
    },
];

const getHasUploadedFile = ({
    data,
    files,
    fileKey,
    rnaType,
}) => {
    const explicitFlagMap = {
        lncrna_file: "has_lncrna_file",
        circrna_file: "has_circrna_file",
    };

    const explicitFlagKey = explicitFlagMap[fileKey];

    if (
        explicitFlagKey &&
        data?.[explicitFlagKey] !== undefined &&
        data?.[explicitFlagKey] !== null
    ) {
        return Boolean(data[explicitFlagKey]);
    }

    if (
        rnaType &&
        Array.isArray(data?.uploaded_rna_types) &&
        data.uploaded_rna_types.length > 0
    ) {
        return data.uploaded_rna_types.includes(rnaType);
    }

    return Boolean(files?.[fileKey]);
};

const getRnaTypeByFileKey = (fileKey) => {
    const map = {
        mrna_file: "mRNA",
        mirna_file: "miRNA",
        lncrna_file: "lncRNA",
        circrna_file: "circRNA",
    };

    return map[fileKey] ?? null;
};

const PairedCohortUploadedFileDescriptions = ({
    task,
    column = 2,
}) => {
    const [downloadingFileKey, setDownloadingFileKey] = useState(null);

    const messageApi = useGlobalMessage();

    const data = getTaskData(task);
    const taskUUID = data.uuid;
    const files = data.files ?? {};

    const hasLncrnaFile = getHasUploadedFile({
        data,
        files,
        fileKey: "lncrna_file",
        rnaType: "lncRNA",
    });

    const hasCircrnaFile = getHasUploadedFile({
        data,
        files,
        fileKey: "circrna_file",
        rnaType: "circRNA",
    });

    const hasAnyOptionalCernaFile = hasLncrnaFile || hasCircrnaFile;

    const handleDownloadUploadedFile = async ({
        fileKey,
    }) => {
        if (!taskUUID) {
            messageApi.error("Missing task UUID.");
            return;
        }

        if (!fileKey) {
            messageApi.error("Missing file type.");
            return;
        }

        if (!files[fileKey]) {
            messageApi.error("This file was not uploaded.");
            return;
        }

        try {
            setDownloadingFileKey(fileKey);

            const response = await api.get(
                getPairedCohortUploadedFileDownloadURL({
                    taskUUID,
                    fileType: fileKey,
                }),
                {
                    responseType: "blob",
                    timeout: 600000,
                }
            );

            downloadBlob({
                blob: response.data,
                filename: `${fileKey}.csv`,
            });

            messageApi.success("Download started.");
        } catch (err) {
            const message = await parseBlobErrorMessage(err);
            messageApi.error(message);
        } finally {
            setDownloadingFileKey(null);
        }
    };

    const renderFileItem = (config) => {
        const fileKey = config.key;
        const fileName = files[fileKey];

        const rnaType = getRnaTypeByFileKey(fileKey);

        const hasUploadedFile = getHasUploadedFile({
            data,
            files,
            fileKey,
            rnaType,
        });

        if (!hasUploadedFile || !fileName) {
            return (
                <Space
                    direction="vertical"
                    size={4}
                    style={{ width: "100%" }}
                >
                    <Space size={8} wrap>
                        <Text type={config.required ? "danger" : "secondary"}>
                            Not uploaded
                        </Text>
                    </Space>

                    {config.optionalNote && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {config.optionalNote}
                        </Text>
                    )}
                </Space>
            );
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

                    <Text>{fileName}</Text>
                </Space>

                <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<DownloadOutlined />}
                    loading={downloadingFileKey === fileKey}
                    disabled={!taskUUID}
                    onClick={() =>
                        handleDownloadUploadedFile({
                            fileKey,
                        })
                    }
                >
                    Download
                </Button>
            </Space>
        );
    };

    const items = useMemo(() => {
        return FILE_FIELD_CONFIGS.map((item) => ({
            key: item.key,
            label: item.label,
            children: renderFileItem(item),
            span: 1,
        }));
    }, [
        files,
        taskUUID,
        downloadingFileKey,
        hasLncrnaFile,
        hasCircrnaFile,
    ]);

    return (
        <Box>
            <Box
                component="h6"
                sx={{
                    fontSize: "28px",
                    fontWeight: 500,
                    m: 0,
                    mb: 2,
                }}
            >
                Uploaded Files
            </Box>

            {!hasAnyOptionalCernaFile && (
                <Alert
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="Invalid paired cohort input files"
                    description="At least one of lncRNA expression matrix or circRNA expression matrix is required."
                />
            )}

            <Descriptions
                bordered
                column={column}
                items={items}
            />
        </Box>
    );
};

export default PairedCohortUploadedFileDescriptions;
