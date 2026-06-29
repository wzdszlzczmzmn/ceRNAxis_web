"use client";

import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer";

const POSITIVE_COLOR = "#4C78A8";
const NEGATIVE_COLOR = "#D65F5F";
const FOCUS_COLOR = "#111827";
const DEFAULT_DATA_ZOOM_VISIBLE_COUNT = 30;
const FOCUS_VISIBLE_COUNT = 30;

const getSafeNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const isValidPoint = item => {
    return (
        item &&
        item.term &&
        Number.isFinite(Number(item.nes)) &&
        Number.isFinite(Number(item.neg_log10_fdr_qval))
    );
};

const formatNumber = (value, digits = 4) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    return number.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
};

const formatScientificOrFixed = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    if (number > 0 && number < 0.001) {
        return number.toExponential(3);
    }

    return number.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
};

const buildTooltipRow = ({ label, value }) => {
    return `
        <tr>
            <td
                style="
                    font-weight:600;
                    color:#595959;
                    padding:3px 10px 3px 0;
                    white-space:nowrap;
                    vertical-align:top;
                "
            >
                ${label}
            </td>

            <td
                style="
                    color:#262626;
                    padding:3px 0;
                    max-width:360px;
                    white-space:normal;
                    word-break:break-word;
                "
            >
                ${value}
            </td>
        </tr>
    `;
};

const formatTooltip = item => {
    if (!item) return "";

    return `
        <div
            style="
                min-width:260px;
                max-width:520px;
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
                    max-width:480px;
                    white-space:normal;
                    word-break:break-word;
                "
            >
                ${item.term || "--"}
            </div>

            <table style="width:100%; border-collapse:collapse;">
                ${buildTooltipRow({
        label: "NES",
        value: formatNumber(item.nes, 4),
    })}

                ${buildTooltipRow({
        label: "FDR q-val",
        value: formatScientificOrFixed(item.fdr_qval),
    })}

                ${buildTooltipRow({
        label: "-log10(FDR q-val)",
        value: formatNumber(item.neg_log10_fdr_qval, 4),
    })}

                ${buildTooltipRow({
        label: "ES",
        value: formatNumber(item.es, 4),
    })}

                ${buildTooltipRow({
        label: "NOM p-val",
        value: formatScientificOrFixed(item.nom_pval),
    })}

                ${buildTooltipRow({
        label: "FWER p-val",
        value: formatScientificOrFixed(item.fwer_pval),
    })}

                ${buildTooltipRow({
        label: "Tag %",
        value: item.tag_percent || "--",
    })}

                ${buildTooltipRow({
        label: "Gene %",
        value: item.gene_percent || "--",
    })}
            </table>
        </div>
    `;
};

const roundUpToStep = (value, step = 0.5) => {
    return Math.ceil(value / step) * step;
};

const getSymbolSizeBuilder = ({
    minSize = 10,
    maxSize = 36,
    minBubbleValue,
    maxBubbleValue,
}) => {
    if (
        !Number.isFinite(minBubbleValue) ||
        !Number.isFinite(maxBubbleValue) ||
        maxBubbleValue <= minBubbleValue
    ) {
        return () => (minSize + maxSize) / 2;
    }

    return value => {
        const normalized = (
            (value - minBubbleValue) /
            (maxBubbleValue - minBubbleValue)
        );

        return minSize + normalized * (maxSize - minSize);
    };
};

const getPlotGrid = ({
    containerWidth,
    containerHeight,
    left = 300,
    right = 70,
    top = 90,
    bottom = 80,
}) => {
    if (containerWidth <= 0 || containerHeight <= 0) {
        return { left, right, top, bottom };
    }

    return {
        left,
        right,
        top,
        bottom,
        containLabel: false,
    };
};

const sortPathwayPoints = (points, rankingMethod) => {
    const sortedPoints = [...points];

    if (rankingMethod === "nes_desc") {
        return sortedPoints.sort((a, b) => b.nes - a.nes);
    }

    if (rankingMethod === "nes_asc") {
        return sortedPoints.sort((a, b) => a.nes - b.nes);
    }

    if (rankingMethod === "fdr") {
        return sortedPoints.sort(
            (a, b) => b.neg_log10_fdr_qval - a.neg_log10_fdr_qval
        );
    }

    return sortedPoints.sort(
        (a, b) => Math.abs(b.nes) - Math.abs(a.nes)
    );
};

const getDataZoomWindow = ({
    selectedPoints,
    focusedIndex = -1,
}) => {
    if (!selectedPoints.length) {
        return {
            startIndex: 0,
            endIndex: 0,
        };
    }

    const visibleCount = Math.max(
        1,
        Math.min(
            focusedIndex >= 0
                ? FOCUS_VISIBLE_COUNT
                : DEFAULT_DATA_ZOOM_VISIBLE_COUNT,
            selectedPoints.length
        )
    );

    if (focusedIndex >= 0) {
        const halfWindow = Math.floor(visibleCount / 2);

        let startIndex = focusedIndex - halfWindow;
        let endIndex = startIndex + visibleCount - 1;

        if (startIndex < 0) {
            startIndex = 0;
            endIndex = visibleCount - 1;
        }

        if (endIndex >= selectedPoints.length) {
            endIndex = selectedPoints.length - 1;
            startIndex = Math.max(0, endIndex - visibleCount + 1);
        }

        return {
            startIndex,
            endIndex,
        };
    }

    return {
        startIndex: Math.max(0, selectedPoints.length - visibleCount),
        endIndex: selectedPoints.length - 1,
    };
};

const getDataZoomConfig = ({
    enabled,
    selectedPoints,
    focusedIndex = -1,
    grid,
}) => {
    if (!enabled || selectedPoints.length === 0) {
        return [];
    }

    const { startIndex, endIndex } = getDataZoomWindow({
        selectedPoints,
        focusedIndex,
    });

    return [
        {
            type: "slider",
            yAxisIndex: 0,
            left: 8,
            top: grid.top,
            bottom: grid.bottom,
            width: 24,
            startValue: startIndex,
            endValue: endIndex,
            filterMode: "empty",
            brushSelect: false,
        },
        {
            type: "inside",
            yAxisIndex: 0,
            startValue: startIndex,
            endValue: endIndex,
            zoomOnMouseWheel: true,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
            filterMode: "empty",
        },
    ];
};

const DEGPathwayBubblePlotCore = ({
    data,
    title = "DEG Pathway Enrichment",
    subtitle = null,
    topN = 30,
    showAll = false,
    rankingMethod = "abs_nes",
    focusKeyword = "",
    minBubbleSize = 10,
    maxBubbleSize = 36,
}) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const { width, height } = useContainerSize();

    const option = useMemo(() => {
        if (!Array.isArray(data?.results) || width <= 0 || height <= 0) {
            return null;
        }

        const allPoints = data.results
            .filter(isValidPoint)
            .map(item => ({
                ...item,
                term: String(item.term),
                nes: getSafeNumber(item.nes),
                fdr_qval: getSafeNumber(item.fdr_qval, null),
                neg_log10_fdr_qval: getSafeNumber(
                    item.neg_log10_fdr_qval
                ),
                es: getSafeNumber(item.es, null),
                nom_pval: getSafeNumber(item.nom_pval, null),
                fwer_pval: getSafeNumber(item.fwer_pval, null),
            }));

        if (!allPoints.length) {
            return null;
        }

        const rankedPoints = sortPathwayPoints(
            allPoints,
            rankingMethod
        );

        const displayPoints = showAll
            ? rankedPoints
            : rankedPoints.slice(
                0,
                Math.max(1, Number(topN) || 30)
            );

        const selectedPoints = [...displayPoints].reverse();

        const normalizedFocusKeyword = String(focusKeyword || "")
            .trim()
            .toLowerCase();

        const focusedTerms = new Set();

        if (showAll && normalizedFocusKeyword) {
            selectedPoints.forEach(item => {
                const term = String(item.term || "").trim().toLowerCase();

                if (term === normalizedFocusKeyword) {
                    focusedTerms.add(item.term);
                }
            });
        }

        const focusedIndex = showAll && focusedTerms.size > 0
            ? selectedPoints.findIndex(item => focusedTerms.has(item.term))
            : -1;

        const yLabels = selectedPoints.map(item => item.term);

        const maxAbsNES = Math.max(
            ...selectedPoints.map(item => Math.abs(item.nes)),
            1
        );

        const xLimit = roundUpToStep(maxAbsNES * 1.15, 0.5);

        const bubbleValues = selectedPoints.map(
            item => item.neg_log10_fdr_qval
        );

        const minBubbleValue = Math.min(...bubbleValues);
        const maxBubbleValue = Math.max(...bubbleValues);

        const getSymbolSize = getSymbolSizeBuilder({
            minSize: minBubbleSize,
            maxSize: maxBubbleSize,
            minBubbleValue,
            maxBubbleValue,
        });

        const grid = getPlotGrid({
            containerWidth: width,
            containerHeight: height,
        });

        const positivePoints = selectedPoints.filter(item => item.nes >= 0);
        const negativePoints = selectedPoints.filter(item => item.nes < 0);

        const buildSeriesData = points => {
            return points.map(item => {
                const focused = focusedTerms.has(item.term);
                const baseSymbolSize = getSymbolSize(item.neg_log10_fdr_qval);

                return {
                    value: [
                        item.nes,
                        item.term,
                        item.neg_log10_fdr_qval,
                    ],
                    symbolSize: baseSymbolSize,
                    raw: item,
                    itemStyle: focused
                        ? {
                            borderColor: FOCUS_COLOR,
                            borderWidth: 3,
                            opacity: 1,
                        }
                        : undefined,
                    label: {
                        show: focused,
                        formatter: item.term,
                        position: "right",
                        distance: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        color: FOCUS_COLOR,
                        backgroundColor: "rgba(255,255,255,0.85)",
                        padding: [2, 4],
                        borderRadius: 3,
                    },
                };
            });
        };

        const computedTitle = [title, subtitle]
            .filter(Boolean)
            .join("\n");

        const dataZoom = getDataZoomConfig({
            enabled: showAll,
            selectedPoints,
            focusedIndex,
            grid,
        });

        return {
            title: {
                text: computedTitle,
                left: "center",
                top: 8,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 600,
                },
            },

            tooltip: {
                trigger: "item",
                formatter: params => formatTooltip(params.data?.raw),
            },

            legend: {
                top: 48,
                left: "center",
                data: [
                    "NES > 0",
                    "NES < 0",
                ],
            },

            toolbox: {
                show: true,
                right: 24,
                top: 12,
                itemSize: 16,
                feature: {
                    saveAsImage: {
                        show: true,
                        type: "png",
                        name: title || "deg_pathway_bubble_plot",
                        title: "Download",
                        pixelRatio: 2,
                        backgroundColor: "#ffffff",
                        excludeComponents: ["toolbox"],
                    },
                },
            },

            grid,

            dataZoom,

            xAxis: {
                type: "value",
                min: -xLimit,
                max: xLimit,
                name: "NES",
                nameLocation: "middle",
                nameGap: 42,
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#222",
                        width: 1.5,
                    },
                },
                axisTick: {
                    show: true,
                },
                axisLabel: {
                    formatter: value =>
                        Number(value).toFixed(1).replace(/\.0$/, ""),
                },
                splitLine: {
                    show: false,
                },
            },

            yAxis: {
                type: "category",
                data: yLabels,
                name: "Pathway",
                nameLocation: "middle",
                nameGap: 210,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#222",
                        width: 1.5,
                    },
                },
                axisTick: {
                    show: true,
                },
                axisLabel: {
                    width: 230,
                    overflow: "truncate",
                    fontSize: 12,
                },
            },

            graphic: [
                {
                    type: "text",
                    right: showAll ? 34 : 30,
                    bottom: 28,
                    style: {
                        text: "Bubble size = -log10(FDR q-val)",
                        fill: "#262626",
                        font: "bold 13px sans-serif",
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
                    markLine: {
                        silent: true,
                        symbol: "none",
                        lineStyle: {
                            color: "#000",
                            width: 1.5,
                        },
                        label: {
                            show: false,
                        },
                        data: [
                            {
                                xAxis: 0,
                            },
                        ],
                    },
                },
                {
                    name: "NES > 0",
                    type: "scatter",
                    data: buildSeriesData(positivePoints),
                    itemStyle: {
                        color: POSITIVE_COLOR,
                        opacity: 0.82,
                        borderColor: "#4b5563",
                        borderWidth: 1,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            opacity: 1,
                            borderWidth: 1.5,
                        },
                    },
                },
                {
                    name: "NES < 0",
                    type: "scatter",
                    data: buildSeriesData(negativePoints),
                    itemStyle: {
                        color: NEGATIVE_COLOR,
                        opacity: 0.82,
                        borderColor: "#4b5563",
                        borderWidth: 1,
                    },
                    emphasis: {
                        scale: true,
                        itemStyle: {
                            opacity: 1,
                            borderWidth: 1.5,
                        },
                    },
                },
            ],
        };
    }, [
        data,
        title,
        subtitle,
        topN,
        showAll,
        rankingMethod,
        minBubbleSize,
        maxBubbleSize,
        width,
        height,
        focusKeyword,
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

const DEGPathwayBubblePlot = ({
    data,
    title = "DEG Pathway Enrichment",
    subtitle = null,
    topN = 30,
    showAll = false,
    rankingMethod = "abs_nes",
    focusKeyword = "",
    minBubbleSize = 10,
    maxBubbleSize = 36,
    height = 620,
    containerSx,
}) => {
    return (
        <ResponsiveVisualizationContainer
            containerSx={{
                width: "100%",
                height,
                minHeight: 480,
                ...containerSx,
            }}
        >
            <DEGPathwayBubblePlotCore
                data={data}
                title={title}
                subtitle={subtitle}
                topN={topN}
                showAll={showAll}
                rankingMethod={rankingMethod}
                focusKeyword={focusKeyword}
                minBubbleSize={minBubbleSize}
                maxBubbleSize={maxBubbleSize}
            />
        </ResponsiveVisualizationContainer>
    );
};

export default DEGPathwayBubblePlot;
