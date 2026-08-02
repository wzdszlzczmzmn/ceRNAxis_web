"use client";

import { Box } from "@mui/system";
import { Card, Space, Typography } from "antd";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import CMapResultTable
    from "@/components/features/common/CMap/CMapResultTable";

const { Text } = Typography;

const CMapResultCard = ({
    title = "CMap Results",
    titleExtra = null,
    count = 0,
    columns = [],
    results = [],
    isLoading = false,
    isError = false,
    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No CMap result",
}) => {
    const recordCount = count ?? results.length;

    return (
        <Card
            title={
                <Box
                    component="span"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "24px",
                        fontWeight: 700,
                    }}
                >
                    {title}

                    {titleExtra}
                </Box>
            }
            extra={
                <Space size={12} wrap>
                    <Text type="secondary">
                        TOTAL OF <strong>{recordCount}</strong> RECORDS
                    </Text>
                </Space>
            }
            styles={{
                body: {
                    padding: 16,
                },
            }}
        >
            {missingDescription ? (
                <EmptyView
                    bordered
                    description={missingDescription}
                    containerSx={{ height: "360px" }}
                />
            ) : unavailableDescription ? (
                <EmptyView
                    bordered
                    description={unavailableDescription}
                    containerSx={{ height: "360px" }}
                />
            ) : isLoading ? (
                <LoadingView containerSx={{ height: "360px" }} />
            ) : isError ? (
                <ErrorView containerSx={{ height: "360px" }} />
            ) : !results.length ? (
                <EmptyView
                    bordered
                    description={emptyDescription}
                    containerSx={{ height: "360px" }}
                />
            ) : (
                <CMapResultTable
                    rows={results}
                    columns={columns}
                    loading={isLoading}
                />
            )}
        </Card>
    );
};

export default CMapResultCard;
