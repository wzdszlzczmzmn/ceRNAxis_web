"use client";

import { Box } from "@mui/system";
import {
    Card,
} from "antd";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";

import SpongeResultTable
    from "@/components/features/common/SpongeResult/SpongeResultTable";

const SpongeResultCard = ({
    title = "Sponge Results",
    count = 0,
    columns = [],
    summary = null,
    results = [],
    isLoading = false,
    isError = false,
    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No Sponge result",
    showProjectMatches = false,
}) => {
    const safeResults = Array.isArray(results)
        ? results
        : [];

    const recordCount = Number.isFinite(
        Number(count)
    )
        ? Number(count)
        : safeResults.length;

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
                    TOTAL OF{" "}
                    <strong>
                        {recordCount}
                    </strong>{" "}
                    RECORDS
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
                    containerSx={{
                        height: "360px",
                    }}
                />
            ) : unavailableDescription ? (
                <EmptyView
                    bordered
                    description={unavailableDescription}
                    containerSx={{
                        height: "360px",
                    }}
                />
            ) : isLoading ? (
                <LoadingView
                    containerSx={{
                        height: "360px",
                    }}
                />
            ) : isError ? (
                <ErrorView
                    containerSx={{
                        height: "360px",
                    }}
                />
            ) : safeResults.length === 0 ? (
                <EmptyView
                    bordered
                    description={emptyDescription}
                    containerSx={{
                        height: "360px",
                    }}
                />
            ) : (
                <>
                    <SpongeResultTable
                        rows={safeResults}
                        columns={columns}
                        loading={isLoading}
                        showProjectMatches={
                            showProjectMatches
                        }
                    />
                </>
            )}
        </Card>
    );
};


export default SpongeResultCard;
