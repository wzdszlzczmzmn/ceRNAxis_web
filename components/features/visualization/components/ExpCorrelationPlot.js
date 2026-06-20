"use client";

import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer";

const POINT_COLOR = "#1677ff";
const LINE_COLOR = "#D62728";

const getSafeNumber = (value, fallback = NaN) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const formatNumber = (value, digits = 4) => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "--";

    return number.toFixed(digits);
};

const formatPValue = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) return "--";

    if (number < 0.001) {
        return number.toExponential(3);
    }

    return number.toFixed(4);
};

const roundDownToStep = (value, step = 0.5) => {
    return Math.floor(value / step) * step;
};

const roundUpToStep = (value, step = 0.5) => {
    return Math.ceil(value / step) * step;
};

const formatAxisLabel = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) return value;

    return number.toFixed(1).replace(/\.0$/, "");
};

const getPlotGrid = ({
    containerWidth,
    containerHeight,
    top = 150,
    bottom = 70,
    left = 80,
    right = 40,
    plotAspectRatio = 1.3,
}) => {
    const availableWidth = containerWidth - left - right;
    const availableHeight = containerHeight - top - bottom;

    if (
        availableWidth <= 0 ||
        availableHeight <= 0 ||
        !Number.isFinite(plotAspectRatio) ||
        plotAspectRatio <= 0
    ) {
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

const formatTooltip = ({
    item,
    gene1,
    gene2,
}) => {
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
                ${item.sample_id || "--"}
            </div>

            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                "
            >
                ${buildTooltipRow({
        label: gene1 || "Gene 1",
        value: formatNumber(item.gene1_expr),
    })}

                ${buildTooltipRow({
        label: gene2 || "Gene 2",
        value: formatNumber(item.gene2_expr),
    })}
            </table>
        </div>
    `;
};

const hasPlotData = data => {
    return Array.isArray(data?.points) && data.points.length > 0;
};

const getRegressionLineData = ({
    slope,
    intercept,
    xMin,
    xMax,
}) => {
    const safeSlope = Number(slope);
    const safeIntercept = Number(intercept);

    if (!Number.isFinite(safeSlope) || !Number.isFinite(safeIntercept)) {
        return [];
    }

    return [
        [xMin, safeSlope * xMin + safeIntercept],
        [xMax, safeSlope * xMax + safeIntercept],
    ];
};

const ExpCorrelationPlotCore = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    pointSize = 8,
    pointOpacity = 0.75,
    showRegressionLine = true,
    plotAspectRatio = 1.3,
}) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const { width, height } = useContainerSize();

    const option = useMemo(() => {
        if (!hasPlotData(data) || width <= 0 || height <= 0) {
            return null;
        }

        const gene1 = data?.gene1 ?? "Gene 1";
        const gene2 = data?.gene2 ?? "Gene 2";

        const correlation = data?.correlation ?? {};
        const regression = data?.regression ?? {};

        const points = (data.points || [])
            .map(item => {
                const x = getSafeNumber(item.gene1_expr);
                const y = getSafeNumber(item.gene2_expr);

                return {
                    ...item,
                    gene1_expr: x,
                    gene2_expr: y,
                };
            })
            .filter(
                item =>
                    Number.isFinite(item.gene1_expr) &&
                    Number.isFinite(item.gene2_expr)
            );

        if (!points.length) return null;

        const rawXMin = Math.min(...points.map(item => item.gene1_expr));
        const rawXMax = Math.max(...points.map(item => item.gene1_expr));
        const rawYMin = Math.min(...points.map(item => item.gene2_expr));
        const rawYMax = Math.max(...points.map(item => item.gene2_expr));

        const rawXRange = rawXMax - rawXMin;
        const rawYRange = rawYMax - rawYMin;

        const xMargin = rawXRange > 0 ? rawXRange * 0.12 : 0.5;
        const yMargin = rawYRange > 0 ? rawYRange * 0.12 : 0.5;

        const xMin = roundDownToStep(rawXMin - xMargin, 0.5);
        const xMax = roundUpToStep(rawXMax + xMargin, 0.5);
        const yMin = roundDownToStep(rawYMin - yMargin, 0.5);
        const yMax = roundUpToStep(rawYMax + yMargin, 0.5);

        const regressionLineData = getRegressionLineData({
            slope: regression.slope,
            intercept: regression.intercept,
            xMin,
            xMax,
        });

        const computedTitle =
            title ??
            `${gene2} vs ${gene1}`;

        const statText = [
            `{metric|Pearson} r = ${formatNumber(correlation.pearson_r, 3)}, p = ${formatPValue(correlation.pearson_p)}`,
            `{metric|Spearman} r = ${formatNumber(correlation.spearman_r, 3)}, p = ${formatPValue(correlation.spearman_p)}`,
            `{metric|Kendall τ} = ${formatNumber(correlation.kendall_tau, 3)}, p = ${formatPValue(correlation.kendall_p)}`,
        ].join("\n");

        const grid = getPlotGrid({
            containerWidth: width,
            containerHeight: height,
            plotAspectRatio,
        });

        return {
            title: [
                {
                    text: computedTitle,
                    left: "center",
                    top: 8,
                    textStyle: {
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#262626",
                    },
                },
                {
                    text: statText,
                    left: "center",
                    top: 40,
                    textAlign: "left",
                    textStyle: {
                        fontSize: 12,
                        lineHeight: 20,
                        color: "#595959",
                        rich: {
                            metric: {
                                fontWeight: 700,
                                color: "#262626",
                            },
                        },
                    },
                },
            ],

            tooltip: {
                trigger: "item",
                formatter: params => {
                    return formatTooltip({
                        item: params.data?.raw,
                        gene1,
                        gene2,
                    });
                },
            },

            legend: {
                show: true,
                top: 108,
                left: "center",
                data: [
                    `Samples (${points.length})`,
                    "Linear fit",
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
                        name: computedTitle || "expression_correlation_plot",
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
                name: gene1,
                nameLocation: "middle",
                nameGap: 42,
                axisLabel: {
                    formatter: formatAxisLabel,
                },
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#000",
                        width: 1.5,
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
                name: gene2,
                nameLocation: "middle",
                nameGap: 55,
                axisLabel: {
                    formatter: formatAxisLabel,
                },
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#000",
                        width: 1.5,
                    },
                },
                axisTick: {
                    show: true,
                },
            },

            series: [
                {
                    name: `Samples (${points.length})`,
                    type: "scatter",
                    symbolSize: pointSize,
                    itemStyle: {
                        color: POINT_COLOR,
                        opacity: pointOpacity,
                        borderColor: "#000",
                        borderWidth: 0.4,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            opacity: 1,
                        },
                    },
                    data: points.map(item => ({
                        value: [item.gene1_expr, item.gene2_expr],
                        raw: item,
                    })),
                },

                ...(showRegressionLine && regressionLineData.length > 0
                    ? [
                        {
                            name: "Linear fit",
                            type: "line",
                            showSymbol: false,
                            symbol: "none",
                            lineStyle: {
                                color: LINE_COLOR,
                                width: 2,
                            },
                            emphasis: {
                                disabled: true,
                            },
                            tooltip: {
                                show: false,
                            },
                            data: regressionLineData,
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
        pointSize,
        pointOpacity,
        showRegressionLine,
        plotAspectRatio,
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

const ExpCorrelationPlot = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    pointSize = 8,
    pointOpacity = 0.75,
    showRegressionLine = true,
    plotAspectRatio = 1.3,
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
            <ExpCorrelationPlotCore
                data={data}
                title={title}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                pointSize={pointSize}
                pointOpacity={pointOpacity}
                showRegressionLine={showRegressionLine}
                plotAspectRatio={plotAspectRatio}
            />
        </ResponsiveVisualizationContainer>
    );
};

export default ExpCorrelationPlot;
