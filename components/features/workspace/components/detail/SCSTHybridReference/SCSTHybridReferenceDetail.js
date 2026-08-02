"use client";

import { Box, Stack } from "@mui/system";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceVizInfo,
} from "@/components/features/workspace/hooks/useSCSTHybridReferenceVizInfo";
import {
    getWorkflowTaskResultDownloadURL,
} from "@/lib/api/analysis";
import {
    triggerBrowserDownload,
} from "@/lib/api/utils/browserDownload";
import TaskInformationDescriptions
    from "@/components/features/workspace/components/taskInformation/TaskInformationDescriptions"
import SCSTHybridReferenceUploadedFileDescriptions
    from "@/components/features/workspace/components/detail/SCSTHybridReference/UploadedFile/SCSTHybridReferenceUploadedFileDescriptions"
import SCSTHybridReferenceNetworkResultWrapper
    from "@/components/features/workspace/components/detail/SCSTHybridReference/NetworkResult/SCSTHybridReferenceNetworkResultWrapper"
import SCSTHybridReferenceAxisFinalSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/AxisFinal/SCSTHybridReferenceAxisFinalSection"
import SCSTHybridReferenceCMapResultSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/CMap/SCSTHybridReferenceCMapResultSection"
import SCSTHybridReferenceVolcanoAnalysisSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/Volcano/SCSTHybridReferenceVolcanoAnalysisSection"
import SCSTHybridReferenceLog2FCCorrelationSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/Log2FCCorrelation/SCSTHybridReferenceLog2FCCorrelationSection"
import SCSTHybridReferenceExpCorrelationSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/ExpCorrelation/SCSTHybridReferenceExpCorrelationSection"
import SCSTHybridReferenceSurvivalSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/SurvivalKM/SCSTHybridReferenceSurvivalSection"
import SCSTHybridReferenceDEGPathwaySection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/DEGPathway/SCSTHybridReferenceDEGPathwaySection"
import SCSTHybridReferenceCMScoreSection
    from "@/components/features/workspace/components/detail/SCSTHybridReference/CMScore/SCSTHybridReferenceCMScoreSection"


const SCSTHybridReferenceDetail = ({
    task,
}) => {
    const data = getTaskData(task);

    const taskUUID = data.uuid;
    const isSuccess = isTaskSuccess(
        data.status
    );

    const vizInfo = useSCSTHybridReferenceVizInfo({
        taskUUID,
        enabled: isSuccess,
    });

    console.log(vizInfo)

    const handleDownloadResult = () => {
        if (!taskUUID) return;

        const url = getWorkflowTaskResultDownloadURL(
            taskUUID
        );

        triggerBrowserDownload(url);
    };

    return (
        <Stack
            spacing={4}
            sx={{
                pt: "12px",
                px: "32px",
            }}
        >
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
                <Box
                    component="h6"
                    sx={{
                        fontSize: "36px",
                        m: 0,
                    }}
                >
                    Task Information
                </Box>

                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    disabled={
                        !isSuccess
                        || !taskUUID
                    }
                    onClick={handleDownloadResult}
                    style={{
                        marginTop: "8px",
                    }}
                >
                    Download Result
                </Button>
            </Stack>

            <TaskInformationDescriptions taskInformation={task} />

            <SCSTHybridReferenceUploadedFileDescriptions task={task} />

            <SCSTHybridReferenceNetworkResultWrapper task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceAxisFinalSection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceCMapResultSection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceVolcanoAnalysisSection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceLog2FCCorrelationSection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceExpCorrelationSection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceSurvivalSection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceDEGPathwaySection task={task} vizInfo={vizInfo} />

            <SCSTHybridReferenceCMScoreSection task={task} vizInfo={vizInfo} />
        </Stack>
    );
};


export default SCSTHybridReferenceDetail;
