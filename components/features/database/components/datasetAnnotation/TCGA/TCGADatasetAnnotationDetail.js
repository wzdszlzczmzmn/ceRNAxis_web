import { Stack } from "@mui/system";

import DatasetMetadataDescription
    from "@/components/features/database/components/common/DatasetMetadataDescription";
import TCGAAnnotationNetworkResultWrapper
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationNetworkResultWrapper";
import TCGAAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationAxisFinalSection";
import TCGAAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationCMapResultSection";
import TCGAAnnotationVolcanoAnalysisSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationVolcanoAnalysisSection";
import TCGAAnnotationLog2FCCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationLog2FCCorrelationSection";
import TCGAAnnotationSurvivalSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationSurvivalSection"
import TCGAAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationDEGPathwaySection"
import TCGAAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationExpCorrelationSection"

const TCGADatasetAnnotationDetail = ({
    dataset,
    metadata,
    annotationAvailability,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata} />

            <TCGAAnnotationNetworkResultWrapper dataset={dataset} />

            <TCGAAnnotationAxisFinalSection dataset={dataset} />

            <TCGAAnnotationCMapResultSection dataset={dataset} />

            <TCGAAnnotationVolcanoAnalysisSection
                dataset={dataset}
                annotationAvailability={annotationAvailability}
            />

            <TCGAAnnotationLog2FCCorrelationSection
                dataset={dataset}
                annotationAvailability={annotationAvailability}
            />

            <TCGAAnnotationExpCorrelationSection dataset={dataset} />

            <TCGAAnnotationSurvivalSection dataset={dataset} />

            <TCGAAnnotationDEGPathwaySection dataset={dataset} />
        </Stack>
    );
};

export default TCGADatasetAnnotationDetail;
