"use client";

import { Box } from "@mui/system";
import { Card } from "antd";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import AxisFinalTable
    from "@/components/features/common/AxisFinal/AxisFinalTable";

const AxisFinalResultCard = ({
    title = "ceRNA Axis Final Results",
    count = 0,
    columns = [],
    results = [],
    isLoading = false,
    isError = false,
    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No ceRNA axis final result",
    showProjectMatches = false,
}) => {
    const recordCount = count ?? results.length;

    return (
        <Card
            title={
                <Box
                    component="span"
                    sx={{
                        fontSize: "24px",
                        fontWeight: 700,
                    }}
                >
                    {title}
                </Box>
            }
            extra={
                <Box
                    component="span"
                    sx={{
                        fontSize: "14px",
                        color: "#595959",
                    }}
                >
                    TOTAL OF <strong>{recordCount}</strong> AXES
                </Box>
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
                <AxisFinalTable
                    rows={results}
                    columns={columns}
                    loading={isLoading}
                    showProjectMatches={showProjectMatches}
                />
            )}
        </Card>
    );
};

export default AxisFinalResultCard;
