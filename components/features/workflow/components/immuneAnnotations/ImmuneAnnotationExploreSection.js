"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Flex, message, Row, Select, Space, Typography } from "antd";
import { Box } from "@mui/system";
import { useImmuneAnnotationList } from "@/components/features/workflow/hooks/useImmuneAnnotationList"
import { useImmuneAnnotationData } from "@/components/features/workflow/hooks/useImmuneAnnotationData"
import ImmuneAnnotationTable from "@/components/features/workflow/components/immuneAnnotations/ImmuneAnnotationTable"
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons"
import BasicChip from "@/components/ui/chips/BasicChip"
import { getImmuneAnnotationDownloadURL } from "@/lib/api/analysis"
import api from "@/lib/api/axios"

const { Text } = Typography;

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const ImmuneAnnotationExploreSection = () => {
    const [selectedMapInfo, setSelectedMapInfo] = useState(undefined);
    const [isDownloading, setIsDownloading] = useState(false);

    const {
        immuneMapOptions,
        immuneMapCount,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useImmuneAnnotationList();

    const {
        annotationData,
        annotationRows,
        annotationColumns,
        annotationCount,
        isLoading: isDataLoading,
        isError: isDataError,
    } = useImmuneAnnotationData(selectedMapInfo);

    useEffect(() => {
        if (!selectedMapInfo && immuneMapOptions.length > 0) {
            setSelectedMapInfo(immuneMapOptions[0].value);
        }
    }, [selectedMapInfo, immuneMapOptions]);

    const handleDownloadCurrentAnnotation = async () => {
        if (!selectedMapInfo) {
            message.warning("Please select an annotation file first.");
            return;
        }

        setIsDownloading(true);

        try {
            const response = await api.get(
                getImmuneAnnotationDownloadURL(selectedMapInfo),
                {
                    responseType: "blob",
                }
            );

            const contentType = response.headers["content-type"] || "";

            if (contentType.includes("application/json")) {
                const text = await response.data.text();
                const errorData = JSON.parse(text);

                message.error(errorData.detail || "Failed to download annotation file.");
                return;
            }

            const filename = `${selectedMapInfo}.csv`;

            downloadBlob(response.data, filename);

            message.success("Annotation file downloaded.");
        } catch (error) {
            const status = error?.response?.status;

            if (error?.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const errorData = JSON.parse(text);

                    message.error(errorData.detail || "Failed to download annotation file.");
                    return;
                } catch {
                    // use generic fallback below
                }
            }

            if (status === 400) {
                message.error("Invalid annotation file parameter.");
                return;
            }

            if (status === 404) {
                message.error("Annotation file was not found on the server.");
                return;
            }

            if (status >= 500) {
                message.error("Server error while downloading annotation file.");
                return;
            }

            message.error("Failed to download annotation file. Please try again later.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Alert
                showIcon
                type="info"
                message={
                    <Box component='span' sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Explore immune annotation files
                    </Box>
                }
                description={
                    <Box component='span' sx={{ fontSize: '14px' }}>
                        Select an annotation type, then search, filter, sort, and browse records in the table.
                    </Box>
                }
                icon={
                    <FileTextOutlined
                        style={{ fontSize: '24px', color: 'rgb(22, 119, 255)', marginRight: '12px' }}/>
                }
            />

            <Card
                size="small"
                styles={{
                    body: {
                        padding: 20,
                    },
                }}
            >
                <Row gutter={[24, 20]} align="middle">
                    <Col xs={24} lg={12}>
                        <Space direction="vertical" size={6} style={{ width: "100%" }}>
                            <Flex align="center" gap={8}>
                                <Text strong style={{ fontSize: 18 }}>Annotation Type</Text>

                                <BasicChip
                                    value={
                                        isOptionsLoading
                                            ? "Loading"
                                            : `${immuneMapCount} Available Annotation Files`
                                    }
                                    color="blue"
                                />
                            </Flex>

                            <Select
                                value={selectedMapInfo}
                                onChange={setSelectedMapInfo}
                                options={immuneMapOptions}
                                placeholder="Select annotation type"
                                loading={isOptionsLoading}
                                disabled={isOptionsLoading || isOptionsError}
                                showSearch
                                optionFilterProp="label"
                                style={{ width: "100%" }}
                            />
                        </Space>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Flex
                            justify="flex-end"
                            align="center"
                            wrap="wrap"
                            gap={24}
                        >
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleDownloadCurrentAnnotation}
                                loading={isDownloading}
                                disabled={
                                    !selectedMapInfo ||
                                    isOptionsLoading
                                }
                                style={{ marginTop: "24px" }}
                            >
                                Download Annotation
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </Card>

            <ImmuneAnnotationTable
                mapInfo={selectedMapInfo}
                rows={annotationRows}
                loading={isDataLoading}
            />
        </Space>
    );
};

export default ImmuneAnnotationExploreSection;
