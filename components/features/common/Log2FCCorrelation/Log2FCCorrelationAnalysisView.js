"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Splitter } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import Log2FCCorrelationPlot
    from "@/components/features/visualization/components/Log2FCCorrelationPlot";
import Log2FCCorrelationControlPanel
    from "@/components/features/common/Log2FCCorrelation/Log2FCCorrelationControlPanel";

const DEFAULT_VISUAL_CONFIG = {
    pointSize: 9,
    pointOpacitySame: 0.45,
    pointOpacityAnti: 0.85,
};

const BACKGROUND_TYPE_LABEL_MAP = {
    "miRNA-mRNA": "miRNA-mRNA",
    "miRNA-lncRNA": "miRNA-lncRNA",
    "miRNA-circRNA": "miRNA-circRNA",
};

const hasCorrelationData = data => {
    return Array.isArray(data?.points) && data.points.length > 0;
};

const getSearchOptions = data => {
    if (!Array.isArray(data?.points)) {
        return [];
    }

    const values = data.points
        .flatMap(item => [item.miRNA, item.ceRNA])
        .filter(Boolean);

    return Array.from(new Set(values)).map(value => ({
        label: value,
        value,
    }));
};

const buildBackgroundTypeOptions = backgroundTypes => {
    return backgroundTypes.map(typeValue => ({
        label: BACKGROUND_TYPE_LABEL_MAP[typeValue] ?? typeValue,
        value: typeValue,
    }));
};

const Log2FCCorrelationAnalysisView = ({
    title = "Log2FC Correlation Plot",
    height = 620,

    queryConfig,
    setQueryConfig,

    correlationData,
    titlePrimary,
    titleSecondary,

    groupOptions = [],
    groupLabel = "Group",

    availableTypes = [],

    isLoading = false,
    isError = false,

    missingDescription = null,
    unavailableDescription = null,
}) => {
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] =
        useState(false);

    const interactionTypeOptions = useMemo(() => {
        return buildBackgroundTypeOptions(availableTypes);
    }, [availableTypes]);

    const searchOptions = useMemo(() => {
        return getSearchOptions(correlationData);
    }, [correlationData]);

    useEffect(() => {
        setSearchKeyword("");
    }, [
        queryConfig?.groupValue,
        queryConfig?.interactionType,
    ]);

    const renderPlotContent = () => {
        if (missingDescription) {
            return (
                <EmptyView
                    bordered
                    description={missingDescription}
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (unavailableDescription) {
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
            groupOptions.length > 0 &&
            !queryConfig?.groupValue
        ) {
            return (
                <EmptyView
                    bordered
                    description="No available group"
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (
            !availableTypes.length ||
            !queryConfig?.interactionType
        ) {
            return (
                <EmptyView
                    bordered
                    description={
                        "No available background interaction types"
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (!hasCorrelationData(correlationData)) {
            return (
                <EmptyView
                    bordered
                    description={
                        "No log2FC correlation data"
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        return (
            <Log2FCCorrelationPlot
                data={correlationData}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                height="100%"
                pointSize={visualConfig.pointSize}
                pointOpacitySame={
                    visualConfig.pointOpacitySame
                }
                pointOpacityAnti={
                    visualConfig.pointOpacityAnti
                }
                highlightKeyword={
                    searchKeyword.trim()
                }
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
                            <Log2FCCorrelationControlPanel
                                queryConfig={queryConfig}
                                setQueryConfig={setQueryConfig}

                                groupOptions={groupOptions}
                                groupLabel={groupLabel}

                                interactionTypeOptions={
                                    interactionTypeOptions
                                }

                                visualConfig={visualConfig}
                                setVisualConfig={setVisualConfig}

                                searchKeyword={searchKeyword}
                                setSearchKeyword={setSearchKeyword}
                                searchOptions={searchOptions}

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

export default Log2FCCorrelationAnalysisView;
