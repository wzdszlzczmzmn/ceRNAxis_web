"use client";

import { Stack } from "@mui/system";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";

import { usePairedCohortDemoInfo }
    from "@/components/features/workflow/hooks/usePairedCohortDemoInfo";
import PairedCohortDemoSampleMetaTable
    from "@/components/features/workflow/components/demoFiles/PairedCohortDemoSampleMetaTable";
import PairedCohortDemoExpressionSection
    from "@/components/features/workflow/components/demoFiles/PairedCohortDemoExpressionSection"

const isExpectedPairedCohortDemoInfo = (demoInfo) => {
    return (
        demoInfo?.workflow_type === "paired_cohort" &&
        demoInfo?.task_type === "PairedCohortTask"
    );
};

const PairedCohortDemoFilesDetail = () => {
    const {
        demoInfo,
        isLoading,
        isError,
    } = usePairedCohortDemoInfo();

    if (isLoading) {
        return (
            <LoadingView
                containerSx={{
                    height: "60vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (isError) {
        return (
            <ErrorView
                containerSx={{
                    height: "60vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (!demoInfo || !isExpectedPairedCohortDemoInfo(demoInfo)) {
        return (
            <EmptyView
                bordered
                description="Paired Cohort demo files are not available."
                containerSx={{
                    height: "60vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    return (
        <Stack spacing={6} sx={{ px: "16px" }}>
            <PairedCohortDemoSampleMetaTable />
            <PairedCohortDemoExpressionSection
                rnaTypes={[
                    "mRNA",
                    "miRNA",
                    "lncRNA",
                ]}
            />
        </Stack>
    );
};

export default PairedCohortDemoFilesDetail;
