"use client";

import { Button, Card, Empty } from "antd";
import { Stack } from "@mui/system";
import { ReloadOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import NetworkGraph from "@/components/features/workspace/components/detail/CustomListQuery/NetworkGraph";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import { usePairedCohortTaskNetworkResult }
    from "@/components/features/workspace/hooks/usePairedCohortTaskNetworkResult";

const PairedCohortNetworkResultWrapper = ({
    task,
}) => {
    const data = getTaskData(task);

    const taskUUID = data.uuid;
    const isSuccess = isTaskSuccess(data.status);

    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } = usePairedCohortTaskNetworkResult(isSuccess ? taskUUID : null);

    if (!taskUUID) {
        return (
            <Card title="ceRNA Network">
                <Empty description="Missing task UUID." />
            </Card>
        );
    }

    if (!isSuccess) {
        return (
            <Card title="ceRNA Network">
                <Empty description="Network result is available only after the task succeeds." />
            </Card>
        );
    }

    if (isNetworkLoading) {
        return (
            <Card title="ceRNA Network">
                <LoadingView containerSx={{ height: "520px" }} />
            </Card>
        );
    }

    if (isNetworkError) {
        return (
            <Card
                title="ceRNA Network"
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => mutateNetwork?.()}
                    >
                        Retry
                    </Button>
                }
            >
                <ErrorView containerSx={{ height: "520px" }} />
            </Card>
        );
    }

    if (!networkData) {
        return (
            <Card title="ceRNA Network">
                <Empty description="No network result data found." />
            </Card>
        );
    }

    return (
        <Card
            title="ceRNA Network"
            extra={
                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => mutateNetwork?.()}
                >
                    Refresh
                </Button>
            }
            styles={{
                body: {
                    padding: 20,
                },
            }}
        >
            <Stack spacing={2}>
                <NetworkGraph networkData={networkData} />
            </Stack>
        </Card>
    );
};

export default PairedCohortNetworkResultWrapper;
