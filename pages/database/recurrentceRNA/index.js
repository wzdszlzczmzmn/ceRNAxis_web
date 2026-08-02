import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Stack } from "@mui/system";

import AxisRecurrentTable
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentTable";


const normalizeSearchParam = value => {
    if (Array.isArray(value)) {
        return String(value[0] || "").trim();
    }

    return String(value || "").trim();
};


const RecurrenceceRNA = () => {
    const router = useRouter();

    const initialSearch = router.isReady
        ? normalizeSearchParam(router.query.search)
        : "";

    return (
        <>
            <Head>
                <title>
                    Databases | Recurrence ceRNA
                </title>

                <meta
                    name="description"
                    content="ceRNAxis Database Table"
                />
            </Head>

            <Stack
                spacing={4}
                sx={{
                    marginTop: "24px",
                }}
            >
                <Box
                    component="h1"
                    sx={{
                        fontSize: "40px",
                        margin: 0,
                    }}
                >
                    Recurrent ceRNA Table
                </Box>

                {
                    router.isReady && (
                        <AxisRecurrentTable
                            initialSearch={initialSearch}
                        />
                    )
                }
            </Stack>
        </>
    );
};


export default RecurrenceceRNA;
