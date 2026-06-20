"use client";

import { useState } from "react";
import { Button, Descriptions, Space, Typography } from "antd";
import {
    DownloadOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { Box } from "@mui/system";

import { getTaskData } from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import { downloadBlob, getPairedCohortUploadedFileDownloadURL } from "@/lib/api/analysis"
import api from "@/lib/api/axios"
import { useGlobalMessage } from "@/context/MessageContext"

const { Text } = Typography;

const FILE_FIELD_CONFIGS = [
    {
        key: "mrna_file",
        label: "mRNA Expression Matrix",
    },
    {
        key: "mirna_file",
        label: "miRNA Expression Matrix",
    },
    {
        key: "lncrna_file",
        label: "lncRNA Expression Matrix",
    },
    {
        key: "meta_file",
        label: "Sample Meta File",
    },
];

const parseBlobErrorMessage = async (err) => {
    const data = err.response?.data;

    if (data instanceof Blob) {
        try {
            const text = await data.text();
            const json = JSON.parse(text);

            return (
                json.msg ||
                json.detail ||
                json.message ||
                "Download failed."
            );
        } catch {
            return "Download failed.";
        }
    }

    return (
        data?.msg ||
        data?.detail ||
        data?.message ||
        err.message ||
        "Download failed."
    );
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

    const renderFileItem = (fileKey) => {
        const fileName = files[fileKey];

        if (!fileName) {
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
                <Space size={8}>
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

    const items = FILE_FIELD_CONFIGS.map((item) => ({
        key: item.key,
        label: item.label,
        children: renderFileItem(item.key),
        span: 1,
    }));

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

            <Descriptions
                bordered
                column={column}
                items={items}
            />
        </Box>
    );
};

export default PairedCohortUploadedFileDescriptions;
