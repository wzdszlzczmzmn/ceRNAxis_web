"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button } from "antd";
import {
    DownloadOutlined,
} from "@ant-design/icons";
import TaskInformationDescriptions from "@/components/features/workspace/components/taskInformation/TaskInformationDescriptions";
import SubmittedRNAListCard from "@/components/features/workspace/components/detail/CustomListQuery/SubmittedRNAListCard"
import CustomListQueryNetworkResultWrapper
    from "@/components/features/workspace/components/detail/CustomListQuery/CustomListQueryNetworkResultWrapper"
import { getWorkflowTaskResultDownloadURL } from "@/lib/api/analysis"
import { triggerBrowserDownload } from "@/lib/api/utils/browserDownload"
import CustomListQueryCMapResultSection
    from "@/components/features/workspace/components/detail/CustomListQuery/CustomListQueryCMapResultSection"
import CustomListQueryEnrichrSection
    from "@/components/features/workspace/components/detail/CustomListQuery/CustomListQueryEnrichrSection"
import CustomListQueryCMScoreSection
    from "@/components/features/workspace/components/detail/CustomListQuery/CustomListQueryCMScoreSection"

const CustomListQueryDetail = ({
    task,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const taskUUID = task?.data?.uuid;
    const isSuccess = task?.data?.status === "S";

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

            <SubmittedRNAListCard task={task} />

            <CustomListQueryNetworkResultWrapper task={task} />

            <CustomListQueryCMapResultSection task={task}/>

            <CustomListQueryEnrichrSection task={task} height={680}/>

            <CustomListQueryCMScoreSection task={task} height={680}/>
        </Stack>
    );
};

export default CustomListQueryDetail;
