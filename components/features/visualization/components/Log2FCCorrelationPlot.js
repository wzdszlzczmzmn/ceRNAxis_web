"use client";

import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer";

const ANTI_COLOR = "#D62728";
const SAME_COLOR = "lightgray";

const getSafeNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const roundUpToStep = (value, step = 0.5) => {
    return Math.ceil(value / step) * step;
};

const getSymmetricAxisLimit = ({
    values,
    minLimit = 1,
    paddingRatio = 1.15,
    step = 0.5,
}) => {
    const rawMaxAbs = Math.max(
        ...values
            .map(value => Math.abs(Number(value)))
            .filter(Number.isFinite),
        minLimit
    );

    return roundUpToStep(rawMaxAbs * paddingRatio, step);
};

const getPlotGrid = ({
    containerWidth,
    containerHeight,
    top = 90,
    bottom = 70,
    left = 80,
    right = 40,
}) => {
    const plotAspectRatio = 1;

    const availableWidth = containerWidth - left - right;
    const availableHeight = containerHeight - top - bottom;

    if (availableWidth <= 0 || availableHeight <= 0) {
        return { top, bottom, left, right };
    }

    const currentRatio = availableWidth / availableHeight;

    if (currentRatio > plotAspectRatio) {
        const targetWidth = availableHeight * plotAspectRatio;
        const extraWidth = availableWidth - targetWidth;

        return {
            top,
            bottom,
            left: left + extraWidth / 2,
            right: right + extraWidth / 2,
        };
    }

    const targetHeight = availableWidth / plotAspectRatio;
    const extraHeight = availableHeight - targetHeight;

    return {
        top: top + extraHeight / 2,
        bottom: bottom + extraHeight / 2,
        left,
        right,
    };
};

const buildTooltipRow = ({ label, value }) => {
    return `
        <tr>
            <td
                style="
                    font-weight:600;
                    color:#595959;
                    padding:3px 8px 3px 0;
                    white-space:nowrap;
                    vertical-align:top;
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
    `;
};

const formatNumber = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "--";

    return number.toFixed(4);
};

const formatCorrelationTooltip = item => {
    if (!item) return "";

    return `
        <div
            style="
                min-width:220px;
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
                ${item.miRNA || "--"} ↔ ${item.ceRNA || "--"}
            </div>

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                "
            >
                ${buildTooltipRow({
        label: "miRNA",
        value: item.miRNA || "--",
    })}

                ${buildTooltipRow({
        label: "ceRNA",
        value: item.ceRNA || "--",
    })}

                ${buildTooltipRow({
        label: "Type",
        value: item.type || "--",
    })}

                ${buildTooltipRow({
        label: "Species",
        value: item.species || "--",
    })}

                ${buildTooltipRow({
        label: "Database",
        value: item.database || "--",
    })}

                ${buildTooltipRow({
        label: "ceRNA log2FC",
        value: formatNumber(item.ceRNA_log2FC),
    })}

                ${buildTooltipRow({
        label: "miRNA log2FC",
        value: formatNumber(item.miRNA_log2FC),
    })}

                ${buildTooltipRow({
        label: "Opposite direction",
        value: item.anti_correlation ? "Yes" : "No",
    })}
            </table>
        </div>
    `;
};

const getDefaultPlotMeta = interactionType => {
    const metaMap = {
        "miRNA-mRNA": {
            xLabel: "mRNA log2FC",
            yLabel: "miRNA log2FC",
            title: "miRNA vs mRNA",
        },
        "miRNA-lncRNA": {
            xLabel: "lncRNA log2FC",
            yLabel: "miRNA log2FC",
            title: "miRNA vs lncRNA",
        }
    };

    return (
        metaMap[interactionType] || {
            xLabel: "ceRNA log2FC",
            yLabel: "miRNA log2FC",
            title: "Log2FC Correlation Plot",
        }
    );
};

const hasCorrelationData = data => {
    return Array.isArray(data?.points) && data.points.length > 0;
};

const Log2FCCorrelationPlotCore = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    xLabel = null,
    yLabel = null,
    pointSize = 9,
    pointOpacitySame = 0.45,
    pointOpacityAnti = 0.85,
    highlightKeyword = "",
}) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const { width, height } = useContainerSize();

    const option = useMemo(() => {
        if (!hasCorrelationData(data) || width <= 0 || height <= 0) {
            return null;
        }

        const interactionType = data?.type ?? null;
        const defaultMeta = getDefaultPlotMeta(interactionType);

        const computedTitle =
            title ??
            [titlePrimary, defaultMeta.title]
                .filter(Boolean)
                .join(" ");

        const computedXLabel = xLabel || defaultMeta.xLabel;
        const computedYLabel = yLabel || defaultMeta.yLabel;

        const allPoints = (data.points || [])
            .map(item => {
                const x = getSafeNumber(item.ceRNA_log2FC, NaN);
                const y = getSafeNumber(item.miRNA_log2FC, NaN);

                return {
                    ...item,
                    ceRNA_log2FC: x,
                    miRNA_log2FC: y,
                    anti_correlation: Boolean(item.anti_correlation),
                };
            })
            .filter(
                item =>
                    Number.isFinite(item.ceRNA_log2FC) &&
                    Number.isFinite(item.miRNA_log2FC)
            );

        if (!allPoints.length) return null;

        const antiPoints = allPoints.filter(item => item.anti_correlation);
        const samePoints = allPoints.filter(item => !item.anti_correlation);

        const normalizedHighlightKeyword = highlightKeyword
            .trim()
            .toLowerCase();

        const highlightPoints = normalizedHighlightKeyword
            ? allPoints.filter(item => {
                const miRNA = String(item.miRNA || "").toLowerCase();
                const ceRNA = String(item.ceRNA || "").toLowerCase();

                return (
                    miRNA === normalizedHighlightKeyword ||
                    ceRNA === normalizedHighlightKeyword
                );
            })
            : [];

        const xLimit = getSymmetricAxisLimit({
            values: allPoints.map(item => item.ceRNA_log2FC),
            minLimit: 1,
            paddingRatio: 1.15,
            step: 0.5,
        });

        const yLimit = getSymmetricAxisLimit({
            values: allPoints.map(item => item.miRNA_log2FC),
            minLimit: 1,
            paddingRatio: 1.15,
            step: 0.5,
        });

        const xMin = -xLimit;
        const xMax = xLimit;
        const yMin = -yLimit;
        const yMax = yLimit;

        const grid = getPlotGrid({
            containerWidth: width,
            containerHeight: height,
        });

        const antiCount = data?.summary?.anti_count ?? antiPoints.length;
        const sameCount = data?.summary?.same_count ?? samePoints.length;

        return {
            title: {
                text: computedTitle,
                left: "center",
                top: 8,
            },

            tooltip: {
                trigger: "item",
                formatter: params => formatCorrelationTooltip(params.data?.raw),
            },

            legend: {
                top: 42,
                left: "center",
                data: [
                    `Same direction (${sameCount})`,
                    `Opposite direction (${antiCount})`,
                ],
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
                        name: computedTitle || "log2fc_correlation_plot",
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
                min: xMin,
                max: xMax,
                name: computedXLabel,
                nameLocation: "middle",
                nameGap: 40,
                axisLabel: {
                    formatter: value => Number(value).toFixed(1).replace(/\.0$/, ""),
                },
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#000",
                        width: 2,
                    },
                },
                axisTick: {
                    show: true,
                },
            },

            yAxis: {
                type: "value",
                min: yMin,
                max: yMax,
                name: computedYLabel,
                nameLocation: "middle",
                nameGap: 55,
                axisLabel: {
                    formatter: value => Number(value).toFixed(1).replace(/\.0$/, ""),
                },
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#000",
                        width: 2,
                    },
                },
                axisTick: {
                    show: true,
                },
            },

            graphic: [
                {
                    type: "text",
                    left: grid.left + 8,
                    top: grid.top + 8,
                    style: {
                        text: "log2FC product < 0",
                        fill: ANTI_COLOR,
                        font: "bold 12px sans-serif",
                    },
                    silent: true,
                    z: 10,
                },
            ],

            series: [
                {
                    name: "Reference",
                    type: "scatter",
                    data: [],
                    silent: true,
                    tooltip: {
                        show: false,
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: ANTI_COLOR,
                            opacity: 0.08,
                        },
                        data: [
                            [
                                { coord: [xMin, 0] },
                                { coord: [0, yMax] },
                            ],
                            [
                                { coord: [0, yMin] },
                                { coord: [xMax, 0] },
                            ],
                        ],
                    },
                    markLine: {
                        silent: true,
                        symbol: "none",
                        lineStyle: {
                            color: "#000",
                            type: "dashed",
                            width: 1.5,
                            opacity: 0.7,
                        },
                        label: {
                            show: false,
                        },
                        data: [
                            { xAxis: 0 },
                            { yAxis: 0 },
                        ],
                    },
                },

                {
                    name: `Same direction (${sameCount})`,
                    type: "scatter",
                    symbolSize: pointSize,
                    large: samePoints.length > 3000,
                    largeThreshold: 3000,
                    itemStyle: {
                        color: SAME_COLOR,
                        opacity: pointOpacitySame,
                        borderWidth: 0,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            opacity: 0.9,
                        },
                    },
                    data: samePoints.map(item => ({
                        value: [item.ceRNA_log2FC, item.miRNA_log2FC],
                        raw: item,
                    })),
                },

                {
                    name: `Opposite direction (${antiCount})`,
                    type: "scatter",
                    symbolSize: pointSize,
                    itemStyle: {
                        color: ANTI_COLOR,
                        opacity: pointOpacityAnti,
                        borderColor: "#ffffff",
                        borderWidth: 0.8,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            opacity: 1,
                        },
                    },
                    data: antiPoints.map(item => ({
                        value: [item.ceRNA_log2FC, item.miRNA_log2FC],
                        raw: item,
                    })),
                },

                ...(highlightPoints.length > 0
                    ? [
                        {
                            name: "Highlighted",
                            type: "scatter",
                            symbol: "circle",
                            symbolSize: Math.max(pointSize + 6, 14),
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
                                formatter: params => {
                                    const raw = params.data.raw;
                                    return raw.ceRNA || raw.miRNA || "";
                                },
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
                                value: [
                                    item.ceRNA_log2FC,
                                    item.miRNA_log2FC,
                                ],
                                raw: item,
                            })),
                        },
                    ]
                    : []),
            ],
        };
    }, [
        data,
        title,
        titlePrimary,
        titleSecondary,
        xLabel,
        yLabel,
        pointSize,
        pointOpacitySame,
        pointOpacityAnti,
        highlightKeyword,
        width,
        height,
    ]);

    useEffect(() => {
        if (!chartRef.current) return;

        chartInstanceRef.current = echarts.init(chartRef.current);

        return () => {
            chartInstanceRef.current?.dispose();
            chartInstanceRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!chartInstanceRef.current || !option) return;

        chartInstanceRef.current.setOption(option, true);
    }, [option]);

    useEffect(() => {
        if (!chartInstanceRef.current || width === 0 || height === 0) return;

        chartInstanceRef.current.resize();
    }, [width, height]);

    return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

const Log2FCCorrelationPlot = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    xLabel = null,
    yLabel = null,
    pointSize = 9,
    pointOpacitySame = 0.45,
    pointOpacityAnti = 0.85,
    highlightKeyword = "",
    height = 520,
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
            <Log2FCCorrelationPlotCore
                data={data}
                title={title}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                xLabel={xLabel}
                yLabel={yLabel}
                pointSize={pointSize}
                pointOpacitySame={pointOpacitySame}
                pointOpacityAnti={pointOpacityAnti}
                highlightKeyword={highlightKeyword}
            />
        </ResponsiveVisualizationContainer>
    );
};

export default Log2FCCorrelationPlot;
