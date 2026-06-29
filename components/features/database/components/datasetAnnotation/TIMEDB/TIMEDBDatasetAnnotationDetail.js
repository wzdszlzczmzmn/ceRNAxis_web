import { Stack } from "@mui/system";

import DatasetMetadataDescription
    from "@/components/features/database/components/common/DatasetMetadataDescription";
import TIMEDBAnnotationNetworkResultWrapper
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationNetworkResultWrapper";
import TIMEDBAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationAxisFinalSection";
import TIMEDBAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationCMapResultSection";
import TIMEDBAnnotationVolcanoAnalysisSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationVolcanoAnalysisSection";
import TIMEDBAnnotationLog2FCCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationLog2FCCorrelationSection";
import TIMEDBAnnotationSurvivalSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationSurvivalSection"
import TIMEDBAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationDEGPathwaySection"
import TIMEDBAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationExpCorrelationSection"

const TIMEDBDatasetAnnotationDetail = ({
    dataset,
    metadata,
    annotationAvailability,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata} />

            <TIMEDBAnnotationNetworkResultWrapper dataset={dataset} />

            <TIMEDBAnnotationAxisFinalSection dataset={dataset} />

            <TIMEDBAnnotationCMapResultSection dataset={dataset} />

            <TIMEDBAnnotationVolcanoAnalysisSection
                dataset={dataset}
                annotationAvailability={annotationAvailability}
            />

            <TIMEDBAnnotationLog2FCCorrelationSection
                dataset={dataset}
                annotationAvailability={annotationAvailability}
            />

            <TIMEDBAnnotationExpCorrelationSection dataset={dataset} />

            <TIMEDBAnnotationSurvivalSection dataset={dataset} />

            <TIMEDBAnnotationDEGPathwaySection dataset={dataset} />
        </Stack>
    );
};

export default TIMEDBDatasetAnnotationDetail;
