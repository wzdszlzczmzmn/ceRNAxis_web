import { useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import { useDatasetDetail }
    from "@/components/features/database/hooks/datasetDetail/useDatasetDetail";
import TCGADatasetAnnotationDetail
    from "@/components/features/database/components/datasetAnnotation/TCGA/TCGADatasetAnnotationDetail";
import TIMEDBDatasetAnnotationDetail
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBDatasetAnnotationDetail";
import SCSTDatasetAnnotationDetail
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTDatasetAnnotationDetail";


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
    const programme = normalizeText(
        metadata?.programme
    );
    const reference = normalizeText(
        metadata?.reference
    );
    const datasetName = normalizeText(
        dataset
    );

    if (
        programme === "TISCH2"
        || programme === "SCTML"
    ) {
        return "SCST";
    }

    if (
        programme === "TCGA"
        || reference === "TCGA"
    ) {
        return "TCGA";
    }

    if (
        programme === "TIMEDB"
        || reference === "TIMEDB"
        || datasetName.startsWith("GSE")
    ) {
        return "TIMEDB";
    }

    if (
        datasetName.startsWith("TCGA_")
    ) {
        return "TCGA";
    }

    return null;
};


const DatasetAnnotationPage = () => {
    const router = useRouter();

    const dataset = normalizeQueryValue(
        router.query.dataset
    );

    const initialGroupBy = normalizeQueryValue(
        router.query.groupBy
    );

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
    }, [
        dataset,
        metadata,
    ]);

    if (
        !router.isReady
        || isDatasetLoading
    ) {
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

    return (
        <>
            <Head>
                <title>
                    {dataset} Annotations | ceRNAxisDB
                </title>

                <meta
                    name="description"
                    content={
                        `Annotations of dataset ${dataset}`
                    }
                />
            </Head>

            {annotationSource === "TCGA" && (
                <TCGADatasetAnnotationDetail
                    dataset={dataset}
                    metadata={metadata}
                />
            )}

            {annotationSource === "TIMEDB" && (
                <TIMEDBDatasetAnnotationDetail
                    dataset={dataset}
                    metadata={metadata}
                    initialGroupBy={initialGroupBy}
                />
            )}

            {annotationSource === "SCST" && (
                <SCSTDatasetAnnotationDetail
                    dataset={dataset}
                    metadata={metadata}
                    initialGroupBy={initialGroupBy}
                />
            )}
        </>
    );
};


export default DatasetAnnotationPage;
