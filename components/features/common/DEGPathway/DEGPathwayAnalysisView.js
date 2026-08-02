"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Splitter, Tag, Tooltip } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import DEGPathwayBubblePlot
    from "@/components/features/visualization/components/DEGPathwayBubblePlot";
import DEGPathwayControlPanel
    from "@/components/features/common/DEGPathway/DEGPathwayControlPanel";

const DEFAULT_VISUAL_CONFIG = {
    topN: 30,
    showAll: false,
    rankingMethod: "abs_nes",
    searchInput: "",
    focusKeyword: "",
    minBubbleSize: 10,
    maxBubbleSize: 36,
};

const hasPathwayData = data => {
    return Array.isArray(data?.results) && data.results.length > 0;
};

const getPathwaySearchOptions = data => {
    if (!Array.isArray(data?.results)) return [];

    return Array.from(
        new Set(
            data.results
                .map(item => item?.term)
                .filter(Boolean)
                .map(String)
        )
    )
        .sort((a, b) => a.localeCompare(b))
        .map(term => ({
            label: term,
            value: term,
        }));
};

const DEGPathwayAnalysisView = ({
    title = "DEG Pathway Enrichment Plot",
    height = 680,

    pathwayData,
    pathwayTitle,
    summary,

    groupOptions = [],
    groupValue = null,
    groupLabel = "Group",
    onGroupChange,

    isLoading = false,
    isError = false,

    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No DEG pathway enrichment data",

    showTcgaBasedTag = false,
    tcgaBasedTooltip =
        "DEG pathway enrichment is based on TCGA reference data.",
}) => {
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG);
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] =
        useState(false);

    const pathwaySearchOptions = useMemo(() => {
        return getPathwaySearchOptions(pathwayData);
    }, [pathwayData]);

    useEffect(() => {
        if (visualConfig.showAll) return;

        setVisualConfig(prev => {
            if (!prev.searchInput && !prev.focusKeyword) return prev;

            return {
                ...prev,
                searchInput: "",
                focusKeyword: "",
            };
        });
    }, [visualConfig.showAll]);

    useEffect(() => {
        setVisualConfig(prev => {
            if (!prev.searchInput && !prev.focusKeyword) {
                return prev;
            }

            const validValues = new Set(
                pathwaySearchOptions.map(
                    item => item.value
                )
            );

            const searchValid =
                !prev.searchInput ||
                validValues.has(prev.searchInput);

            const focusValid =
                !prev.focusKeyword ||
                validValues.has(prev.focusKeyword);

            if (searchValid && focusValid) {
                return prev;
            }

            return {
                ...prev,
                searchInput: "",
                focusKeyword: "",
            };
        });
    }, [pathwaySearchOptions]);

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

        if (!hasPathwayData(pathwayData)) {
            return (
                <EmptyView
                    bordered
                    description={emptyDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        return (
            <DEGPathwayBubblePlot
                data={pathwayData}
                title={pathwayTitle || "DEG Pathway Enrichment"}
                subtitle={null}
                height="100%"
                topN={visualConfig.topN}
                showAll={visualConfig.showAll}
                rankingMethod={visualConfig.rankingMethod}
                focusKeyword={visualConfig.focusKeyword}
                minBubbleSize={visualConfig.minBubbleSize}
                maxBubbleSize={visualConfig.maxBubbleSize}
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
                <Stack direction="row" spacing={1.5} alignItems="center">
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

                <Box
                    component="span"
                    sx={{
                        fontSize: "14px",
                        color: "#595959",
                        marginTop: "24px",
                    }}
                >
                    TOTAL OF{" "}
                    <strong>
                        {summary?.cleaned_count ?? 0}
                    </strong>{" "}
                    PATHWAYS
                </Box>
            </Stack>

            <Box
                sx={{
                    height,
                    minHeight: 560,
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
                            <DEGPathwayControlPanel
                                groupOptions={groupOptions}
                                groupValue={groupValue}
                                groupLabel={groupLabel}
                                onGroupChange={onGroupChange}

                                visualConfig={visualConfig}
                                setVisualConfig={setVisualConfig}
                                pathwaySearchOptions={pathwaySearchOptions}

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

export default DEGPathwayAnalysisView;
