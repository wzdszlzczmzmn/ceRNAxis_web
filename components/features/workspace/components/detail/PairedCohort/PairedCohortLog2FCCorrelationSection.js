"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Splitter } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import Log2FCCorrelationPlot from "@/components/features/visualization/components/Log2FCCorrelationPlot";
import { usePairedCohortLog2FCCorrelation }
    from "@/components/features/workspace/hooks/usePairedCohortLog2FCCorrelation";
import PairedCohortLog2FCCorrelationControlPanel
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortLog2FCCorrelationControlPanel"

const DEFAULT_VISUAL_CONFIG = {
    pointSize: 9,
    pointOpacitySame: 0.45,
    pointOpacityAnti: 0.85,
};

const hasCorrelationData = data => {
    return Array.isArray(data?.points) && data.points.length > 0;
};

const getSearchOptions = data => {
    if (!Array.isArray(data?.points)) return [];

    const values = data.points
        .flatMap(item => [item.miRNA, item.ceRNA])
        .filter(Boolean);

    return Array.from(new Set(values)).map(value => ({
        label: value,
        value,
    }));
};

const getAvailableInteractionTypes = task => {
    const supportedTypes =
        task?.data?.available_correlation_types ||
        task?.data?.available_interaction_types ||
        null;

    if (Array.isArray(supportedTypes) && supportedTypes.length > 0) {
        return supportedTypes;
    }

    return [
        "miRNA-mRNA",
        "miRNA-lncRNA",
        "miRNA-circRNA",
    ];
};

const getInitialInteractionType = task => {
    const availableTypes = getAvailableInteractionTypes(task);

    if (availableTypes.includes("miRNA-mRNA")) {
        return "miRNA-mRNA";
    }

    return availableTypes[0] || "miRNA-mRNA";
};

const PairedCohortLog2FCCorrelationSection = ({
    task,
    height = 620,
}) => {
    const taskUUID = task?.data?.uuid;

    const availableInteractionTypes = useMemo(() => {
        return getAvailableInteractionTypes(task);
    }, [task]);

    const [queryConfig, setQueryConfig] = useState({
        interactionType: getInitialInteractionType(task),
    });

    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false);

    useEffect(() => {
        setQueryConfig(prev => {
            if (availableInteractionTypes.includes(prev.interactionType)) {
                return prev;
            }

            return {
                ...prev,
                interactionType:
                    availableInteractionTypes[0] || "miRNA-mRNA",
            };
        });
    }, [availableInteractionTypes]);

    useEffect(() => {
        setSearchKeyword("");
    }, [queryConfig.interactionType]);

    const {
        correlationData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = usePairedCohortLog2FCCorrelation({
        taskUUID,
        interactionType: queryConfig.interactionType,
    });

    const searchOptions = getSearchOptions(correlationData);

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

        if (isLoading) {
            return <LoadingView containerSx={{ height: "100%" }} />;
        }

        if (isError) {
            return <ErrorView containerSx={{ height: "100%" }} />;
        }

        if (!hasCorrelationData(correlationData)) {
            return (
                <EmptyView
                    bordered
                    description="No log2FC correlation data"
                    containerSx={{ height: "100%" }}
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
                pointOpacitySame={visualConfig.pointOpacitySame}
                pointOpacityAnti={visualConfig.pointOpacityAnti}
                highlightKeyword={searchKeyword.trim()}
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
                    Log2FC Correlation Plot
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
                            <PairedCohortLog2FCCorrelationControlPanel
                                queryConfig={queryConfig}
                                setQueryConfig={setQueryConfig}
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

export default PairedCohortLog2FCCorrelationSection;
