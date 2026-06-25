"use client";

import { Box } from "@mui/system";
import { Card } from "antd";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import { usePairedCohortAxisFinal } from "@/components/features/workspace/hooks/usePairedCohortAxisFinal";
import PairedCohortAxisFinalTable
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortAxisFinalTable";

const PairedCohortAxisFinalSection = ({
    task,
}) => {
    const taskUUID = task?.data?.uuid;

    const {
        axisFinalFile,
        count,
        results,
        isLoading,
        isError,
    } = usePairedCohortAxisFinal(taskUUID);

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
                    ceRNA Axis Final Results
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
            {!taskUUID ? (
                <EmptyView
                    bordered
                    description="Missing task UUID"
                    containerSx={{ height: "360px" }}
                />
            ) : isLoading ? (
                <LoadingView containerSx={{ height: "360px" }} />
            ) : isError ? (
                <ErrorView containerSx={{ height: "360px" }} />
            ) : !results.length ? (
                <EmptyView
                    bordered
                    description="No ceRNA axis final result"
                    containerSx={{ height: "360px" }}
                />
            ) : (
                <PairedCohortAxisFinalTable
                    rows={results}
                    loading={isLoading}
                />
            )}
        </Card>
    );
};

export default PairedCohortAxisFinalSection;
