"use client";

import { useMemo, useState } from "react";
import { Button, Descriptions, Space, Typography } from "antd";
import {
    DownloadOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { Box } from "@mui/system";

import { getTaskData }
    from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    downloadBlob,
    getHybridReferenceUploadedFileDownloadURL,
} from "@/lib/api/analysis";
import api from "@/lib/api/axios";
import { useGlobalMessage } from "@/context/MessageContext";
import { parseBlobErrorMessage } from "@/lib/api/database/datasetDetail";

const { Text } = Typography;

const FILE_FIELD_CONFIGS = [
    {
        key: "mrna_file",
        label: "mRNA Expression Matrix",
        filename: "mrna.csv",
    },
    {
        key: "meta_file",
        label: "Sample Meta File",
        filename: "meta.csv",
    },
];

const HybridReferenceUploadedFileDescriptions = ({
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
        filename,
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
                getHybridReferenceUploadedFileDownloadURL({
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
                filename,
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

        if (!fileName) {
            return (
                <Text type="danger">
                    Not uploaded
                </Text>
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
                            filename: config.filename,
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

            <Descriptions
                bordered
                column={column}
                items={items}
            />
        </Box>
    );
};

export default HybridReferenceUploadedFileDescriptions;
