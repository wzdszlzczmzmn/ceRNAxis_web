import { useEffect, useState } from "react"
import { Box, Stack } from "@mui/system"
import {
    Button,
} from "antd"
import { Splitter } from "antd"
import {
    MenuUnfoldOutlined,
} from "@ant-design/icons"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import EmptyView from "@/components/common/status/EmptyView"
import VolcanoPlot from "@/components/features/visualization/components/VolcanoPlot"
import { useDatasetDegVolcano } from "@/components/features/database/hooks/datasetDetail/useDatasetDegVolcano"
import DatasetVolcanoControlPanel
    from "@/components/features/database/components/datasetDetail/DatasetVolcanoControlPanel"

const DEFAULT_VISUAL_CONFIG = {
    showLabels: true,
    labelTopN: 10,
    pointSize: 7,
    pointOpacity: 0.8,
    plotAspectRatio: 1.3,
}

const hasVolcanoData = data => {
    if (!data?.groups) return false

    return ["NotSig", "Down", "Up"].some(group => {
        return Array.isArray(data.groups[group]) && data.groups[group].length > 0
    })
}

const getGeneSearchOptions = data => {
    if (!data?.groups) return []

    const genes = ["NotSig", "Down", "Up"]
        .flatMap(group => data.groups[group] || [])
        .map(item => item.gene_name)
        .filter(Boolean)

    return Array.from(new Set(genes)).map(gene => ({
        label: gene,
        value: gene,
    }))
}

const DatasetVolcanoAnalysisSection = ({
    dataset,
    availableDegExpressionTypes,
    height = 620,
}) => {
    const [queryConfig, setQueryConfig] = useState({
        expressionType: null,
    })
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

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
        mutate,
    } = useDatasetDegVolcano({
        dataset,
        expressionType: queryConfig.expressionType,
    })

    const geneSearchOptions = getGeneSearchOptions(volcanoData)

    const renderPlotContent = () => {
        if (isLoading) {
            return <LoadingView containerSx={{ height: "100%" }}/>
        }

        if (isError) {
            return <ErrorView containerSx={{ height: "100%" }}/>
        }

        if (!hasVolcanoData(volcanoData)) {
            return (
                <EmptyView
                    bordered
                    description="No volcano plot data"
                    containerSx={{ height: "100%" }}
                />
            )
        }

        return (
            <VolcanoPlot
                data={volcanoData}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                height="100%"
                logfcCutoff={0}
                padjCutoff={0.20}
                showLabels={visualConfig.showLabels}
                labelTopN={visualConfig.labelTopN}
                pointSize={visualConfig.pointSize}
                pointOpacity={visualConfig.pointOpacity}
                plotAspectRatio={visualConfig.plotAspectRatio}
                highlightGene={searchGene.trim()}
                containerSx={{
                    minHeight: 0,
                }}
            />
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
                <Box component="h6" sx={{ fontSize: "36px", fontWeight: 700, m: 0 }}>
                    Expression Volcano Plot
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
                            <DatasetVolcanoControlPanel
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
                                    icon={<MenuUnfoldOutlined/>}
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

export default DatasetVolcanoAnalysisSection
