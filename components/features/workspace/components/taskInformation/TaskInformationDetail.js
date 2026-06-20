"use client";

import { useRouter } from "next/router";
import { Button, Card, Empty } from "antd";
import {
    FileSearchOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { Box, Stack } from "@mui/system";
import TaskInformationDescriptions from "@/components/features/workspace/components/taskInformation/TaskInformationDescriptions";
import { getTaskData, isTaskSuccess } from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const TaskEmpty = () => {
    return (
        <Stack
            sx={{
                alignItems: "center",
                height: 420,
                justifyContent: "center",
            }}
        >
            <Empty description="Search a task UUID to view task information." />
        </Stack>
    );
};

const TaskDetailContent = ({
    taskInformation,
    onRefresh,
}) => {
    const router = useRouter();
    const data = getTaskData(taskInformation);

    const handleNavigate = () => {
        if (!data.uuid) return;

        router.push(`/workspace/detail?taskId=${data.uuid}`);
    };

    return (
        <Stack spacing={3}>
            <Box
                component="h6"
                sx={{
                    fontSize: 28,
                    fontWeight: 500,
                    m: 0,
                }}
            >
                Task Information
            </Box>

            <TaskInformationDescriptions taskInformation={taskInformation} />

            <Stack
                direction="row"
                spacing={3}
                sx={{
                    justifyContent: "center",
                    pt: 1,
                }}
            >
                <Button
                    size="large"
                    icon={<ReloadOutlined />}
                    style={{ width: 260 }}
                    onClick={onRefresh}
                >
                    Refresh Task Status
                </Button>

                <Button
                    type="primary"
                    size="large"
                    icon={<FileSearchOutlined />}
                    style={{ width: 260 }}
                    disabled={!isTaskSuccess(data.status)}
                    onClick={handleNavigate}
                >
                    View Task Detail
                </Button>
            </Stack>
        </Stack>
    );
};

const TaskInformationDetail = ({
    taskInformation,
    onRefresh,
}) => {
    return (
        <Card
            style={{
                width: "100%",
                borderRadius: 10,
                border: "1px solid #1677FF",
            }}
            styles={{
                body: {
                    padding: 32,
                },
            }}
        >
            {taskInformation === null ? (
                <TaskEmpty />
            ) : (
                <TaskDetailContent
                    taskInformation={taskInformation}
                    onRefresh={onRefresh}
                />
            )}
        </Card>
    );
};

export default TaskInformationDetail;
