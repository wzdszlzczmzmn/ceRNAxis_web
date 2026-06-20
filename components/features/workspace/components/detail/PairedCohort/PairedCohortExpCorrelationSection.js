"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Splitter } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import ExpCorrelationPlot from "@/components/features/visualization/components/ExpCorrelationPlot";

import { usePairedCohortExpCorrelationOptions }
    from "@/components/features/workspace/hooks/usePairedCohortExpCorrelationOptions";
import { usePairedCohortExpCorrelationPlotData }
    from "@/components/features/workspace/hooks/usePairedCohortExpCorrelationPlotData";
import PairedCohortExpCorrelationControlPanel
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortExpCorrelationControlPanel";

const DEFAULT_VISUAL_CONFIG = {
    pointSize: 8,
    pointOpacity: 0.75,
    showRegressionLine: true,
};

const hasPlotData = data => {
    return Array.isArray(data?.points) && data.points.length > 0;
};

const getInitialType = optionsData => {
    const validTypes = optionsData?.valid_types ?? [];

    if (validTypes.includes("miRNA-mRNA")) {
        return "miRNA-mRNA";
    }

    return validTypes[0] ?? null;
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

const PairedCohortExpCorrelationSection = ({
    task,
    height = 620,
}) => {
    const taskUUID = task?.data?.uuid;

    const [queryConfig, setQueryConfig] = useState({
        type: null,
        gene1: null,
        gene2: null,
    });

    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG);
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);

    const {
        optionsData,
        validTypes,
        results,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = usePairedCohortExpCorrelationOptions({
        taskUUID,
    });

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
                prev.type && validTypes.includes(prev.type)
                    ? prev.type
                    : getInitialType(optionsData);

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
    }, [optionsData, validTypes, results]);

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
    }, [queryConfig.type, results]);

    const {
        plotData,
        titlePrimary,
        titleSecondary,
        isLoading: isPlotLoading,
        isError: isPlotError,
    } = usePairedCohortExpCorrelationPlotData({
        taskUUID,
        type: queryConfig.type,
        gene1: queryConfig.gene1,
        gene2: queryConfig.gene2,
    });

    const renderPlotContent = () => {
        if (!taskUUID) {
            return (
                <EmptyView
                    bordered
                    description="Missing task UUID"
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

        if (!queryConfig.type || !queryConfig.gene1 || !queryConfig.gene2) {
            return (
                <EmptyView
                    bordered
                    description="Please select an interaction type and gene pair"
                    containerSx={{ height: "100%" }}
                />
            );
        }

        if (!hasPlotData(plotData)) {
            return (
                <EmptyView
                    bordered
                    description="No expression correlation data"
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
                <Box
                    component="h6"
                    sx={{
                        fontSize: "36px",
                        fontWeight: 700,
                        m: 0,
                    }}
                >
                    Expression Correlation Plot
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
                            defaultSize={340}
                            min={280}
                            max={520}
                        >
                            {isOptionsLoading ? (
                                <LoadingView containerSx={{ height: "100%" }} />
                            ) : isOptionsError ? (
                                <ErrorView containerSx={{ height: "100%" }} />
                            ) : (
                                <PairedCohortExpCorrelationControlPanel
                                    queryConfig={queryConfig}
                                    setQueryConfig={setQueryConfig}
                                    visualConfig={visualConfig}
                                    setVisualConfig={setVisualConfig}
                                    validTypes={validTypes}
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

export default PairedCohortExpCorrelationSection;
