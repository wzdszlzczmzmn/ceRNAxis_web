import { Stack } from "@mui/system";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
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
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationSurvivalSection";
import TCGAAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationDEGPathwaySection";
import TCGAAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationExpCorrelationSection";
import TCGADatasetAnnotationSpongeResultSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGADatasetAnnotationSpongeResultSection";
import { useTCGADatasetAnnotationAvailable }
    from "@/components/features/database/hooks/datasetAnnotation/TCGA/useTCGADatasetAnnotationAvailable";
import TCGAAnnotationCMScoreSection
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGAAnnotationCMScoreSection"

const STATUS_CONTAINER_SX = {
    height: "80vh",
    marginTop: "40px",
};

const TCGADatasetAnnotationDetail = ({
    dataset,
    metadata,
}) => {
    const {
        available,
        visualizations,
        isLoading,
        isError,
    } = useTCGADatasetAnnotationAvailable({
        datasetName: dataset,
    });

    if (isLoading) {
        return <LoadingView containerSx={STATUS_CONTAINER_SX} />;
    }

    if (isError) {
        return <ErrorView containerSx={STATUS_CONTAINER_SX} />;
    }

    if (!available) {
        return (
            <EmptyView
                containerSx={STATUS_CONTAINER_SX}
                description="No TCGA annotation visualization is available for this dataset."
            />
        );
    }

    const annotationNetwork =
        visualizations.annotation_network ?? {};
    const axisFinal =
        visualizations.axis_final ?? {};
    const cmap =
        visualizations.cmap ?? {};
    const volcano =
        visualizations.volcano ?? {};
    const log2fcCorrelation =
        visualizations.log2fc_correlation ?? {};
    const expCorrelation =
        visualizations.exp_correlation ?? {};
    const survival =
        visualizations.survival ?? {};
    const degPathway =
        visualizations.deg_pathway ?? {};
    const sponge =
        visualizations.sponge ?? {};

    return (
        <Stack spacing={6} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata} />

            {annotationNetwork.available && (
                <TCGAAnnotationNetworkResultWrapper
                    dataset={dataset}
                />
            )}

            {axisFinal.available && (
                <TCGAAnnotationAxisFinalSection
                    dataset={dataset}
                />
            )}

            {sponge.available && (
                <TCGADatasetAnnotationSpongeResultSection
                    dataset={dataset}
                />
            )}

            {cmap.available && (
                <TCGAAnnotationCMapResultSection
                    dataset={dataset}
                />
            )}

            {volcano.available && (
                <TCGAAnnotationVolcanoAnalysisSection
                    dataset={dataset}
                    annotationAvailability={volcano}
                />
            )}

            {log2fcCorrelation.available && (
                <TCGAAnnotationLog2FCCorrelationSection
                    dataset={dataset}
                    annotationAvailability={log2fcCorrelation}
                />
            )}

            {expCorrelation.available && (
                <TCGAAnnotationExpCorrelationSection
                    dataset={dataset}
                />
            )}

            {survival.available && (
                <TCGAAnnotationSurvivalSection
                    dataset={dataset}
                />
            )}

            {degPathway.available && (
                <TCGAAnnotationDEGPathwaySection
                    dataset={dataset}
                />
            )}

            {visualizations?.CMdrug && (
                <TCGAAnnotationCMScoreSection
                    dataset={dataset}
                />
            )}
        </Stack>
    );
};

export default TCGADatasetAnnotationDetail;
