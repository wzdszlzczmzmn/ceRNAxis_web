import { useRouter } from "next/router"
import { useDatasetDetail } from "@/components/features/database/hooks/datasetDetail/useDatasetDetail"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import Head from "next/head"
import DatasetDetailContent from "@/components/features/database/components/datasetDetail/DatasetDetailContent"

const DatasetDetailPage = ({}) => {
    const router = useRouter()
    const { dataset } = router.query

    const {
        metadata,
        expressionMode,
        expressionFileFormat,
        availableExpressionTypes,
        availableDegExpressionTypes,
        isLoading,
        isError,
    } = useDatasetDetail(dataset)

    if (!router.isReady || isLoading) {
        return (
            <LoadingView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        )
    }

    if (isError) {
        return (
            <ErrorView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        )
    }

    return (
        <>
            <Head>
                <title>{dataset} | ceRNAxisDB</title>
                <meta
                    name="description"
                    content={`Details of dataset ${dataset}`}
                />
            </Head>

            <DatasetDetailContent
                dataset={dataset}
                metadata={metadata}
                expressionMode={expressionMode}
                expressionFileFormat={expressionFileFormat}
                availableExpressionTypes={availableExpressionTypes}
                availableDegExpressionTypes={availableDegExpressionTypes}
            />
        </>
    )
}

export default DatasetDetailPage
