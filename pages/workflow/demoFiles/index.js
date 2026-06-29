"use client";

import { useRouter } from "next/router";
import Head from "next/head";
import { Box, Stack } from "@mui/system";
import { Button, Card, Empty } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import PairedCohortDemoFilesDetail
    from "@/components/features/workflow/components/demoFiles/PairedCohortDemoFilesDetail";
import { getHybridReferenceDemoFilesDownloadURL, getPairedCohortDemoFilesDownloadURL }
    from "@/lib/api/analysis";
import { triggerBrowserDownload } from "@/lib/api/utils/browserDownload"
import HybridReferenceDemoFilesDetail
    from "@/components/features/workflow/components/demoFiles/HybridReferenceDemoFilesDetail"

const DEMO_FILE_COMPONENT_MAP = {
    PairedCohortTask: PairedCohortDemoFilesDetail,
    HybridReferenceTask: HybridReferenceDemoFilesDetail,
};

const DEMO_FILE_DOWNLOAD_URL_MAP = {
    PairedCohortTask: getPairedCohortDemoFilesDownloadURL,
    HybridReferenceTask: getHybridReferenceDemoFilesDownloadURL,
};
const DemoFiles = () => {
    const router = useRouter();

    const rawTaskType = router.query.task_type;
    const taskType = Array.isArray(rawTaskType)
        ? rawTaskType[0]
        : rawTaskType;

    const DemoFileComponent = DEMO_FILE_COMPONENT_MAP[taskType];
    const getDownloadURL = DEMO_FILE_DOWNLOAD_URL_MAP[taskType];

    const canDownloadDemoFiles = Boolean(
        router.isReady &&
        taskType &&
        DemoFileComponent &&
        getDownloadURL
    );

    const handleDownloadDemoFiles = () => {
        if (!canDownloadDemoFiles) return;

        const downloadURL = getDownloadURL();

        triggerBrowserDownload(downloadURL);
    };

    return (
        <>
            <Head>
                <title>Demo Files | ceRNA Axis</title>
            </Head>

            <Stack spacing={4} sx={{ marginTop: "24px" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={3}
                    sx={{
                        borderBottom: "2px solid #e0e0e0",
                        pb: "12px",
                    }}
                >
                    <Box
                        component="h6"
                        sx={{
                            fontSize: "40px",
                            fontWeight: 700,
                            m: 0,
                        }}
                    >
                        Demo Files Explore
                    </Box>

                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        disabled={!canDownloadDemoFiles}
                        onClick={handleDownloadDemoFiles}
                        style={{
                            marginTop: "8px",
                        }}
                    >
                        Download Demo Files
                    </Button>
                </Stack>

                {!router.isReady ? null : !taskType ? (
                    <Card>
                        <Empty description="Missing query parameter: task_type." />
                    </Card>
                ) : DemoFileComponent ? (
                    <DemoFileComponent />
                ) : (
                    <Card>
                        <Empty
                            description={`Unsupported demo file task type: ${taskType}`}
                        />
                    </Card>
                )}
            </Stack>
        </>
    );
};

export default DemoFiles;
