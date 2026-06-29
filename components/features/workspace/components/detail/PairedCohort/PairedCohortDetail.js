"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import TaskInformationDescriptions from "@/components/features/workspace/components/taskInformation/TaskInformationDescriptions";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import PairedCohortUploadedFileDescriptions
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortUploadedFileDescriptions"
import PairedCohortVolcanoAnalysisSection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortVolcanoAnalysisSection"
import PairedCohortLog2FCCorrelationSection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortLog2FCCorrelationSection"
import PairedCohortExpCorrelationSection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortExpCorrelationSection"
import PairedCohortNetworkResultWrapper
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortNetworkResultWrapper"
import { getWorkflowTaskResultDownloadURL } from "@/lib/api/analysis"
import { triggerBrowserDownload } from "@/lib/api/utils/browserDownload"
import PairedCohortAxisFinalSection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortAxisFinalSection"
import PairedCohortSurvivalSection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortSurvivalSection"
import PairedCohortCMapResultSection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortCMapResultSection"
import PairedCohortDEGPathwaySection
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortDEGPathwaySection"

const PairedCohortDetail = ({
    task,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const data = getTaskData(task);
    const taskUUID = data.uuid;
    const isSuccess = isTaskSuccess(data.status);

    const handleDownloadResult = () => {
        if (!taskUUID) return;

        const url = getWorkflowTaskResultDownloadURL(taskUUID);

        triggerBrowserDownload(url);
    };

    return (
        <Stack spacing={4} sx={{ pt: "12px", px: "32px" }}>
            <Stack
                spacing={4}
                direction="row"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    mb: "36px",
                    paddingBottom: "12px",
                }}
            >
                <Box component="h6" sx={{ fontSize: "36px", m: 0 }}>
                    Task Information
                </Box>

                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={isDownloading}
                    disabled={!isSuccess || !taskUUID}
                    onClick={handleDownloadResult}
                    style={{ marginTop: "8px" }}
                >
                    Download Result
                </Button>
            </Stack>

            <TaskInformationDescriptions taskInformation={task} />

            <PairedCohortUploadedFileDescriptions task={task} />

            <PairedCohortNetworkResultWrapper task={task} />

            <PairedCohortAxisFinalSection task={task} />

            <PairedCohortCMapResultSection task={task} />

            <PairedCohortVolcanoAnalysisSection task={task} />

            <PairedCohortLog2FCCorrelationSection task={task} />

            <PairedCohortExpCorrelationSection task={task} />

            <PairedCohortSurvivalSection task={task} />

            <PairedCohortDEGPathwaySection task={task} />
        </Stack>
    );
};

export default PairedCohortDetail;
