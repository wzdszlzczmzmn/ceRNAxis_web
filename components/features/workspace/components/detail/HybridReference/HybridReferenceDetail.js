"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import TaskInformationDescriptions
    from "@/components/features/workspace/components/taskInformation/TaskInformationDescriptions";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import { getWorkflowTaskResultDownloadURL } from "@/lib/api/analysis";
import { triggerBrowserDownload } from "@/lib/api/utils/browserDownload";
import HybridReferenceUploadedFileDescriptions
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceUploadedFileDescriptions"
import HybridReferenceNetworkResultWrapper
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceNetworkResultWrapper"
import HybridReferenceAxisFinalSection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceAxisFinalSection"
import HybridReferenceCMapResultSection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceCMapResultSection"
import HybridReferenceLog2FCCorrelationSection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceLog2FCCorrelationSection"
import HybridReferenceVolcanoAnalysisSection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceVolcanoAnalysisSection"
import HybridReferenceExpCorrelationSection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceExpCorrelationSection"
import HybridReferenceSurvivalSection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceSurvivalSection"
import HybridReferenceDEGPathwaySection
    from "@/components/features/workspace/components/detail/HybridReference/HybridReferenceDEGPathwaySection"

const HybridReferenceDetail = ({
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

            <HybridReferenceUploadedFileDescriptions task={task} />

            <HybridReferenceNetworkResultWrapper task={task} />

            <HybridReferenceAxisFinalSection task={task} />

            <HybridReferenceCMapResultSection task={task} />

            <HybridReferenceVolcanoAnalysisSection task={task} />

            <HybridReferenceLog2FCCorrelationSection task={task} />

            <HybridReferenceExpCorrelationSection task={task} />

            <HybridReferenceSurvivalSection task={task} />

            <HybridReferenceDEGPathwaySection task={task} />
        </Stack>
    );
};

export default HybridReferenceDetail;
