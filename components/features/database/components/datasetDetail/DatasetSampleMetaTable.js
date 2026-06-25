import { Box, Stack } from "@mui/system";
import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import { useDatasetSampleMetaList } from "@/components/features/database/hooks/datasetDetail/useDatasetSampleMetaList";
import SampleMetaTable from "@/components/features/common/sampleMeta/SampleMetaTable";

const DatasetSampleMetaTable = ({
    dataset,
    expressionMode = "tcga",
}) => {
    const {
        count,
        samples,
        isLoading,
        isError,
    } = useDatasetSampleMetaList(dataset);

    if (isLoading) {
        return <LoadingView containerSx={{ height: "40vh", marginTop: "40px" }} />;
    }

    if (isError) {
        return <ErrorView containerSx={{ height: "40vh", marginTop: "40px" }} />;
    }

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    mb: "36px",
                    pb: "12px",
                }}
            >
                <Box component="h6" sx={{ fontSize: "36px", m: 0 }}>
                    Sample Meta
                </Box>
            </Stack>

            <SampleMetaTable
                count={count}
                samples={samples}
                expressionMode={expressionMode}
            />
        </>
    );
};

export default DatasetSampleMetaTable;
