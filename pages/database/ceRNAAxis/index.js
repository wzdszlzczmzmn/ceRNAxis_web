import { Box, Stack } from "@mui/system"
import Head from "next/head"
import AxisTable from "@/components/features/database/components/ceRNAAxisDatabase/AxisTable"

const DatabasePage = ({}) => {
    return (
        <>
            <Head>
                <title>Databases | ceRNAxis</title>
                <meta name="description" content="ceRNAxis Database Table"/>
            </Head>
            <Stack spacing={4} sx={{ marginTop: '24px' }}>
                <Box
                    component='h6'
                    sx={{ fontSize: '40px' }}
                >
                    ceRNA Axis Table
                </Box>
                <AxisTable/>
            </Stack>
        </>
    )
}

export default DatabasePage
