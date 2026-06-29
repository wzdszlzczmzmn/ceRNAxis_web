"use client";

import { Stack } from "@mui/system";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";

import { useHybridReferenceDemoInfo }
    from "@/components/features/workflow/hooks/useHybridReferenceDemoInfo";
import HybridReferenceDemoSampleMetaTable
    from "@/components/features/workflow/components/demoFiles/HybridReferenceDemoSampleMetaTable";
import HybridReferenceDemoExpressionSection
    from "@/components/features/workflow/components/demoFiles/HybridReferenceDemoExpressionSection";

const isExpectedHybridReferenceDemoInfo = (demoInfo) => {
    return (
        demoInfo?.workflow_type === "hybrid_reference" &&
        demoInfo?.task_type === "HybridReferenceTask"
    );
};

const HybridReferenceDemoFilesDetail = () => {
    const {
        demoInfo,
        isLoading,
        isError,
    } = useHybridReferenceDemoInfo();

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

    if (!demoInfo || !isExpectedHybridReferenceDemoInfo(demoInfo)) {
        return (
            <EmptyView
                bordered
                description="Hybrid Reference demo files are not available."
                containerSx={{
                    height: "60vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    return (
        <Stack spacing={6} sx={{ px: "16px" }}>
            <HybridReferenceDemoSampleMetaTable />

            <HybridReferenceDemoExpressionSection
                rnaTypes={[
                    "mRNA",
                ]}
            />
        </Stack>
    );
};

export default HybridReferenceDemoFilesDetail;
