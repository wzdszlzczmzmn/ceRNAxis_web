import { useEffect, useMemo, useRef } from "react"
import * as echarts from "echarts"
import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer"

const COLOR_MAP = {
    Up: "#D62728",
    Down: "#1F77B4",
    NotSig: "lightgray",
}

const GROUP_ORDER = ["NotSig", "Down", "Up"]

const roundUpOneDecimal = value => Math.ceil(value * 10) / 10

const getSafeNumber = (value, fallback = 0) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : fallback
}

const getPlotGrid = ({
    containerWidth,
    containerHeight,
    plotAspectRatio = 1.3,
    top = 90,
    bottom = 60,
    left = 70,
    right = 40,
}) => {
    const availableWidth = containerWidth - left - right
    const availableHeight = containerHeight - top - bottom

    if (
        availableWidth <= 0 ||
        availableHeight <= 0 ||
        !Number.isFinite(plotAspectRatio) ||
        plotAspectRatio <= 0
    ) {
        return { top, bottom, left, right }
    }

    const currentRatio = availableWidth / availableHeight

    if (currentRatio > plotAspectRatio) {
        const targetWidth = availableHeight * plotAspectRatio
        const extraWidth = availableWidth - targetWidth

        return {
            top,
            bottom,
            left: left + extraWidth / 2,
            right: right + extraWidth / 2,
        }
    }

    const targetHeight = availableWidth / plotAspectRatio
    const extraHeight = availableHeight - targetHeight

    return {
        top: top + extraHeight / 2,
        bottom: bottom + extraHeight / 2,
        left,
        right,
    }
}

const buildTooltipRow = ({ label, value }) => {
    return `
        <tr>
            <td
                style="
                    font-weight:600;
                    color:#595959;
                    padding:3px 8px 3px 0;
                    white-space:nowrap;
                "
            >
                ${label}
            </td>

            <td
                style="
                    text-align:right;
                    color:#262626;
                    padding:3px 0;
                    white-space:nowrap;
                "
            >
                ${value}
            </td>
        </tr>
    `
}

const formatPadj = value => {
    const number = Number(value)

    if (number < 0.001) {
        return number.toExponential(3)
    }

    return number.toFixed(4)
}

const formatVolcanoTooltip = item => {
    if (!item) return ""

    return `
        <div
            style="
                min-width:180px;
                font-size:13px;
                line-height:1.45;
            "
        >
            <div
                style="
                    font-weight:700;
                    font-size:15px;
                    color:#262626;
                    margin-bottom:8px;
                "
            >
                ${item.gene_name}
            </div>

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                "
            >
                ${buildTooltipRow({
                    label: "Regulation",
                    value: item.regulation,
                })}

                ${buildTooltipRow({
                    label: "log2FC",
                    value: Number(item.log2FC).toFixed(4),
                })}

                ${buildTooltipRow({
                    label: "padj",
                    value: formatPadj(item.padj),
                })}

                ${buildTooltipRow({
                    label: "-log10(padj)",
                    value: Number(item.neg_log10_padj).toFixed(4),
                })}
            </table>
        </div>
    `
}

const VolcanoPlotCore = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    logfcCutoff = 1,
    padjCutoff = 0.05,
    showLabels = true,
    labelTopN = 10,
    pointSize = 7,
    pointOpacity = 0.8,
    plotAspectRatio = 1.3,
    highlightGene = "",
}) => {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)
    const { width, height } = useContainerSize()

    const option = useMemo(() => {
        if (!data?.groups || width <= 0 || height <= 0) return null

        const computedTitle =
            title ??
            [titlePrimary, titleSecondary, "Volcano Plot"]
                .filter(Boolean)
                .join(" ")

        const safeLogfcCutoff = Math.abs(getSafeNumber(logfcCutoff, 1))

        const rawPadjCutoff = getSafeNumber(padjCutoff, 0.05)
        const safePadjCutoff = rawPadjCutoff > 0 ? rawPadjCutoff : 0.05

        const thresholdY = -Math.log10(safePadjCutoff)

        const allPoints = GROUP_ORDER.flatMap(group =>
            (data.groups[group] || []).map(item => ({
                ...item,
                regulation: group,
                log2FC: getSafeNumber(item.log2FC),
                padj: getSafeNumber(item.padj),
                neg_log10_padj: getSafeNumber(item.neg_log10_padj),
            }))
        )

        const labelGenes = showLabels
            ? allPoints
                .filter(item => item.regulation !== "NotSig")
                .sort((a, b) => a.padj - b.padj)
                .slice(0, labelTopN)
            : []

        const labelGeneSet = new Set(labelGenes.map(item => item.gene_name))

        const maxAbsX = Math.max(
            safeLogfcCutoff,
            ...allPoints.map(item => Math.abs(item.log2FC))
        )

        const xLimit = roundUpOneDecimal(maxAbsX + 0.1)

        const maxY = Math.max(
            thresholdY,
            ...allPoints.map(item => item.neg_log10_padj)
        )

        const yMax = roundUpOneDecimal(maxY + 0.1)

        const grid = getPlotGrid({
            containerWidth: width,
            containerHeight: height,
            plotAspectRatio,
        })

        const normalizedHighlightGene = highlightGene.trim().toLowerCase()

        const highlightPoints = normalizedHighlightGene
            ? allPoints.filter(item =>
                String(item.gene_name).toLowerCase() === normalizedHighlightGene
            )
            : []

        return {
            title: {
                text: computedTitle,
                left: "center",
                top: 8,
            },

            tooltip: {
                trigger: "item",
                formatter: params => {
                    return formatVolcanoTooltip(params.data?.raw)
                },
            },

            legend: {
                top: 42,
                left: "center",
                data: GROUP_ORDER.map(group => {
                    const count = data.groups[group]?.length || 0
                    return `${group} (${count})`
                }),
            },

            toolbox: {
                show: true,
                right: 20,
                top: 12,
                itemSize: 16,
                feature: {
                    saveAsImage: {
                        show: true,
                        type: "png",
                        name: computedTitle || "volcano_plot",
                        title: "Download",
                        pixelRatio: 2,
                        backgroundColor: "#ffffff",
                        excludeComponents: ["toolbox"],
                    },
                },
            },

            grid,

            xAxis: {
                type: "value",
                position: "bottom",
                min: -xLimit,
                max: xLimit,
                name: "log2 Fold Change",
                nameLocation: "middle",
                nameGap: 35,
                splitLine: {
                    show: false,
                },
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: "#999",
                        width: 1,
                    },
                }
            },

            yAxis: {
                type: "value",
                position: "left",
                offset: 0,
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#999",
                        width: 1,
                    },
                },
                min: -0.1,
                max: yMax,
                name: "-log10 adjusted p-value",
                nameLocation: "middle",
                nameGap: 50,
                splitLine: {
                    show: false,
                },
            },

            series: [
                ...GROUP_ORDER.map((group, index) => {
                    const groupData = data.groups[group] || []

                    return {
                        name: `${group} (${groupData.length})`,
                        type: "scatter",
                        symbolSize: pointSize,
                        large: group === "NotSig" && groupData.length > 3000,
                        largeThreshold: 3000,
                        itemStyle: {
                            color: COLOR_MAP[group],
                            opacity: pointOpacity,
                            borderWidth: 0,
                        },
                        emphasis: {
                            scale: true,
                            itemStyle: {
                                opacity: 1,
                            },
                        },
                        data: groupData.map(item => {
                            const log2FC = getSafeNumber(item.log2FC)
                            const padj = getSafeNumber(item.padj)
                            const negLog10Padj = getSafeNumber(item.neg_log10_padj)

                            return {
                                value: [log2FC, negLog10Padj],
                                raw: {
                                    ...item,
                                    regulation: group,
                                    log2FC,
                                    padj,
                                    neg_log10_padj: negLog10Padj,
                                },
                                label: {
                                    show:
                                        showLabels &&
                                        labelGeneSet.has(item.gene_name),
                                    formatter: item.gene_name,
                                    position: "top",
                                    fontSize: 10,
                                },
                            }
                        }),

                        markLine:
                            index === 0
                                ? {
                                    silent: true,
                                    symbol: "none",
                                    lineStyle: {
                                        color: "#000",
                                        type: "dashed",
                                        width: 1,
                                    },
                                    label: {
                                        show: false,
                                    },
                                    data: [
                                        { xAxis: -safeLogfcCutoff },
                                        { xAxis: safeLogfcCutoff },
                                        { yAxis: thresholdY },
                                    ],
                                }
                                : undefined,
                    }
                }),
                ...(highlightPoints.length > 0
                    ? [
                        {
                            name: "Highlighted Gene",
                            type: "scatter",
                            symbol: "circle",
                            symbolSize: pointSize + 6,
                            z: 20,
                            silent: false,
                            itemStyle: {
                                color: "#8B5CF6",
                                borderColor: "#6D28D9",
                                borderWidth: 2,
                                opacity: 1,
                            },
                            emphasis: {
                                disabled: true,
                            },
                            label: {
                                show: true,
                                formatter: params => params.data.raw.gene_name,
                                position: "top",
                                distance: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#262626",
                                backgroundColor: "rgba(255,255,255,0.85)",
                                padding: [2, 4],
                                borderRadius: 3,
                            },
                            data: highlightPoints.map(item => ({
                                value: [item.log2FC, item.neg_log10_padj],
                                raw: item,
                            })),
                        },
                    ]
                    : [])
            ]
        }
    }, [
        data,
        title,
        titlePrimary,
        titleSecondary,
        logfcCutoff,
        padjCutoff,
        showLabels,
        labelTopN,
        pointSize,
        pointOpacity,
        plotAspectRatio,
        width,
        height,
        highlightGene,
    ])

    useEffect(() => {
        if (!chartRef.current) return

        chartInstanceRef.current = echarts.init(chartRef.current)

        return () => {
            chartInstanceRef.current?.dispose()
            chartInstanceRef.current = null
        }
    }, [])

    useEffect(() => {
        if (!chartInstanceRef.current || !option) return

        chartInstanceRef.current.setOption(option, true)
    }, [option])

    useEffect(() => {
        if (!chartInstanceRef.current || width === 0 || height === 0) return

        chartInstanceRef.current.resize()
    }, [width, height])

    return <div ref={chartRef} style={{ width: "100%", height: "100%" }}/>
}

const VolcanoPlot = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    logfcCutoff = 1,
    padjCutoff = 0.05,
    showLabels = true,
    labelTopN = 10,
    pointSize = 7,
    pointOpacity = 0.8,
    plotAspectRatio = 1.3,
    height = 520,
    highlightGene = "",
    containerSx,
}) => {
    return (
        <ResponsiveVisualizationContainer
            containerSx={{
                width: "100%",
                height,
                minHeight: 420,
                ...containerSx,
            }}
        >
            <VolcanoPlotCore
                data={data}
                title={title}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                logfcCutoff={logfcCutoff}
                padjCutoff={padjCutoff}
                showLabels={showLabels}
                labelTopN={labelTopN}
                pointSize={pointSize}
                pointOpacity={pointOpacity}
                plotAspectRatio={plotAspectRatio}
                highlightGene={highlightGene}
            />
        </ResponsiveVisualizationContainer>
    )
}

export default VolcanoPlot
