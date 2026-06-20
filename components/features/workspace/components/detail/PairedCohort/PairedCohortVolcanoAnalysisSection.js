"use client"

import { useEffect, useMemo, useState } from "react"
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
import { usePairedCohortDegVolcano } from "@/components/features/workspace/hooks/usePairedCohortDegVolcano"
import PairedCohortVolcanoControlPanel
    from "@/components/features/workspace/components/detail/PairedCohort/PairedCohortVolcanoControlPanel"

const DEFAULT_VISUAL_CONFIG = {
    showLabels: true,
    labelTopN: 10,
    pointSize: 7,
    pointOpacity: 0.8,
    plotAspectRatio: 1.3,
}

const DEFAULT_CUTOFFS = {
    mRNA: {
        logfc_cutoff: 1,
        padj_cutoff: 0.05,
    },
    miRNA: {
        logfc_cutoff: 1,
        padj_cutoff: 0.05,
    },
    lncRNA: {
        logfc_cutoff: 1,
        padj_cutoff: 0.05,
    },
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

const getCurrentCutoffs = ({
    task,
    rnaType,
}) => {
    const taskCutoffs = task?.data?.cutoffs ?? {}

    return (
        taskCutoffs[rnaType] ||
        DEFAULT_CUTOFFS[rnaType] ||
        {
            logfc_cutoff: undefined,
            padj_cutoff: undefined,
        }
    )
}

const PairedCohortVolcanoAnalysisSection = ({
    task,
    height = 620,
}) => {
    const taskUUID = task?.data?.uuid

    const [queryConfig, setQueryConfig] = useState({
        rnaType: "mRNA",
    })
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG)
    const [searchGene, setSearchGene] = useState("")
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false)

    useEffect(() => {
        setSearchGene("")
    }, [queryConfig.rnaType])

    const currentCutoffs = useMemo(() => {
        return getCurrentCutoffs({
            task,
            rnaType: queryConfig.rnaType,
        })
    }, [task, queryConfig.rnaType])

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = usePairedCohortDegVolcano({
        taskUUID,
        rnaType: queryConfig.rnaType,
    })

    const geneSearchOptions = getGeneSearchOptions(volcanoData)

    const renderPlotContent = () => {
        if (!taskUUID) {
            return (
                <EmptyView
                    bordered
                    description="Missing task UUID"
                    containerSx={{ height: "100%" }}
                />
            )
        }

        if (isLoading) {
            return <LoadingView containerSx={{ height: "100%" }} />
        }

        if (isError) {
            return <ErrorView containerSx={{ height: "100%" }} />
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
                logfcCutoff={currentCutoffs?.logfc_cutoff}
                padjCutoff={currentCutoffs?.padj_cutoff}
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
                <Box
                    component="h6"
                    sx={{
                        fontSize: "36px",
                        fontWeight: 700,
                        m: 0,
                    }}
                >
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
                            <PairedCohortVolcanoControlPanel
                                queryConfig={queryConfig}
                                setQueryConfig={setQueryConfig}
                                visualConfig={visualConfig}
                                setVisualConfig={setVisualConfig}
                                geneSearchOptions={geneSearchOptions}
                                searchGene={searchGene}
                                setSearchGene={setSearchGene}
                                currentCutoffs={currentCutoffs}
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

export default PairedCohortVolcanoAnalysisSection
