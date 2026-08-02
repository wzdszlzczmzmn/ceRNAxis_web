"use client";

import {
    useEffect,
    useMemo,
    useRef,
} from "react";
import * as echarts from "echarts";

import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer";

const DEFAULT_VISIBLE_COUNT = 30;
const FOCUS_VISIBLE_COUNT = 30;

const BAR_COLOR = "#4C78A8";
const FOCUS_COLOR = "#D62728";

const getSafeNumber = (
    value,
    fallback = null
) => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};

const formatNumber = (
    value,
    digits = 4
) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    if (
        Math.abs(number) >= 10000 ||
        (
            Math.abs(number) > 0 &&
            Math.abs(number) < 0.001
        )
    ) {
        return number.toExponential(3);
    }

    return number
        .toFixed(digits)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
};

const formatScientificOrFixed = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    if (
        number > 0 &&
        number < 0.001
    ) {
        return number.toExponential(3);
    }

    return number
        .toFixed(4)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
};

const escapeHtml = value => {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
};

const buildTooltipRow = ({
    label,
    value,
}) => {
    return `
        <tr>
            <td
                style="
                    font-weight:600;
                    color:#595959;
                    padding:3px 12px 3px 0;
                    white-space:nowrap;
                    vertical-align:top;
                "
            >
                ${escapeHtml(label)}
            </td>

            <td
                style="
                    color:#262626;
                    padding:3px 0;
                    max-width:420px;
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
    if (!item) {
        return "";
    }

    const genes = Array.isArray(item.genes)
        ? item.genes
        : [];

    const genesText = genes.length > 0
        ? genes
            .map(escapeHtml)
            .join(", ")
        : "--";

    return `
        <div
            style="
                min-width:300px;
                max-width:560px;
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
                    max-width:520px;
                    white-space:normal;
                    word-break:break-word;
                "
            >
                ${escapeHtml(item.term || "--")}
            </div>

            <table style="width:100%; border-collapse:collapse;">
                ${buildTooltipRow({
        label: "Gene set",
        value: escapeHtml(item.gene_set || "--"),
    })}

                ${buildTooltipRow({
        label: "Combined Score",
        value: formatNumber(
            item.combined_score,
            4
        ),
    })}

                ${buildTooltipRow({
        label: "Odds Ratio",
        value: formatNumber(
            item.odds_ratio,
            4
        ),
    })}

                ${buildTooltipRow({
        label: "Adjusted p-value",
        value: formatScientificOrFixed(
            item.adjusted_p_value
        ),
    })}

                ${buildTooltipRow({
        label: "P-value",
        value: formatScientificOrFixed(
            item.p_value
        ),
    })}

                ${buildTooltipRow({
        label: "Overlap",
        value: escapeHtml(item.overlap || "--"),
    })}

                ${buildTooltipRow({
        label: "Gene count",
        value: escapeHtml(
            item.gene_count ?? "--"
        ),
    })}

                ${buildTooltipRow({
        label: "Genes",
        value: genesText,
    })}
            </table>
        </div>
    `;
};

const isValidItem = item => {
    return (
        item &&
        item.term &&
        Number.isFinite(
            Number(item.combined_score)
        )
    );
};

const sortItems = (
    items,
    rankingMethod
) => {
    const sortedItems = [...items];

    if (
        rankingMethod ===
        "combined_score_asc"
    ) {
        return sortedItems.sort(
            (a, b) =>
                a.combined_score -
                b.combined_score
        );
    }

    if (
        rankingMethod ===
        "adjusted_p_value"
    ) {
        return sortedItems.sort(
            (a, b) => {
                const aValue =
                    a.adjusted_p_value ?? Infinity;
                const bValue =
                    b.adjusted_p_value ?? Infinity;

                return aValue - bValue;
            }
        );
    }

    if (
        rankingMethod ===
        "odds_ratio_desc"
    ) {
        return sortedItems.sort(
            (a, b) =>
                (b.odds_ratio ?? 0) -
                (a.odds_ratio ?? 0)
        );
    }

    return sortedItems.sort(
        (a, b) =>
            b.combined_score -
            a.combined_score
    );
};

const getDataZoomWindow = ({
    items,
    focusedIndex,
}) => {
    const visibleCount = Math.min(
        focusedIndex >= 0
            ? FOCUS_VISIBLE_COUNT
            : DEFAULT_VISIBLE_COUNT,
        items.length
    );

    if (visibleCount <= 0) {
        return {
            startIndex: 0,
            endIndex: 0,
        };
    }

    if (focusedIndex >= 0) {
        const halfWindow =
            Math.floor(visibleCount / 2);

        let startIndex =
            focusedIndex - halfWindow;

        let endIndex =
            startIndex + visibleCount - 1;

        if (startIndex < 0) {
            startIndex = 0;
            endIndex =
                visibleCount - 1;
        }

        if (endIndex >= items.length) {
            endIndex =
                items.length - 1;

            startIndex = Math.max(
                0,
                endIndex - visibleCount + 1
            );
        }

        return {
            startIndex,
            endIndex,
        };
    }

    return {
        startIndex: Math.max(
            0,
            items.length - visibleCount
        ),
        endIndex: items.length - 1,
    };
};

const getDataZoomConfig = ({
    enabled,
    items,
    focusedIndex,
    grid,
}) => {
    if (
        !enabled ||
        items.length <= DEFAULT_VISIBLE_COUNT
    ) {
        return [];
    }

    const {
        startIndex,
        endIndex,
    } = getDataZoomWindow({
        items,
        focusedIndex,
    });

    return [
        {
            type: "slider",
            yAxisIndex: 0,
            left: 8,
            top: grid.top,
            bottom: grid.bottom,
            width: 22,
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
            filterMode: "empty",
            zoomOnMouseWheel: false,
            moveOnMouseWheel: true,
            moveOnMouseMove: true,
        },
    ];
};

const EnrichrHorizontalBarPlotCore = ({
    data,
    title = "Enrichr Pathway Enrichment",
    subtitle = null,
    topN = 30,
    showAll = false,
    rankingMethod = "combined_score_desc",
    focusKeyword = "",
    xAxisScale = "linear",
}) => {
    const chartRef = useRef(null);
    const chartInstanceRef =
        useRef(null);

    const {
        width,
        height,
    } = useContainerSize();

    const option = useMemo(() => {
        if (
            !Array.isArray(data?.results) ||
            width <= 0 ||
            height <= 0
        ) {
            return null;
        }

        const allItems = data.results
            .filter(isValidItem)
            .map(item => {
                const combinedScore = getSafeNumber(
                    item.combined_score,
                    0
                );

                const plotValue =
                    xAxisScale === "log10"
                        ? (
                            combinedScore > 0
                                ? Math.log10(combinedScore)
                                : null
                        )
                        : combinedScore;

                return {
                    ...item,
                    term: String(item.term),
                    combined_score: combinedScore,
                    plot_value: plotValue,
                    odds_ratio: getSafeNumber(
                        item.odds_ratio,
                        null
                    ),
                    adjusted_p_value: getSafeNumber(
                        item.adjusted_p_value,
                        null
                    ),
                    p_value: getSafeNumber(
                        item.p_value,
                        null
                    ),
                };
            })
            .filter(item =>
                Number.isFinite(item.plot_value)
            );

        if (!allItems.length) {
            return null;
        }

        const rankedItems = sortItems(
            allItems,
            rankingMethod
        );

        const limitedTopN = Math.min(
            30,
            Math.max(
                1,
                Number(topN) || 30
            )
        );

        const displayItems = showAll
            ? rankedItems
            : rankedItems.slice(
                0,
                limitedTopN
            );

        /*
         * 横向柱状图中，category 数组从下往上显示。
         * 反转后最高排名会出现在顶部。
         */
        const selectedItems = [
            ...displayItems,
        ].reverse();

        const normalizedFocusKeyword =
            String(focusKeyword || "")
                .trim()
                .toLowerCase();

        const focusedIndex =
            showAll &&
            normalizedFocusKeyword
                ? selectedItems.findIndex(
                    item =>
                        item.term
                            .trim()
                            .toLowerCase() ===
                        normalizedFocusKeyword
                )
                : -1;

        const yLabels =
            selectedItems.map(
                item => item.term
            );

        const grid = {
            left: 330,
            right: 90,
            top: 80,
            bottom: 70,
            containLabel: false,
        };

        const dataZoom =
            getDataZoomConfig({
                enabled: showAll,
                items: selectedItems,
                focusedIndex,
                grid,
            });

        const computedTitle = [
            title,
            subtitle,
        ]
            .filter(Boolean)
            .join("\n");

        return {
            animationDuration: 300,

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
                confine: true,
                formatter: params =>
                    formatTooltip(
                        params.data?.raw
                    ),
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
                        title: "Download",
                        name:
                            title ||
                            "enrichr_bar_plot",
                        pixelRatio: 2,
                        backgroundColor:
                            "#ffffff",
                        excludeComponents: [
                            "toolbox",
                            "dataZoom",
                        ],
                    },
                },
            },

            grid,

            dataZoom,

            xAxis: {
                type: "value",
                name:
                    xAxisScale === "log10"
                        ? "log10(Combined Score)"
                        : "Combined Score",
                nameLocation: "middle",
                nameGap: 44,
                min: 0,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#222",
                        width: 1.25,
                    },
                },
                axisTick: {
                    show: true,
                },
                axisLabel: {
                    formatter: value => {
                        const number =
                            Number(value);

                        if (
                            Math.abs(number) >=
                            10000
                        ) {
                            return number
                                .toExponential(1);
                        }

                        return number;
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: "#e5e7eb",
                    },
                },
            },

            yAxis: {
                type: "category",
                data: yLabels,
                name: "Term",
                nameLocation: "middle",
                nameGap: 270,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#222",
                        width: 1.25,
                    },
                },
                axisTick: {
                    show: true,
                },
                axisLabel: {
                    width: 280,
                    overflow: "truncate",
                    fontSize: 12,
                    formatter: value => value,
                },
            },

            series: [
                {
                    name: "Combined Score",
                    type: "bar",
                    barMaxWidth: 22,
                    data: selectedItems.map((item, index) => {
                        const focused = index === focusedIndex;

                        return {
                            value: item.plot_value,
                            raw: item,
                            itemStyle: {
                                color: focused
                                    ? FOCUS_COLOR
                                    : BAR_COLOR,
                                borderRadius: [0, 4, 4, 0],
                            },
                        };
                    }),
                    emphasis: {
                        focus: "self",
                        itemStyle: {
                            opacity: 0.85,
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
        focusKeyword,
        width,
        height,
        xAxisScale,
    ]);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        chartInstanceRef.current =
            echarts.init(chartRef.current);

        return () => {
            chartInstanceRef.current
                ?.dispose();

            chartInstanceRef.current =
                null;
        };
    }, []);

    useEffect(() => {
        if (
            !chartInstanceRef.current ||
            !option
        ) {
            return;
        }

        chartInstanceRef.current.setOption(
            option,
            true
        );
    }, [option]);

    useEffect(() => {
        if (
            !chartInstanceRef.current ||
            width === 0 ||
            height === 0
        ) {
            return;
        }

        chartInstanceRef.current.resize();
    }, [
        width,
        height,
    ]);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
};

const EnrichrHorizontalBarPlot = ({
    data,
    title = "Enrichr Pathway Enrichment",
    subtitle = null,
    topN = 30,
    showAll = false,
    rankingMethod = "combined_score_desc",
    focusKeyword = "",
    xAxisScale = "linear",
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
            <EnrichrHorizontalBarPlotCore
                data={data}
                title={title}
                subtitle={subtitle}
                topN={topN}
                showAll={showAll}
                rankingMethod={rankingMethod}
                focusKeyword={focusKeyword}
                xAxisScale={xAxisScale}
            />
        </ResponsiveVisualizationContainer>
    );
};

export default EnrichrHorizontalBarPlot;
