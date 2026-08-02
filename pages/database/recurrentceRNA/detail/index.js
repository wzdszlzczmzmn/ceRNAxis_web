import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Stack } from "@mui/system";

import AxisRecurrentDetailResult
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentDetailResult";


const normalizeSignatureParam = value => {
    if (Array.isArray(value)) {
        return String(value[0] || "").trim();
    }

    return String(value || "").trim();
};


const RecurrentAxisDetailPage = () => {
    const router = useRouter();

    const signature = router.isReady
        ? normalizeSignatureParam(
            router.query.signature
        )
        : "";

    return (
        <>
            <Head>
                <title>
                    Databases | Recurrent Axis Detail
                </title>

                <meta
                    name="description"
                    content="Recurrent ceRNA Axis context detail"
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
                    Recurrent Axis Detail
                </Box>

                {
                    router.isReady && (
                        <AxisRecurrentDetailResult
                            signature={signature}
                        />
                    )
                }
            </Stack>
        </>
    );
};


export default RecurrentAxisDetailPage;
