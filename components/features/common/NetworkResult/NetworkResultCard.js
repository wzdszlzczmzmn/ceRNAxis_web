"use client";

import { Button, Card, Empty } from "antd";
import { Box, Stack } from "@mui/system";
import { ReloadOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import NetworkGraph
    from "@/components/features/workspace/components/detail/CustomListQuery/NetworkGraph";

const NETWORK_CONTAINER_STYLE = {
    width: "100%",
    height: "75vh",
    minHeight: 720
};

const NetworkContentContainer = ({
    children,
}) => {
    return (
        <Box
            sx={NETWORK_CONTAINER_STYLE}
        >
            {children}
        </Box>
    );
};

const NetworkResultCard = ({
    title = "ceRNA Network",
    titleExtra,
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
    const renderCardTitle = () => (
        <Stack
            direction="row"
            spacing={2}
            alignItems="center"
        >
            <span>{title}</span>

            {titleExtra}
        </Stack>
    );

    if (missingDescription) {
        return (
            <Card title={renderCardTitle()}>
                <NetworkContentContainer>
                    <Empty description={missingDescription}/>
                </NetworkContentContainer>
            </Card>
        );
    }

    if (!isAvailable) {
        return (
            <Card title={renderCardTitle()}>
                <NetworkContentContainer>
                    <Empty description={unavailableDescription}/>
                </NetworkContentContainer>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card title={renderCardTitle()}>
                <NetworkContentContainer>
                    <LoadingView containerSx={{ height: `${height}px` }}/>
                </NetworkContentContainer>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card
                title={renderCardTitle()}
                extra={
                    <Button
                        icon={<ReloadOutlined/>}
                        onClick={() => onRefresh?.()}
                    >
                        Retry
                    </Button>
                }
            >
                <NetworkContentContainer>
                    <ErrorView containerSx={{ height: `${height}px` }}/>
                </NetworkContentContainer>
            </Card>
        );
    }

    if (!networkData) {
        return (
            <Card title={renderCardTitle()}>
                <NetworkContentContainer>
                    <Empty description={emptyDescription}/>
                </NetworkContentContainer>
            </Card>
        );
    }

    return (
        <Card
            title={renderCardTitle()}
            extra={
                <Button
                    icon={<ReloadOutlined/>}
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
                <NetworkGraph key={networkData?.group_value} networkData={networkData}/>
            </Stack>
        </Card>
    );
};

export default NetworkResultCard;
