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

const POSITIVE_COLOR = "#D65F5F";
const NEGATIVE_COLOR = "#4C78A8";
const POINT_SIZE = 18;

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

    return number
        .toFixed(digits)
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

const formatTooltip = point => {
    if (!point) {
        return "";
    }

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
                    white-space:normal;
                    word-break:break-word;
                "
            >
                ${escapeHtml(point.label)}
            </div>

            <table style="width:100%; border-collapse:collapse;">
                ${buildTooltipRow({
        label: "Component",
        value: escapeHtml(point.shortLabel),
    })}

                ${buildTooltipRow({
        label: "Value",
        value: formatNumber(point.value),
    })}

                ${buildTooltipRow({
        label: "Weight",
        value: formatNumber(point.weight),
    })}

                ${buildTooltipRow({
        label: "Weight key",
        value: escapeHtml(point.weightKey),
    })}
            </table>
        </div>
    `;
};

const getSelectedResult = (
    data,
    selectedDataset
) => {
    if (!Array.isArray(data?.results)) {
        return null;
    }

    return (
        data.results.find(
            row =>
                String(row?.dataset) ===
                String(selectedDataset)
        ) ?? null
    );
};

const buildPathwayPoints = (
    selectedResult,
    components
) => {
    if (
        !selectedResult ||
        !Array.isArray(components)
    ) {
        return [];
    }

    const pathwayValues =
        selectedResult.pathway_values ?? {};

    return components
        .map(component => {
            const value = getSafeNumber(
                pathwayValues[component.field]
            );

            if (value === null) {
                return null;
            }

            return {
                field: component.field,
                sourceField: component.source_field,
                label: component.label,
                shortLabel: component.short_label,
                weightKey: component.weight_key,
                weight: getSafeNumber(
                    component.weight
                ),
                value,
            };
        })
        .filter(Boolean);
};

const getSymmetricLimit = points => {
    const maxAbsValue = Math.max(
        ...points.map(point =>
            Math.abs(point.value)
        ),
        1
    );

    const rawLimit = maxAbsValue * 1.15;

    if (rawLimit <= 2) {
        return Math.ceil(rawLimit * 2) / 2;
    }

    return Math.ceil(rawLimit);
};

const buildFormulaSegments = ({
    formula,
    cmScore,
}) => {
    const intercept = getSafeNumber(
        formula?.intercept,
        0
    );

    const components = Array.isArray(
        formula?.components
    )
        ? formula.components
        : [];

    const segments = [
        {
            richText:
                "{scoreLabel|CM-Score}" +
                "{plain| = }" +
                `{coefficient|${formatNumber(intercept, 4)}}`,
            estimatedWidth: 205,
        },
    ];

    components.forEach(component => {
        const shortLabel = String(
            component.short_label || ""
        );

        const styleKey =
            shortLabel.toLowerCase();

        segments.push({
            richText:
                "{plain| + }" +
                `{coefficient|${formatNumber(
                    component.weight,
                    4
                )}}` +
                "{plain| × }" +
                `{${styleKey}|${shortLabel}}`,
            estimatedWidth: 150,
        });
    });

    segments.push({
        richText:
            "{plain| = }" +
            `{result|${formatNumber(
                cmScore,
                4
            )}}`,
        estimatedWidth: 92,
    });

    return segments;
};


const splitFormulaSegmentsIntoLines = ({
    segments,
    maxLineWidth,
}) => {
    const lines = [];

    let currentLine = [];
    let currentWidth = 0;

    segments.forEach(segment => {
        const shouldWrap =
            currentLine.length > 0 &&
            currentWidth +
            segment.estimatedWidth >
            maxLineWidth;

        if (shouldWrap) {
            lines.push(currentLine);
            currentLine = [];
            currentWidth = 0;
        }

        currentLine.push(segment);
        currentWidth +=
            segment.estimatedWidth;
    });

    if (currentLine.length > 0) {
        lines.push(currentLine);
    }

    return lines.map(line =>
        line
            .map(segment => segment.richText)
            .join("")
    );
};

const formulaLineToRichText = tokens => {
    return tokens
        .map(token => {
            const styleName = token.type || "plain";

            return `{${styleName}|${token.text}}`;
        })
        .join("");
};

const FORMULA_RICH_STYLES = {
    plain: {
        fontSize: 15,
        color: "#262626",
        padding: [0, 1],
    },

    scoreLabel: {
        fontSize: 17,
        fontWeight: 700,
        color: "#262626",
        borderColor: "#ef4444",
        borderWidth: 2,
        borderRadius: 3,
        padding: [4, 7],
    },

    coefficient: {
        fontSize: 15,
        color: "#262626",
        fontStyle: "italic",
        padding: [0, 2],
    },

    result: {
        fontSize: 16,
        fontWeight: 700,
        color: "#262626",
        padding: [0, 3],
    },

    c1: {
        fontSize: 15,
        fontWeight: 700,
        color: "#262626",
        backgroundColor: "#72c6bd",
        borderColor: "#4b5563",
        borderWidth: 1,
        borderRadius: 14,
        padding: [5, 7],
    },

    c2: {
        fontSize: 15,
        fontWeight: 700,
        color: "#262626",
        backgroundColor: "#f4df7b",
        borderColor: "#4b5563",
        borderWidth: 1,
        borderRadius: 14,
        padding: [5, 7],
    },

    c3: {
        fontSize: 15,
        fontWeight: 700,
        color: "#262626",
        backgroundColor: "#aaa0c8",
        borderColor: "#4b5563",
        borderWidth: 1,
        borderRadius: 14,
        padding: [5, 7],
    },

    c4: {
        fontSize: 15,
        fontWeight: 700,
        color: "#262626",
        backgroundColor: "#ef6f61",
        borderColor: "#4b5563",
        borderWidth: 1,
        borderRadius: 14,
        padding: [5, 7],
    },

    m1: {
        fontSize: 15,
        fontWeight: 700,
        color: "#262626",
        backgroundColor: "#6ba4bd",
        borderColor: "#4b5563",
        borderWidth: 1,
        borderRadius: 14,
        padding: [5, 7],
    },

    m2: {
        fontSize: 15,
        fontWeight: 700,
        color: "#262626",
        backgroundColor: "#f1a24a",
        borderColor: "#4b5563",
        borderWidth: 1,
        borderRadius: 14,
        padding: [5, 7],
    },
};

const CMScorePathwayPlotCore = ({
    data,
    selectedDataset,
    title = "CM-Score Result",
}) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const {
        width,
        height,
    } = useContainerSize();

    const option = useMemo(() => {
        if (
            !data ||
            !selectedDataset ||
            width <= 0 ||
            height <= 0
        ) {
            return null;
        }

        const selectedResult = getSelectedResult(
            data,
            selectedDataset
        );

        if (!selectedResult) {
            return null;
        }

        const components =
            data?.formula?.components ?? [];

        const points = buildPathwayPoints(
            selectedResult,
            components
        );

        if (!points.length) {
            return null;
        }

        const selectedPoints = [...points];

        const positivePoints = selectedPoints.filter(
            point => point.value >= 0
        );

        const negativePoints = selectedPoints.filter(
            point => point.value < 0
        );

        const xLimit = getSymmetricLimit(
            selectedPoints
        );

        const yLabels = selectedPoints.map(
            point => point.label
        );

        const subtitleParts = [
            selectedDataset,
            selectedResult.cell_line
                ? `Cell line: ${selectedResult.cell_line}`
                : null,
        ].filter(Boolean);

        const fullTitle = [
            title,
            subtitleParts.join(" | "),
        ]
            .filter(Boolean)
            .join("\n");

        const buildSeriesData = values => {
            return values.map(point => ({
                value: [
                    point.value,
                    point.label,
                ],
                raw: point,
                symbolSize: POINT_SIZE,
            }));
        };

        const formulaSegments =
            buildFormulaSegments({
                formula: data?.formula,
                cmScore: selectedResult.cm_score,
            });

        const formulaAvailableWidth = Math.max(
            320,
            width - 100
        );

        const formulaLines =
            splitFormulaSegmentsIntoLines({
                segments: formulaSegments,
                maxLineWidth:
                formulaAvailableWidth,
            });

        const formulaLineHeight = 42;
        const formulaBlockHeight = Math.max(
            1,
            formulaLines.length
        ) * formulaLineHeight;

        const gridBottom = 95 + formulaBlockHeight;

        return {
            animationDuration: 300,

            title: {
                text: fullTitle,
                left: "center",
                top: 8,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 600,
                },
                subtextStyle: {
                    fontSize: 12,
                    color: "#595959",
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

            legend: {
                top: 62,
                left: "center",
                data: [
                    "Positive",
                    "Negative",
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
                        title: "Download",
                        name: "cm_score_result",
                        pixelRatio: 2,
                        backgroundColor: "#ffffff",
                        excludeComponents: [
                            "toolbox",
                        ],
                    },
                },
            },

            grid: {
                left: 360,
                right: 70,
                top: 105,
                bottom: gridBottom,
                containLabel: false,
            },

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
                        width: 1.25,
                    },
                },

                axisTick: {
                    show: true,
                },

                splitLine: {
                    show: false,
                },

                axisLabel: {
                    formatter: value =>
                        formatNumber(value, 2),
                },
            },

            yAxis: {
                type: "category",
                data: yLabels,
                inverse: true,

                name: "Pathway",
                nameLocation: "middle",
                nameGap: 55,

                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: "#222",
                        width: 1.25,
                    },
                },

                axisTick: {
                    show: true,
                },

                axisLabel: {
                    width: 300,
                    overflow: "break",
                    align: "right",
                    margin: 14,
                    fontSize: 12,
                    lineHeight: 16,
                },
            },

            graphic: formulaLines.map(
                (lineText, index) => {
                    const reverseIndex =
                        formulaLines.length -
                        1 -
                        index;

                    return {
                        type: "text",
                        left: "center",
                        bottom:
                            22 +
                            reverseIndex *
                            formulaLineHeight,
                        silent: true,
                        z: 10,

                        style: {
                            text: lineText,
                            rich:
                            FORMULA_RICH_STYLES,
                            fill: "#262626",
                            fontSize: 15,
                            lineHeight: 32,
                            align: "center",
                            verticalAlign: "middle",
                        },
                    };
                }
            ),

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
                            color: "#595959",
                            width: 1.25,
                            type: "dashed",
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
                    name: "Positive",
                    type: "scatter",
                    symbolSize: POINT_SIZE,
                    data: buildSeriesData(
                        positivePoints
                    ),
                    itemStyle: {
                        color: POSITIVE_COLOR,
                        opacity: 0.85,
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
                    name: "Negative",
                    type: "scatter",
                    symbolSize: POINT_SIZE,
                    data: buildSeriesData(
                        negativePoints
                    ),
                    itemStyle: {
                        color: NEGATIVE_COLOR,
                        opacity: 0.85,
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
        selectedDataset,
        title,
        width,
        height,
    ]);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        chartInstanceRef.current =
            echarts.init(chartRef.current);

        return () => {
            chartInstanceRef.current?.dispose();
            chartInstanceRef.current = null;
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
            width <= 0 ||
            height <= 0
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

const CMScorePathwayPlot = ({
    data,
    selectedDataset,
    title = "CM-Score Result",
    height = 560,
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
            <CMScorePathwayPlotCore
                data={data}
                selectedDataset={selectedDataset}
                title={title}
            />
        </ResponsiveVisualizationContainer>
    );
};

export default CMScorePathwayPlot;
