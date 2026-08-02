"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { Box, Stack } from "@mui/system";
import {
    Button,
    Splitter,
} from "antd";
import {
    MenuUnfoldOutlined,
} from "@ant-design/icons";

import LoadingView
    from "@/components/common/status/LoadingView";
import ErrorView
    from "@/components/common/status/ErrorView";
import EmptyView
    from "@/components/common/status/EmptyView";

import EnrichrHorizontalBarPlot
    from "@/components/features/visualization/components/EnrichrHorizontalBarPlot";

import EnrichrBarPlotControlPanel
    from "@/components/features/common/Enrichr/EnrichrBarPlotControlPanel";

const DEFAULT_VISUAL_CONFIG = {
    direction: "up",
    xAxisScale: "linear",

    topN: 30,
    showAll: false,
    rankingMethod: "combined_score_desc",

    searchInput: "",
    focusKeyword: "",
};

const hasEnrichrData = data => {
    return (
        Array.isArray(data?.results) &&
        data.results.length > 0
    );
};

const getTermSearchOptions = data => {
    if (
        !Array.isArray(data?.results)
    ) {
        return [];
    }

    return Array.from(
        new Set(
            data.results
                .map(item => item?.term)
                .filter(Boolean)
                .map(String)
        )
    )
        .sort(
            (a, b) =>
                a.localeCompare(b)
        )
        .map(term => ({
            label: term,
            value: term,
        }));
};

const EnrichrAnalysisView = ({
    title = "Pathway Enrichment",
    height = 680,

    enrichrData,
    plotTitle,
    summary,

    visualConfig,
    setVisualConfig,

    isLoading = false,
    isError = false,

    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No Enrichment pathway enrichment data",
}) => {
    const [
        isControlPanelCollapsed,
        setIsControlPanelCollapsed,
    ] = useState(false);

    const termSearchOptions =
        useMemo(() => {
            return getTermSearchOptions(
                enrichrData
            );
        }, [enrichrData]);

    useEffect(() => {
        if (visualConfig.showAll) {
            return;
        }

        setVisualConfig(prev => {
            if (
                !prev.searchInput &&
                !prev.focusKeyword
            ) {
                return prev;
            }

            return {
                ...prev,
                searchInput: "",
                focusKeyword: "",
            };
        });
    }, [
        visualConfig.showAll,
    ]);

    const renderPlotContent = () => {
        if (missingDescription) {
            return (
                <EmptyView
                    bordered
                    description={
                        missingDescription
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (
            unavailableDescription
        ) {
            return (
                <EmptyView
                    bordered
                    description={
                        unavailableDescription
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (isLoading) {
            return (
                <LoadingView
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (isError) {
            return (
                <ErrorView
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (
            !hasEnrichrData(
                enrichrData
            )
        ) {
            return (
                <EmptyView
                    bordered
                    description={
                        emptyDescription
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        return (
            <EnrichrHorizontalBarPlot
                data={enrichrData}
                title={
                    plotTitle ||
                    "Enrichr Pathway Enrichment"
                }
                height="100%"
                topN={visualConfig.topN}
                showAll={visualConfig.showAll}
                rankingMethod={visualConfig.rankingMethod}
                focusKeyword={visualConfig.focusKeyword}
                xAxisScale={visualConfig.xAxisScale}
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
                    borderBottom:
                        "2px solid #e0e0e0",
                    pb: "12px",
                }}
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
                        {
                            summary
                                ?.returned_count ??
                            summary
                                ?.raw_count ??
                            0
                        }
                    </strong>{" "}
                    TERMS
                </Box>
            </Stack>

            <Box
                sx={{
                    height,
                    minHeight: 560,
                    border:
                        "1px solid #e5e7eb",
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
                            <EnrichrBarPlotControlPanel
                                visualConfig={
                                    visualConfig
                                }
                                setVisualConfig={
                                    setVisualConfig
                                }
                                pathwaySearchOptions={
                                    termSearchOptions
                                }
                                onCollapse={() =>
                                    setIsControlPanelCollapsed(
                                        true
                                    )
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
                                position:
                                    "relative",
                            }}
                        >
                            {isControlPanelCollapsed && (
                                <Button
                                    size="small"
                                    icon={
                                        <MenuUnfoldOutlined/>
                                    }
                                    onClick={() =>
                                        setIsControlPanelCollapsed(
                                            false
                                        )
                                    }
                                    style={{
                                        position:
                                            "absolute",
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

export default EnrichrAnalysisView;
