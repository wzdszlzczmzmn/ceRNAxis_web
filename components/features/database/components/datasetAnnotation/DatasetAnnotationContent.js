import { Stack } from "@mui/system";

import DatasetMetadataDescription
    from "@/components/features/database/components/common/DatasetMetadataDescription";
import TCGADatasetAnnotationDetail
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGADatasetAnnotationDetail";
import TIMEDBDatasetAnnotationDetail
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBDatasetAnnotationDetail";

const DatasetAnnotationContent = ({
    dataset,
    metadata,
    annotationSource,
    annotationAvailability,
}) => {
    if (annotationSource === "TCGA") {
        return (
            <TCGADatasetAnnotationDetail
                dataset={dataset}
                metadata={metadata}
                annotationAvailability={annotationAvailability}
            />
        );
    }

    if (annotationSource === "TIMEDB") {
        return (
            <TIMEDBDatasetAnnotationDetail
                dataset={dataset}
                metadata={metadata}
                annotationAvailability={annotationAvailability}
            />
        );
    }

    return (
        <FallbackDatasetAnnotationDetail
            metadata={metadata}
        />
    );
};

const FallbackDatasetAnnotationDetail = ({
    metadata,
}) => {
    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata} />
        </Stack>
    );
};

export default DatasetAnnotationContent;
