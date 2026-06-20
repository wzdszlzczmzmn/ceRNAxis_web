"use client";

import { Alert, Button, Card, Empty, Space, Statistic, Typography } from "antd";
import { Stack } from "@mui/system";
import { ReloadOutlined } from "@ant-design/icons";
import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import { useCustomListQueryNetworkResult } from "@/components/features/workspace/hooks/useCustomListQueryNetworkResult";
import NetworkGraph from "@/components/features/workspace/components/detail/CustomListQuery/NetworkGraph"

const { Text } = Typography;

const CustomListQueryNetworkResultWrapper = ({ task }) => {
    const taskUUID = task?.data?.uuid;
    const isSuccess = task?.data?.status === "S";

    const {
        networkData,
        isNetworkLoading,
        isNetworkError,
        mutateNetwork,
    } = useCustomListQueryNetworkResult(isSuccess ? taskUUID : null);

    if (!taskUUID) {
        return (
            <Card title="ceRNA-Immune Network">
                <Empty description="Missing task UUID." />
            </Card>
        );
    }

    if (!isSuccess) {
        return (
            <Card title="ceRNA-Immune Network">
                <Empty description="Network result is available only after the task succeeds." />
            </Card>
        );
    }

    if (isNetworkLoading) {
        return (
            <Card title="ceRNA-Immune Network">
                <LoadingView containerSx={{ height: "520px" }} />
            </Card>
        );
    }

    if (isNetworkError) {
        return (
            <Card
                title="ceRNA-Immune Network"
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
            <Card title="ceRNA-Immune Network">
                <Empty description="No network result data found." />
            </Card>
        );
    }

    const meta = networkData.meta ?? {};

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

export default CustomListQueryNetworkResultWrapper;
