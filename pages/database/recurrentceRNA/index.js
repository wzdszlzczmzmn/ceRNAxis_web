import Head from "next/head"
import { Box, Stack } from "@mui/system"
import AxisRecurrentTable from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentTable"

const RecurrenceceRNA = ({}) => {
    return (
        <>
            <Head>
                <title>Databases | Recurrence ceRNA</title>
                <meta name="description" content="ceRNAxis Database Table"/>
            </Head>
            <Stack spacing={4} sx={{ marginTop: '24px' }}>
                <Box
                    component='h6'
                    sx={{ fontSize: '40px' }}
                >
                    Recurrent ceRNA Table
                </Box>
                <AxisRecurrentTable/>
            </Stack>
        </>
    )
}

export default RecurrenceceRNA
