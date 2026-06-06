import { useEffect } from "react"
import { useRouter } from "next/router"
import {
    DEFAULT_GENE_BIO_TYPE,
    isValidGeneBioType,
} from "@/lib/api/database/datasetMetaTable"
import DatasetMetadataTableContent
    from "@/components/features/database/components/datasetMetaTable/DatasetMetadataTableContent"
import Head from "next/head"
import { Box, Stack } from "@mui/system"

const DatasetMetaTablePage = () => {
    const router = useRouter()
    const { gene_bio_type } = router.query

    const geneBioType = Array.isArray(gene_bio_type)
        ? gene_bio_type[0]
        : gene_bio_type

    useEffect(() => {
        if (!router.isReady) return

        if (!geneBioType || !isValidGeneBioType(geneBioType)) {
            router.replace(
                {
                    pathname: "/database/datasetMetaTable",
                    query: {
                        gene_bio_type: DEFAULT_GENE_BIO_TYPE,
                    },
                },
                undefined,
                { shallow: true }
            )
        }
    }, [router, geneBioType])

    if (!router.isReady) return null

    if (!geneBioType || !isValidGeneBioType(geneBioType)) {
        return null
    }

    return (
        <>
            <Head>
                <title>Databases | {geneBioType}</title>
                <meta name="description" content="ceRNAxis Database Table"/>
            </Head>
            <Stack spacing={4} sx={{ marginTop: '24px' }}>
                <Box
                    component='h6'
                    sx={{ fontSize: '40px' }}
                >
                    {geneBioType} Dataset List
                </Box>
                <DatasetMetadataTableContent geneBioType={geneBioType} />
            </Stack>
        </>
    )
}

export default DatasetMetaTablePage
