import { Box } from "@mui/system";
import { Card } from "antd";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import SampleMetaTable from "@/components/features/common/sampleMeta/SampleMetaTable";

import { useHybridReferenceDemoSampleMeta }
    from "@/components/features/workflow/hooks/useHybridReferenceDemoSampleMeta";

const HybridReferenceDemoSampleMetaTable = () => {
    const {
        count,
        results,
        isLoading,
        isError,
    } = useHybridReferenceDemoSampleMeta();

    if (isLoading) {
        return <LoadingView containerSx={{ height: "40vh", marginTop: "40px" }} />;
    }

    if (isError) {
        return <ErrorView containerSx={{ height: "40vh", marginTop: "40px" }} />;
    }

    if (!results.length) {
        return (
            <EmptyView
                bordered
                description="No hybrid reference demo sample metadata found."
                containerSx={{ height: "40vh", marginTop: "40px" }}
            />
        );
    }

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
                    Sample Meta File
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
                    TOTAL OF <strong>{count}</strong> SAMPLES
                </Box>
            }
            styles={{
                body: {
                    padding: 16,
                },
            }}
        >
            <SampleMetaTable
                count={count}
                samples={results}
                pagination={{
                    total: count,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => (
                        <Box component="span" fontSize="14px" marginRight="16px">
                            Total <strong>{total}</strong> samples
                        </Box>
                    ),
                }}
            />
        </Card>
    );
};

export default HybridReferenceDemoSampleMetaTable;
