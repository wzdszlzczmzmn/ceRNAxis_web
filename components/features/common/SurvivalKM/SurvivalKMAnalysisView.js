"use client";

import { useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Splitter, Tag, Tooltip } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import SurvivalKMPlot
    from "@/components/features/visualization/components/SurvivalKMPlot";
import SurvivalKMControlPanel
    from "@/components/features/common/SurvivalKM/SurvivalKMControlPanel";

const DEFAULT_VISUAL_CONFIG = {
    showConfidenceInterval: true,
    showSymbols: false,
    lineWidth: 2.5,
};

const hasSurvivalData = data => {
    return Array.isArray(data?.groups) &&
        data.groups.some(group =>
            Array.isArray(group?.points) && group.points.length > 0
        );
};

const SurvivalKMAnalysisView = ({
    title = "Survival Analysis",
    height = 620,

    survivalData,
    titlePrimary,
    titleSecondary,
    summary,

    groupOptions = [],
    groupValue = null,
    groupLabel = "Group",
    onGroupChange,

    isLoading = false,
    isError = false,

    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No survival analysis data",

    showTcgaBasedTag = false,
    tcgaBasedTooltip =
        "Survival grouping and Kaplan-Meier analysis are based on TCGA reference survival data.",
}) => {
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG);
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] =
        useState(false);

    const renderPlotContent = () => {
        if (missingDescription) {
            return (
                <EmptyView
                    bordered
                    description={missingDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        if (unavailableDescription) {
            return (
                <EmptyView
                    bordered
                    description={unavailableDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        if (isLoading) {
            return <LoadingView containerSx={{ height: "100%" }} />;
        }

        if (isError) {
            return <ErrorView containerSx={{ height: "100%" }} />;
        }

        if (!hasSurvivalData(survivalData)) {
            return (
                <EmptyView
                    bordered
                    description={emptyDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        return (
            <SurvivalKMPlot
                data={survivalData}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                height="100%"
                showConfidenceInterval={visualConfig.showConfidenceInterval}
                showSymbols={visualConfig.showSymbols}
                lineWidth={visualConfig.lineWidth}
                containerSx={{
                    minHeight: 0,
                }}
            />
        );
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    pb: "12px",
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        component="h6"
                        sx={{
                            fontSize: "36px",
                            fontWeight: 700,
                            m: 0,
                        }}
                    >
                        {title}
                    </Box>

                    {showTcgaBasedTag && (
                        <Tooltip
                            title={tcgaBasedTooltip}
                            placement="right"
                        >
                            <Tag
                                color="blue"
                                style={{
                                    marginTop: "6px",
                                    marginInlineEnd: 0,
                                    cursor: "help",
                                }}
                            >
                                TCGA-based
                            </Tag>
                        </Tooltip>
                    )}
                </Stack>
            </Stack>

            <Box
                sx={{
                    height,
                    minHeight: 520,
                    border: "1px solid #e5e7eb",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#fff",
                }}
            >
                <Splitter>
                    {!isControlPanelCollapsed && (
                        <Splitter.Panel
                            defaultSize={320}
                            min={260}
                            max={500}
                        >
                            <SurvivalKMControlPanel
                                groupOptions={groupOptions}
                                groupValue={groupValue}
                                groupLabel={groupLabel}
                                onGroupChange={onGroupChange}

                                visualConfig={visualConfig}
                                setVisualConfig={setVisualConfig}
                                summary={summary}

                                onCollapse={() =>
                                    setIsControlPanelCollapsed(true)
                                }
                            />
                        </Splitter.Panel>
                    )}

                    <Splitter.Panel>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                p: 2,
                                position: "relative",
                            }}
                        >
                            {isControlPanelCollapsed && (
                                <Button
                                    size="small"
                                    icon={<MenuUnfoldOutlined />}
                                    onClick={() =>
                                        setIsControlPanelCollapsed(false)
                                    }
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        zIndex: 10,
                                    }}
                                >
                                    Controls
                                </Button>
                            )}

                            {renderPlotContent()}
                        </Box>
                    </Splitter.Panel>
                </Splitter>
            </Box>
        </Stack>
    );
};

export default SurvivalKMAnalysisView;
