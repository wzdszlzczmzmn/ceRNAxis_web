import { Stack } from "@mui/system"
import DatasetDescription from "@/components/features/database/components/datasetDetail/DatasetDescription"
import DatasetSampleMetaTable from "@/components/features/database/components/datasetDetail/DatasetSampleMetaTable"
import ExpressionDataSection from "@/components/features/database/components/datasetDetail/ExpressionDataSection"
import DatasetVolcanoAnalysisSection
    from "@/components/features/database/components/datasetDetail/DatasetVolcanoAnalysisSection"
import AliquotExpressionFileDescriptions
    from "@/components/features/database/components/datasetDetail/AliquotExpressionFileDescriptions"

const DatasetDetailContent = ({
    dataset,
    metadata,
    expressionMode,
    expressionFileFormat,
    availableExpressionTypes = [],
    availableDegExpressionTypes = [],
}) => {
    if (expressionMode === "tcga") {
        return (
            <TCGADatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                availableExpressionTypes={availableExpressionTypes}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        )
    }

    if (expressionMode === "timedb") {
        return (
            <TIMEDBDatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                availableExpressionTypes={availableExpressionTypes}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        )
    }

    return (
        <FallbackDatasetDetailContent
            dataset={dataset}
            metadata={metadata}
        />
    )
}

const TCGADatasetDetailContent = ({
    dataset,
    metadata,
    availableExpressionTypes,
    availableDegExpressionTypes,
}) => {
    const rnaType = metadata?.gene_bio_type ?? null

    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetDescription metadata={metadata}/>

            <DatasetSampleMetaTable
                dataset={dataset}
                expressionMode="tcga"
            />

            <AliquotExpressionFileDescriptions dataset={dataset}/>

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

const TIMEDBDatasetDetailContent = ({
    dataset,
    metadata,
    availableExpressionTypes,
    availableDegExpressionTypes,
}) => {
    const rnaType = metadata?.gene_bio_type ?? null

    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetDescription metadata={metadata}/>

            <DatasetSampleMetaTable
                dataset={dataset}
                expressionMode="timedb"
            />

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

const FallbackDatasetDetailContent = ({
    metadata,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetDescription metadata={metadata}/>
        </Stack>
    )
}

export default DatasetDetailContent
