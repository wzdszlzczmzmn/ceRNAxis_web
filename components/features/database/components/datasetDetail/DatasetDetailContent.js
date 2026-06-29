import { Stack } from "@mui/system"
import DatasetMetadataDescription from "@/components/features/database/components/common/DatasetMetadataDescription"
import DatasetSampleMetaTable from "@/components/features/database/components/datasetDetail/DatasetSampleMetaTable"
import ExpressionDataSection from "@/components/features/database/components/datasetDetail/ExpressionDataSection"
import DatasetVolcanoAnalysisSection
    from "@/components/features/database/components/datasetDetail/DatasetVolcanoAnalysisSection"
import AliquotExpressionFileDescriptions
    from "@/components/features/database/components/datasetDetail/AliquotExpressionFileDescriptions"
import DatasetLargeMetaSection from "@/components/features/database/components/datasetDetail/DatasetLargeMetaSection"
import LargeExpressionDataSection
    from "@/components/features/database/components/datasetDetail/LargeExpressionDataSection"
import TISCH2DegClusterPlotSection
    from "@/components/features/database/components/datasetDetail/TISCH2DegClusterPlotSection"

const DatasetDetailContent = ({
    dataset,
    metadata,
    expressionMode,
    expressionFileFormat,
    availableExpressionTypes = [],
    availableDegExpressionTypes = [],
}) => {
    const normalizedExpressionMode = String(expressionMode || "").toLowerCase()

    if (normalizedExpressionMode === "tcga") {
        return (
            <TCGADatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                availableExpressionTypes={availableExpressionTypes}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        )
    }

    if (normalizedExpressionMode === "timedb") {
        return (
            <TIMEDBDatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                availableExpressionTypes={availableExpressionTypes}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        )
    }

    if (normalizedExpressionMode === "tisch2") {
        return (
            <TISCH2DatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                expressionMode={expressionMode}
                availableExpressionTypes={availableExpressionTypes}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        )
    }

    if (normalizedExpressionMode === "sctml") {
        return (
            <ScTMLDatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                expressionMode={expressionMode}
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
            <DatasetMetadataDescription metadata={metadata}/>

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
            <DatasetMetadataDescription metadata={metadata}/>

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

const TISCH2DatasetDetailContent = ({
    dataset,
    metadata,
    expressionMode,
    availableExpressionTypes,
    availableDegExpressionTypes,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata}/>

            <DatasetLargeMetaSection
                dataset={dataset}
                expressionMode={expressionMode}
            />

            <LargeExpressionDataSection
                dataset={dataset}
                expressionMode={expressionMode}
                availableExpressionTypes={availableExpressionTypes}
            />

            <TISCH2DegClusterPlotSection
                dataset={dataset}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
            {/* 后续 TISCH2 专属组件放这里 */}
        </Stack>
    )
}

const ScTMLDatasetDetailContent = ({
    dataset,
    metadata,
    expressionMode,
    availableExpressionTypes,
    availableDegExpressionTypes,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata}/>

            <DatasetLargeMetaSection
                dataset={dataset}
                expressionMode={expressionMode}
            />

            <LargeExpressionDataSection
                dataset={dataset}
                expressionMode={expressionMode}
                availableExpressionTypes={availableExpressionTypes}
            />
            {/* 后续 scTML 专属组件放这里 */}
        </Stack>
    )
}

const FallbackDatasetDetailContent = ({
    metadata,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata}/>
        </Stack>
    )
}

export default DatasetDetailContent
