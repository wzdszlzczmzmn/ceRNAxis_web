"use client";

import { Button, Card, Empty } from "antd";
import { Stack } from "@mui/system";
import { ReloadOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import NetworkGraph
    from "@/components/features/workspace/components/detail/CustomListQuery/NetworkGraph";

const NetworkResultCard = ({
    title = "ceRNA Network",
    networkData,
    isLoading,
    isError,
    onRefresh,
    missingDescription,
    unavailableDescription,
    emptyDescription = "No network result data found.",
    isAvailable = true,
    height = 520,
}) => {
    if (missingDescription) {
        return (
            <Card title={title}>
                <Empty description={missingDescription} />
            </Card>
        );
    }

    if (!isAvailable) {
        return (
            <Card title={title}>
                <Empty description={unavailableDescription} />
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card title={title}>
                <LoadingView containerSx={{ height: `${height}px` }} />
            </Card>
        );
    }

    if (isError) {
        return (
            <Card
                title={title}
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => onRefresh?.()}
                    >
                        Retry
                    </Button>
                }
            >
                <ErrorView containerSx={{ height: `${height}px` }} />
            </Card>
        );
    }

    if (!networkData) {
        return (
            <Card title={title}>
                <Empty description={emptyDescription} />
            </Card>
        );
    }

    return (
        <Card
            title={title}
            extra={
                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => onRefresh?.()}
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

export default NetworkResultCard;
