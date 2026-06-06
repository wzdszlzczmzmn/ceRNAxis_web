import { Stack } from "@mui/system"
import DatasetDescription from "@/components/features/database/components/datasetDetail/DatasetDescription"
import DatasetSampleMetaTable from "@/components/features/database/components/datasetDetail/DatasetSampleMetaTable"
import ExpressionDataSection from "@/components/features/database/components/datasetDetail/ExpressionDataSection"

const DatasetDetailContent = ({ dataset, metadata, availableExpressionTypes }) => {

    return (
        <Stack spacing={6} sx={{ pt: '12px', px: '32px' }}>
            <DatasetDescription metadata={metadata}/>
            <DatasetSampleMetaTable dataset={dataset}/>
            <ExpressionDataSection dataset={dataset} availableExpressionTypes={availableExpressionTypes}/>
        </Stack>
    )
}

export default DatasetDetailContent
