import { useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import { useDatasetDetail }
    from "@/components/features/database/hooks/datasetDetail/useDatasetDetail";
import { useDatasetAnnotationAvailable }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationAvailable";
import DatasetAnnotationContent
    from "@/components/features/database/components/datasetAnnotation/DatasetAnnotationContent";

const normalizeQueryValue = value => {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
};

const normalizeText = value => {
    return String(value ?? "").trim().toUpperCase();
};

const resolveDatasetAnnotationSource = ({
    dataset,
    metadata,
}) => {
    const programme = normalizeText(metadata?.programme);
    const reference = normalizeText(metadata?.reference);
    const datasetName = normalizeText(dataset);

    if (programme === "TCGA" || reference === "TCGA") {
        return "TCGA";
    }

    if (
        programme === "TIMEDB" ||
        reference === "TIMEDB" ||
        datasetName.startsWith("GSE")
    ) {
        return "TIMEDB";
    }

    if (datasetName.startsWith("TCGA_")) {
        return "TCGA";
    }

    return null;
};

const DatasetAnnotationPage = () => {
    const router = useRouter();
    const dataset = normalizeQueryValue(router.query.dataset);

    const {
        metadata,
        isLoading: isDatasetLoading,
        isError: isDatasetError,
    } = useDatasetDetail(dataset);

    const annotationSource = useMemo(() => {
        return resolveDatasetAnnotationSource({
            dataset,
            metadata,
        });
    }, [dataset, metadata]);

    const {
        annotationAvailability,
        available,
        isLoading: isAnnotationAvailabilityLoading,
        isError: isAnnotationAvailabilityError,
    } = useDatasetAnnotationAvailable({
        source: annotationSource,
        datasetName: dataset,
    });

    if (!router.isReady || isDatasetLoading) {
        return (
            <LoadingView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (!dataset) {
        return (
            <EmptyView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
                description="Missing dataset parameter."
            />
        );
    }

    if (isDatasetError) {
        return (
            <ErrorView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (!metadata) {
        return (
            <EmptyView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
                description="Dataset metadata not found."
            />
        );
    }

    if (!annotationSource) {
        return (
            <EmptyView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
                description="Unsupported dataset annotation source."
            />
        );
    }

    if (isAnnotationAvailabilityLoading) {
        return (
            <LoadingView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (isAnnotationAvailabilityError) {
        return (
            <ErrorView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (!available) {
        return (
            <EmptyView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
                description="No annotation data is available for this dataset."
            />
        );
    }

    return (
        <>
            <Head>
                <title>{dataset} Annotations | ceRNAxis</title>
                <meta
                    name="description"
                    content={`Annotations of dataset ${dataset}`}
                />
            </Head>

            <DatasetAnnotationContent
                dataset={dataset}
                metadata={metadata}
                annotationSource={annotationSource}
                annotationAvailability={annotationAvailability}
            />
        </>
    );
};

export default DatasetAnnotationPage;
