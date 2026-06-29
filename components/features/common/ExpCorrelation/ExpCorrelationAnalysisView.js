"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Splitter, Tag, Tooltip } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import ExpCorrelationPlot
    from "@/components/features/visualization/components/ExpCorrelationPlot";
import ExpCorrelationControlPanel
    from "@/components/features/common/ExpCorrelation/ExpCorrelationControlPanel";

const DEFAULT_VISUAL_CONFIG = {
    pointSize: 8,
    pointOpacity: 0.75,
    showRegressionLine: true,
};

const TYPE_PRIORITY = [
    "miRNA-mRNA",
    "miRNA-lncRNA",
    "lncRNA-mRNA",
    "miRNA-circRNA",
    "circRNA-mRNA",
];

const hasPlotData = data => {
    return Array.isArray(data?.points) && data.points.length > 0;
};

const getInitialType = ({
    availableTypes,
    validTypes,
}) => {
    const candidateTypes = Array.isArray(availableTypes) &&
    availableTypes.length > 0
        ? availableTypes
        : validTypes;

    for (const type of TYPE_PRIORITY) {
        if (candidateTypes.includes(type)) {
            return type;
        }
    }

    return candidateTypes[0] ?? null;
};

const getPairsByType = ({
    results,
    type,
}) => {
    if (!Array.isArray(results) || !type) return [];

    return results.filter(item => item.type === type);
};

const getFirstPair = pairs => {
    if (!Array.isArray(pairs) || pairs.length === 0) return null;

    return pairs[0];
};

const ExpCorrelationAnalysisView = ({
    title = "Expression Correlation Plot",
    height = 620,

    optionsData,
    validTypes = [],
    availableTypes = [],
    results = [],

    plotData,
    titlePrimary,
    titleSecondary,

    isOptionsLoading = false,
    isOptionsError = false,
    isPlotLoading = false,
    isPlotError = false,

    queryConfig,
    setQueryConfig,

    missingDescription = null,
    unavailableDescription = null,
    noTypeDescription = "No available expression correlation types",
    noSelectionDescription = "Please select an interaction type and gene pair",
    emptyDescription = "No expression correlation data",

    showTcgaBasedTag = false,
    tcgaBasedTooltip = "Expression values for this correlation plot are based on TCGA reference expression data.",
}) => {
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG);
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] =
        useState(false);

    const selectableTypes = useMemo(() => {
        if (Array.isArray(availableTypes) && availableTypes.length > 0) {
            return availableTypes;
        }

        return validTypes;
    }, [availableTypes, validTypes]);

    const pairOptions = useMemo(() => {
        return getPairsByType({
            results,
            type: queryConfig.type,
        });
    }, [results, queryConfig.type]);

    useEffect(() => {
        if (!optionsData) return;

        setQueryConfig(prev => {
            const nextType =
                prev.type && selectableTypes.includes(prev.type)
                    ? prev.type
                    : getInitialType({
                        availableTypes,
                        validTypes,
                    });

            const nextPairs = getPairsByType({
                results,
                type: nextType,
            });

            const currentPairStillValid = nextPairs.some(
                item =>
                    item.gene1 === prev.gene1 &&
                    item.gene2 === prev.gene2 &&
                    item.type === nextType
            );

            if (currentPairStillValid) {
                return {
                    ...prev,
                    type: nextType,
                };
            }

            const firstPair = getFirstPair(nextPairs);

            return {
                type: nextType,
                gene1: firstPair?.gene1 ?? null,
                gene2: firstPair?.gene2 ?? null,
            };
        });
    }, [
        optionsData,
        selectableTypes,
        availableTypes,
        validTypes,
        results,
        setQueryConfig,
    ]);

    useEffect(() => {
        if (!queryConfig.type) return;

        setQueryConfig(prev => {
            const pairs = getPairsByType({
                results,
                type: prev.type,
            });

            const currentPairStillValid = pairs.some(
                item =>
                    item.gene1 === prev.gene1 &&
                    item.gene2 === prev.gene2 &&
                    item.type === prev.type
            );

            if (currentPairStillValid) {
                return prev;
            }

            const firstPair = getFirstPair(pairs);

            return {
                ...prev,
                gene1: firstPair?.gene1 ?? null,
                gene2: firstPair?.gene2 ?? null,
            };
        });
    }, [
        queryConfig.type,
        results,
        setQueryConfig,
    ]);

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

        if (isOptionsLoading || isPlotLoading) {
            return <LoadingView containerSx={{ height: "100%" }} />;
        }

        if (isOptionsError || isPlotError) {
            return <ErrorView containerSx={{ height: "100%" }} />;
        }

        if (!selectableTypes.length) {
            return (
                <EmptyView
                    bordered
                    description={noTypeDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        if (!queryConfig.type || !queryConfig.gene1 || !queryConfig.gene2) {
            return (
                <EmptyView
                    bordered
                    description={noSelectionDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        if (!hasPlotData(plotData)) {
            return (
                <EmptyView
                    bordered
                    description={emptyDescription}
                    containerSx={{ height: "100%" }}
                />
            );
        }

        return (
            <ExpCorrelationPlot
                data={plotData}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                height="100%"
                pointSize={visualConfig.pointSize}
                pointOpacity={visualConfig.pointOpacity}
                showRegressionLine={visualConfig.showRegressionLine}
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
                            defaultSize={340}
                            min={280}
                            max={520}
                        >
                            {isOptionsLoading ? (
                                <LoadingView containerSx={{ height: "100%" }} />
                            ) : isOptionsError ? (
                                <ErrorView containerSx={{ height: "100%" }} />
                            ) : (
                                <ExpCorrelationControlPanel
                                    queryConfig={queryConfig}
                                    setQueryConfig={setQueryConfig}
                                    visualConfig={visualConfig}
                                    setVisualConfig={setVisualConfig}
                                    validTypes={selectableTypes}
                                    pairOptions={pairOptions}
                                    onCollapse={() =>
                                        setIsControlPanelCollapsed(true)
                                    }
                                />
                            )}
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

export default ExpCorrelationAnalysisView;
