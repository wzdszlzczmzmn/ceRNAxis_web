import { Stack } from "@mui/system"
import DatasetDescription from "@/components/features/database/components/datasetDetail/DatasetDescription"
import DatasetSampleMetaTable from "@/components/features/database/components/datasetDetail/DatasetSampleMetaTable"
import ExpressionDataSection from "@/components/features/database/components/datasetDetail/ExpressionDataSection"
import DatasetVolcanoAnalysisSection
    from "@/components/features/database/components/datasetDetail/DatasetVolcanoAnalysisSection"

const DatasetDetailContent = ({
    dataset,
    metadata,
    availableExpressionTypes,
    availableDegExpressionTypes
}) => {
    const rnaType = metadata?.gene_bio_type ?? null

    return (
        <Stack spacing={6} sx={{ pt: '12px', px: '32px' }}>
            <DatasetDescription metadata={metadata}/>
            <DatasetSampleMetaTable dataset={dataset}/>
            <ExpressionDataSection
                dataset={dataset}
                rnaType={rnaType}
                availableExpressionTypes={availableExpressionTypes}
            />
            <DatasetVolcanoAnalysisSection
                dataset={dataset}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        </Stack>
    )
}

export default DatasetDetailContent
