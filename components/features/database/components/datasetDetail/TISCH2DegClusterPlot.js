import { useEffect, useMemo, useRef } from "react"
import * as echarts from "echarts"
import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer"

const REGULATION_STYLE = {
    Not: {
        color: "lightgray",
        symbol: "circle",
        name: "Not",
    },
    Down: {
        color: "#1F77B4",
        symbol: "circle",
        name: "Down",
    },
    Up: {
        color: "#D62728",
        symbol: "triangle",
        name: "Up",
    },
}

const REGULATION_ORDER = ["Not", "Down", "Up"]

const roundUpOneDecimal = value => Math.ceil(value * 10) / 10

const getSafeNumber = (value, fallback = 0) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : fallback
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

const formatPvalue = value => {
    const number = Number(value)

    if (!Number.isFinite(number)) {
        return "-"
    }

    if (number < 0.001) {
        return number.toExponential(3)
    }

    return number.toFixed(4)
}

const formatClusterTooltip = point => {
    if (!point) return ""

    return `
        <div
            style="
                min-width:240px;
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
                ${point.gene}
            </div>

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                "
            >
                ${buildTooltipRow({
        label: "Cluster",
        value: point.cluster,
    })}

                ${buildTooltipRow({
        label: "Regulation",
        value: point.regulation,
    })}

                ${buildTooltipRow({
        label: "log2FC",
        value: getSafeNumber(point.log2FC).toFixed(4),
    })}
                ${buildTooltipRow({
        label: "Scaled log2FC",
        value: getSafeNumber(point.scaled_log2FC).toFixed(4),
    })}

                ${buildTooltipRow({
        label: "Adjusted p-value",
        value: formatPvalue(point.adjusted_p),
    })}

                ${buildTooltipRow({
        label: point.is_zero_adjusted_p
            ? "Plot Y (adjusted p = 0)"
            : "-log10(adj p)",

        value: getSafeNumber(
            point.neg_log10_adjusted_p
        ).toFixed(4),
    })}

                ${buildTooltipRow({
        label: "Percentage",
        value: `${getSafeNumber(point.percentage).toFixed(2)}%`,
    })}

                ${buildTooltipRow({
        label: "Malignancy",
        value: point.celltype_malignancy ?? "-",
    })}

                ${buildTooltipRow({
        label: "Major lineage",
        value: point.celltype_major_lineage ?? "-",
    })}

                ${buildTooltipRow({
        label: "Minor lineage",
        value: point.celltype_minor_lineage ?? "-",
    })}
            </table>
        </div>
    `
}

const getPlotGrid = ({
    containerWidth,
    containerHeight,
    top = 90,
    bottom = 120,
    left = 110,
    right = 40,
}) => {
    if (containerWidth <= 0 || containerHeight <= 0) {
        return { top, bottom, left, right }
    }

    return {
        top,
        bottom,
        left,
        right,
    }
}

const getPointData = ({
    points,
    regulation,
    pointSize,
    pointOpacity,
    showLabels,
    highlightGene,
}) => {
    const normalizedHighlightGene = String(highlightGene || "")
        .trim()
        .toLowerCase()

    return points
        .filter(point => point.regulation === regulation)
        .map(point => {
            const isHighlighted =
                normalizedHighlightGene &&
                String(point.gene).toLowerCase() === normalizedHighlightGene

            return {
                value: [
                    getSafeNumber(point.plot_x),
                    getSafeNumber(point.plot_y),
                ],
                raw: point,
                symbolSize: isHighlighted
                    ? pointSize + 5
                    : pointSize,
                itemStyle: {
                    opacity: isHighlighted ? 1 : pointOpacity,
                    borderColor: isHighlighted ? "#000" : undefined,
                    borderWidth: isHighlighted ? 2 : 0,
                },
                label: {
                    show: false,
                },
            }
        })
}

const getHighlightData = ({
    points,
    highlightGene,
}) => {
    const normalizedHighlightGene = String(highlightGene || "")
        .trim()
        .toLowerCase()

    if (!normalizedHighlightGene) return []

    return points
        .filter(point =>
            String(point.gene).toLowerCase() === normalizedHighlightGene
        )
        .map(point => ({
            value: [
                getSafeNumber(point.plot_x),
                getSafeNumber(point.plot_y),
            ],
            raw: point,
        }))
}

const getLabelData = ({
    points,
    showLabels,
    labelTopN,
}) => {
    if (!showLabels || !labelTopN || labelTopN <= 0) {
        return []
    }

    const significantPoints = points.filter(point =>
        point.regulation === "Up" || point.regulation === "Down"
    )

    const clusterMap = new Map()

    significantPoints.forEach(point => {
        const cluster = String(point.cluster)

        if (!clusterMap.has(cluster)) {
            clusterMap.set(cluster, [])
        }

        clusterMap.get(cluster).push(point)
    })

    const labelPoints = []

    clusterMap.forEach(clusterPoints => {
        const topPoints = [...clusterPoints]
            .sort((a, b) => {
                const ap = getSafeNumber(a.adjusted_p, Number.POSITIVE_INFINITY)
                const bp = getSafeNumber(b.adjusted_p, Number.POSITIVE_INFINITY)

                if (ap !== bp) {
                    return ap - bp
                }

                return Math.abs(getSafeNumber(b.log2FC)) -
                    Math.abs(getSafeNumber(a.log2FC))
            })
            .slice(0, labelTopN)

        labelPoints.push(...topPoints)
    })

    return labelPoints.map(point => ({
        value: [
            getSafeNumber(point.plot_x),
            getSafeNumber(point.plot_y),
        ],
        raw: point,
        label: {
            show: true,
            formatter: point.gene,
            position: "top",
            distance: 5,
            fontSize: 10,
            color: "#262626",
            backgroundColor: "rgba(255,255,255,0.85)",
            padding: [2, 4],
            borderRadius: 3,
        },
    }))
}

const getClusterLabelData = clusters => {
    return clusters.map(cluster => ({
        value: [
            getSafeNumber(cluster.panel_center),
            0,
        ],
        raw: cluster,
        symbolSize: 0,
        label: {
            show: true,
            formatter: `Cluster ${cluster.cluster}`,
            position: "bottom",
            distance: 14,
            fontSize: 12,
            color: "#333",
        },
    }))
}

const getPanelMarkLines = clusters => {
    const lines = []

    clusters.forEach((cluster, index) => {
        lines.push({
            xAxis: Number(cluster.zero_x),
            lineStyle: {
                type: "dashed",
                color: "#444",
                width: 1,
            },
            label: {
                show: false,
            },
        })

        lines.push({
            xAxis: Number(cluster.panel_start),
            lineStyle: {
                type: "dashed",
                color: "#BDBDBD",
                width: 1,
            },
            label: {
                show: false,
            },
        })

        if (index === clusters.length - 1) {
            lines.push({
                xAxis: Number(cluster.panel_end),
                lineStyle: {
                    type: "dashed",
                    color: "#BDBDBD",
                    width: 1,
                },
                label: {
                    show: false,
                },
            })
        }
    })

    return lines
}

const getChartOption = ({
    data,
    titlePrimary,
    titleSecondary,
    pointSize,
    pointOpacity,
    showLabels,
    labelTopN,
    showPanelLines,
    showThresholdLine,
    highlightGene,
    width,
    height,
}) => {
    const points = data?.points ?? []
    const clusters = data?.clusters ?? []
    const thresholds = data?.thresholds ?? {}
    const zeroPvaluePlot = data?.zero_pvalue_plot ?? {}

    const zeroPvalueCount = getSafeNumber(
        zeroPvaluePlot.count,
        0
    )

    const zeroPvaluePlotY = Number(
        zeroPvaluePlot.neg_log10_plot_y
    )

    const hasZeroPvalueLine =
        zeroPvalueCount > 0 &&
        Number.isFinite(zeroPvaluePlotY)

    const computedTitle = [
        titlePrimary,
        titleSecondary,
        "TISCH2 DEG Cluster Plot",
    ]
        .filter(Boolean)
        .join(" ")

    const xMax = clusters.length
        ? Math.max(...clusters.map(item => getSafeNumber(item.panel_end)))
        : 1

    const maxPointY = points.length
        ? Math.max(
            ...points.map(
                item => getSafeNumber(item.plot_y)
            )
        )
        : 1

    const thresholdY = getSafeNumber(
        thresholds.neg_log10_padj_cutoff,
        1.30103,
    )

    const yMax = roundUpOneDecimal(
        Math.max(
            maxPointY,
            thresholdY,
            hasZeroPvalueLine
                ? zeroPvaluePlotY
                : 0
        ) + 0.2
    )

    const grid = getPlotGrid({
        containerWidth: width,
        containerHeight: height,
    })

    const panelMarkLines = showPanelLines
        ? getPanelMarkLines(clusters)
        : []

    const thresholdLine = showThresholdLine
        ? [
            {
                yAxis: thresholdY,
                lineStyle: {
                    color: "#D62728",
                    width: 1.5,
                },
                label: {
                    formatter: `Adjusted p = ${thresholds.padj_cutoff ?? 0.05}`,
                    position: "insideEndTop",
                    color: "#D62728",
                },
            },
        ]
        : []

    const zeroPvalueLine = hasZeroPvalueLine
        ? [
            {
                yAxis: zeroPvaluePlotY,

                lineStyle: {
                    color: "#000",
                    type: "dashed",
                    width: 1.5,
                },

                label: {
                    show: false,
                },
            },
        ]
        : []

    const markLineData = [
        ...panelMarkLines,
        ...thresholdLine,
        ...zeroPvalueLine,
    ]

    const highlightData = getHighlightData({
        points,
        highlightGene,
    })

    const DEFAULT_VISIBLE_CLUSTER_COUNT = 5

    const visibleClusterCount = Math.min(
        DEFAULT_VISIBLE_CLUSTER_COUNT,
        clusters.length
    )

    const defaultZoomStartValue = clusters.length
        ? clusters[0].panel_start
        : 0

    const defaultZoomEndValue = visibleClusterCount > 0
        ? clusters[visibleClusterCount - 1].panel_end
        : xMax

    const labelData = getLabelData({
        points,
        showLabels,
        labelTopN,
    })

    return {
        animation: false,
        animationDuration: 0,
        animationDurationUpdate: 0,
        animationEasing: "linear",
        animationEasingUpdate: "linear",

        title: {
            text: computedTitle,
            left: "center",
            top: 8,
        },

        tooltip: {
            trigger: "item",
            formatter: params => {
                return formatClusterTooltip(params.data?.raw)
            },
        },

        legend: {
            top: 42,
            left: "center",
            data: REGULATION_ORDER.map(regulation => {
                const count = points.filter(
                    item => item.regulation === regulation
                ).length

                return `${regulation} (${count})`
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
                    name: computedTitle || "tisch2_deg_cluster_plot",
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
            min: 0,
            max: xMax,
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLine: {
                onZero: false,
                lineStyle: {
                    color: "#999",
                    width: 1,
                },
            },
        },

        yAxis: {
            type: "value",
            min: -0.1,
            max: yMax,
            name: "-log10 Adjusted p-value",
            nameLocation: "middle",
            nameGap: 50,
            axisLine: {
                show: true,
                onZero: false,
                lineStyle: {
                    color: "#999",
                    width: 1,
                },
            },
            splitLine: {
                show: false,
            },
        },

        dataZoom: [
            {
                type: "slider",
                xAxisIndex: 0,
                filterMode: "none",
                startValue: defaultZoomStartValue,
                endValue: defaultZoomEndValue,
                bottom: 24,
                height: 24,
            },
            {
                type: "inside",
                xAxisIndex: 0,
                filterMode: "none",
                startValue: defaultZoomStartValue,
                endValue: defaultZoomEndValue,
            },
        ],

        graphic: hasZeroPvalueLine
            ? [
                {
                    type: "text",
                    left: 4,
                    top: echarts.number.linearMap(
                        zeroPvaluePlotY,
                        [-0.1, yMax],
                        [
                            height - grid.bottom,
                            grid.top,
                        ],
                        true
                    ) - 8,
                    style: {
                        text:
                            `Adjusted p = 0 (${zeroPvalueCount})`,
                        fill: "#262626",
                        fontSize: 11,
                        textAlign: "left",
                    },
                    silent: true,
                },
            ]
            : [],

        series: [
            ...REGULATION_ORDER.map((regulation, index) => {
                const style = REGULATION_STYLE[regulation]
                const regulationPoints = points.filter(
                    point => point.regulation === regulation
                )

                return {
                    name: `${regulation} (${regulationPoints.length})`,
                    type: "scatter",
                    symbol: style.symbol,
                    symbolSize: pointSize,
                    large: regulationPoints.length > 3000,
                    largeThreshold: 3000,
                    progressive: 3000,
                    itemStyle: {
                        color: style.color,
                        opacity: regulation === "Not"
                            ? Math.min(pointOpacity, 0.55)
                            : pointOpacity,
                        borderWidth: 0,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            opacity: 1,
                        },
                    },
                    data: getPointData({
                        points,
                        regulation,
                        pointSize,
                        pointOpacity,
                        showLabels,
                        highlightGene,
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
                                data: markLineData,
                            }
                            : undefined,
                }
            }),

            {
                name: "Cluster Labels",
                type: "scatter",
                data: getClusterLabelData(clusters),
                tooltip: {
                    show: false,
                },
                silent: true,
                itemStyle: {
                    color: "transparent",
                },
                emphasis: {
                    disabled: true,
                },
            },

            {
                name: "Gene Labels",
                type: "scatter",
                symbolSize: 0,
                z: 15,
                silent: true,
                itemStyle: {
                    color: "transparent",
                },
                emphasis: {
                    disabled: true,
                },
                tooltip: {
                    show: false,
                },
                data: labelData,
            },

            ...(highlightData.length > 0
                ? [
                    {
                        name: "Highlighted Gene",
                        type: "scatter",
                        symbol: "circle",
                        symbolSize: pointSize + 7,
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
                            formatter: params => params.data.raw.gene,
                            position: "top",
                            distance: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#262626",
                            backgroundColor: "rgba(255,255,255,0.85)",
                            padding: [2, 4],
                            borderRadius: 3,
                        },
                        data: highlightData,
                    },
                ]
                : []),
        ],
    }
}

const TISCH2DegClusterPlotCore = ({
    data,
    titlePrimary = null,
    titleSecondary = null,
    showLabels = true,
    labelTopN = 3,
    pointSize = 6,
    pointOpacity = 0.75,
    showPanelLines = true,
    showThresholdLine = true,
    highlightGene = "",
}) => {
    const chartRef = useRef(null)
    const chartInstanceRef = useRef(null)
    const { width, height } = useContainerSize()

    const option = useMemo(() => {
        if (!data?.points || width <= 0 || height <= 0) return null

        return getChartOption({
            data,
            titlePrimary,
            titleSecondary,
            pointSize,
            pointOpacity,
            showLabels,
            labelTopN,
            showPanelLines,
            showThresholdLine,
            highlightGene,
            width,
            height,
        })
    }, [
        data,
        titlePrimary,
        titleSecondary,
        pointSize,
        pointOpacity,
        showLabels,
        labelTopN,
        showPanelLines,
        showThresholdLine,
        highlightGene,
        width,
        height,
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

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    )
}

const TISCH2DegClusterPlot = ({
    data,
    titlePrimary = null,
    titleSecondary = null,
    showLabels = true,
    labelTopN = 3,
    pointSize = 6,
    pointOpacity = 0.75,
    showPanelLines = true,
    showThresholdLine = true,
    height = 560,
    highlightGene = "",
    containerSx,
}) => {
    return (
        <ResponsiveVisualizationContainer
            containerSx={{
                width: "100%",
                height,
                minHeight: 460,
                ...containerSx,
            }}
        >
            <TISCH2DegClusterPlotCore
                data={data}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                showLabels={showLabels}
                labelTopN={labelTopN}
                pointSize={pointSize}
                pointOpacity={pointOpacity}
                showPanelLines={showPanelLines}
                showThresholdLine={showThresholdLine}
                highlightGene={highlightGene}
            />
        </ResponsiveVisualizationContainer>
    )
}

export default TISCH2DegClusterPlot
