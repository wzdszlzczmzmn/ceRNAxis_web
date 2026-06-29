"use client"

import { useEffect, useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Button, Splitter } from "antd"
import { MenuUnfoldOutlined } from "@ant-design/icons"

import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import EmptyView from "@/components/common/status/EmptyView"

import { useTISCH2DegClusterPlot } from "@/components/features/database/hooks/datasetDetail/useTISCH2DegClusterPlot"
import TISCH2DegClusterPlot from "@/components/features/database/components/datasetDetail/TISCH2DegClusterPlot"
import TISCH2DegClusterPlotControlPanel
    from "@/components/features/database/components/datasetDetail/TISCH2DegClusterPlotControlPanel"

const DEFAULT_QUERY_CONFIG = {
    expressionType: null,
}

const DEFAULT_VISUAL_CONFIG = {
    showLabels: true,
    labelTopN: 3,
    pointSize: 6,
    pointOpacity: 0.75,
    showPanelLines: true,
    showThresholdLine: true,
}

const hasClusterPlotData = data => {
    return Array.isArray(data?.points) && data.points.length > 0
}

const getGeneSearchOptions = data => {
    if (!Array.isArray(data?.points)) return []

    const genes = data.points
        .map(item => item.gene)
        .filter(Boolean)

    return Array.from(new Set(genes)).map(gene => ({
        label: gene,
        value: gene,
    }))
}

const TISCH2DegClusterPlotSection = ({
    dataset,
    availableDegExpressionTypes = [],
    height = 680,
}) => {
    const [queryConfig, setQueryConfig] = useState(DEFAULT_QUERY_CONFIG)
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG)
    const [searchGene, setSearchGene] = useState("")
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false)

    useEffect(() => {
        if (!availableDegExpressionTypes?.length) {
            setQueryConfig(prev => ({
                ...prev,
                expressionType: null,
            }))
            return
        }

        setQueryConfig(prev => {
            if (availableDegExpressionTypes.includes(prev.expressionType)) {
                return prev
            }

            return {
                ...prev,
                expressionType: availableDegExpressionTypes[0],
            }
        })
    }, [availableDegExpressionTypes])

    useEffect(() => {
        setSearchGene("")
    }, [queryConfig.expressionType])

    const {
        plotData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isValidating,
        isError,
    } = useTISCH2DegClusterPlot({
        dataset,
        expressionType: queryConfig.expressionType,
    })

    const geneSearchOptions = useMemo(() => {
        return getGeneSearchOptions(plotData)
    }, [plotData])

    const renderPlotContent = () => {
        if (!dataset) {
            return (
                <EmptyView
                    bordered
                    description="Missing dataset"
                    containerSx={{ height: "100%" }}
                />
            )
        }

        if (!queryConfig.expressionType) {
            return (
                <EmptyView
                    bordered
                    description="No available TISCH2 DEG expression type"
                    containerSx={{ height: "100%" }}
                />
            )
        }

        if (isLoading && !plotData) {
            return <LoadingView containerSx={{ height: "100%" }} />
        }

        if (isError && !plotData) {
            return <ErrorView containerSx={{ height: "100%" }} />
        }

        if (!hasClusterPlotData(plotData)) {
            return (
                <EmptyView
                    bordered
                    description="No TISCH2 DEG cluster plot data"
                    containerSx={{ height: "100%" }}
                />
            )
        }

        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    opacity: isValidating ? 0.65 : 1,
                    transition: "opacity 0.2s ease",
                }}
            >
                <TISCH2DegClusterPlot
                    data={plotData}
                    titlePrimary={titlePrimary}
                    titleSecondary={titleSecondary}
                    height="100%"
                    pointSize={visualConfig.pointSize}
                    pointOpacity={visualConfig.pointOpacity}
                    showLabels={visualConfig.showLabels}
                    labelTopN={visualConfig.labelTopN}
                    showPanelLines={visualConfig.showPanelLines}
                    showThresholdLine={visualConfig.showThresholdLine}
                    highlightGene={searchGene.trim()}
                    containerSx={{
                        minHeight: 0,
                    }}
                />
            </Box>
        )
    }

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
                    TISCH2 DEG Cluster Plot
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
                            min={280}
                            max={520}
                        >
                            <TISCH2DegClusterPlotControlPanel
                                queryConfig={queryConfig}
                                setQueryConfig={setQueryConfig}
                                visualConfig={visualConfig}
                                setVisualConfig={setVisualConfig}
                                availableDegExpressionTypes={availableDegExpressionTypes}
                                geneSearchOptions={geneSearchOptions}
                                searchGene={searchGene}
                                setSearchGene={setSearchGene}
                                onCollapse={() => setIsControlPanelCollapsed(true)}
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
                                    onClick={() => setIsControlPanelCollapsed(false)}
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
    )
}

export default TISCH2DegClusterPlotSection
