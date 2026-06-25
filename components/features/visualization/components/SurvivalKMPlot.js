"use client";

import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import ResponsiveVisualizationContainer, {
    useContainerSize,
} from "@/components/common/container/ResponsiveVisualizationContainer";

const GROUP_COLORS = [
    "#1677ff",
    "#D62728",
    "#722ED1",
    "#13C2C2",
];

const getSafeNumber = (value, fallback = NaN) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const hasSurvivalData = data => {
    return Array.isArray(data?.groups) &&
        data.groups.some(group =>
            Array.isArray(group?.points) && group.points.length > 0
        );
};

const toCIBandDiffData = (lowerPoints = [], upperPoints = []) => {
    const lowerMap = new Map(
        lowerPoints
            .map(point => {
                const time = getSafeNumber(point.time);
                const survival = getSafeNumber(point.survival);

                if (!Number.isFinite(time) || !Number.isFinite(survival)) {
                    return null;
                }

                return [time, survival];
            })
            .filter(Boolean)
    );

    return upperPoints
        .map(point => {
            const time = getSafeNumber(point.time);
            const upper = getSafeNumber(point.survival);
            const lower = lowerMap.get(time);

            if (
                !Number.isFinite(time) ||
                !Number.isFinite(upper) ||
                !Number.isFinite(lower)
            ) {
                return null;
            }

            return [
                time,
                Math.max(upper - lower, 0),
            ];
        })
        .filter(Boolean);
};

const formatNumber = (value, digits = 4) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "--";
    }

    return number.toFixed(digits);
};

const formatPValue = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "NA";
    }

    if (number < 0.001) {
        return number.toExponential(2);
    }

    return number.toFixed(4);
};

const buildTooltipRow = ({ label, value }) => {
    return `
        <tr>
            <td
                style="
                    font-weight:600;
                    color:#595959;
                    padding:3px 12px 3px 0;
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

const formatTooltip = params => {
    const raw = params?.data?.raw;

    if (!raw) {
        return "";
    }

    return `
        <div style="min-width:200px;font-size:13px;line-height:1.45;">
            <div
                style="
                    font-weight:700;
                    font-size:15px;
                    color:#262626;
                    margin-bottom:8px;
                "
            >
                ${raw.groupName || "--"}
            </div>

            <table style="width:100%;border-collapse:collapse;">
                ${buildTooltipRow({
        label: "Time",
        value: formatNumber(raw.time, 0),
    })}
                ${buildTooltipRow({
        label: "Survival",
        value: formatNumber(raw.survival, 4),
    })}
                ${buildTooltipRow({
        label: "N",
        value: raw.n ?? "--",
    })}
                ${buildTooltipRow({
        label: "Events",
        value: raw.eventCount ?? "--",
    })}
                ${buildTooltipRow({
        label: "Censored",
        value: raw.censoredCount ?? "--",
    })}
            </table>
        </div>
    `;
};

const formatAxisTooltip = params => {
    const items = Array.isArray(params) ? params : [params];

    const curveItems = items.filter(item => item?.data?.raw);

    if (!curveItems.length) {
        return "";
    }

    const axisTime = curveItems[0]?.data?.raw?.time;

    const rows = curveItems.map(item => {
        const raw = item.data.raw;
        const color = item.color || "#999";

        return `
            <tr>
                <td
                    style="
                        padding:4px 12px 4px 0;
                        white-space:nowrap;
                    "
                >
                    <span
                        style="
                            display:inline-block;
                            width:9px;
                            height:9px;
                            border-radius:50%;
                            background:${color};
                            margin-right:6px;
                        "
                    ></span>
                    <span style="font-weight:600;color:#595959;">
                        ${raw.groupName || item.seriesName || "--"}
                    </span>
                </td>

                <td
                    style="
                        text-align:right;
                        color:#262626;
                        padding:4px 0;
                        white-space:nowrap;
                    "
                >
                    ${formatNumber(raw.survival, 4)}
                </td>
            </tr>
        `;
    }).join("");

    return `
        <div style="min-width:240px;font-size:13px;line-height:1.45;">
            <div
                style="
                    font-weight:700;
                    font-size:15px;
                    color:#262626;
                    margin-bottom:8px;
                "
            >
                Time = ${formatNumber(axisTime, 0)} days
            </div>

            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr>
                        <th
                            style="
                                text-align:left;
                                color:#8c8c8c;
                                font-weight:600;
                                padding:2px 12px 4px 0;
                            "
                        >
                            Group
                        </th>
                        <th
                            style="
                                text-align:right;
                                color:#8c8c8c;
                                font-weight:600;
                                padding:2px 0 4px 0;
                            "
                        >
                            Survival
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
};

const toStepLineData = ({
    points = [],
    groupName,
    n,
    eventCount,
    censoredCount,
}) => {
    return points
        .map(point => {
            const time = getSafeNumber(point.time);
            const survival = getSafeNumber(point.survival);

            if (!Number.isFinite(time) || !Number.isFinite(survival)) {
                return null;
            }

            return {
                value: [time, survival],
                raw: {
                    groupName,
                    time,
                    survival,
                    n,
                    eventCount,
                    censoredCount,
                },
            };
        })
        .filter(Boolean);
};

const toPlainLineData = (points = []) => {
    return points
        .map(point => {
            const time = getSafeNumber(point.time);
            const survival = getSafeNumber(point.survival);

            if (!Number.isFinite(time) || !Number.isFinite(survival)) {
                return null;
            }

            return [time, survival];
        })
        .filter(Boolean);
};

const getMaxTime = data => {
    const values = (data?.groups || [])
        .flatMap(group => group.points || [])
        .map(point => getSafeNumber(point.time))
        .filter(Number.isFinite);

    if (!values.length) {
        return 1;
    }

    return Math.max(...values);
};

const getPlotGrid = ({
    showLegend,
}) => {
    return {
        top: showLegend ? 105 : 80,
        left: 75,
        right: 40,
        bottom: 65,
    };
};

const SurvivalKMPlotCore = ({
    data,
    title = null,
    titlePrimary = null,
    titleSecondary = null,
    showConfidenceInterval = true,
    lineWidth = 1.5,
    showSymbols = false,
}) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const { width, height } = useContainerSize();

    const option = useMemo(() => {
        if (!hasSurvivalData(data) || width <= 0 || height <= 0) {
            return null;
        }

        const groups = data.groups || [];
        const validGroups = groups.filter(group =>
            Array.isArray(group.points) && group.points.length > 0
        );

        if (!validGroups.length) {
            return null;
        }

        const computedTitle =
            title ||
            data?.title ||
            "ceRNA axis-based survival analysis";

        const logrankP = data?.summary?.logrank_p;
        const subtitleParts = [];

        if (Number.isFinite(Number(logrankP))) {
            subtitleParts.push(`Log-rank p = ${formatPValue(logrankP)}`);
        } else {
            subtitleParts.push("Log-rank p = NA");
        }

        const legendData = validGroups.map(group =>
            `${group.name} (n=${group.n})`
        );

        const maxTime = getMaxTime(data);
        const grid = getPlotGrid({
            showLegend: validGroups.length > 1,
        });

        const series = [];

        validGroups.forEach((group, index) => {
            const color = GROUP_COLORS[index % GROUP_COLORS.length];
            const groupName = `${group.name} (n=${group.n})`;

            if (
                showConfidenceInterval &&
                Array.isArray(group.ci_lower) &&
                Array.isArray(group.ci_upper) &&
                group.ci_lower.length > 0 &&
                group.ci_upper.length > 0
            ) {
                series.push({
                    name: `${group.name} CI lower`,
                    type: "line",
                    step: "end",
                    data: toPlainLineData(group.ci_lower),
                    showSymbol: false,
                    lineStyle: {
                        opacity: 0,
                    },
                    stack: `${group.name}-ci`,
                    silent: true,
                    tooltip: {
                        show: false,
                    },
                    emphasis: {
                        disabled: true,
                    },
                });

                series.push({
                    name: `${group.name} 95% CI`,
                    type: "line",
                    step: "end",
                    data: toCIBandDiffData(group.ci_lower, group.ci_upper),
                    showSymbol: false,
                    lineStyle: {
                        opacity: 0,
                    },
                    areaStyle: {
                        color,
                        opacity: 0.08,
                    },
                    stack: `${group.name}-ci`,
                    silent: true,
                    tooltip: {
                        show: false,
                    },
                    emphasis: {
                        disabled: true,
                    },
                });
            }

            series.push({
                name: groupName,
                type: "line",
                step: "end",
                showSymbol: showSymbols,
                symbolSize: 5,
                smooth: false,
                connectNulls: false,
                lineStyle: {
                    width: lineWidth,
                    color,
                },
                itemStyle: {
                    color,
                },
                emphasis: {
                    focus: "series",
                    lineStyle: {
                        width: lineWidth + 1,
                    },
                },
                data: toStepLineData({
                    points: group.points,
                    groupName: group.name,
                    n: group.n,
                    eventCount: group.event_count,
                    censoredCount: group.censored_count,
                }),
            });
        });

        return {
            title: {
                text: computedTitle,
                subtext: subtitleParts.filter(Boolean).join(" | "),
                left: "center",
                top: 8,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 700,
                },
                subtextStyle: {
                    fontSize: 12,
                    color: "#595959",
                },
            },

            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    snap: true,
                    lineStyle: {
                        type: "dashed",
                        color: "#8c8c8c",
                        width: 1,
                    },
                    crossStyle: {
                        type: "dashed",
                        color: "#8c8c8c",
                        width: 1,
                    },
                    label: {
                        show: true,
                        backgroundColor: "#595959",
                    },
                },
                formatter: formatAxisTooltip,
            },

            legend: {
                top: 58,
                left: "center",
                data: legendData,
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
                        name: "survival_km_plot",
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
                name: data?.x_label || "Time days",
                nameLocation: "middle",
                nameGap: 38,
                min: 0,
                max: Math.ceil(maxTime * 1.03),
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
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#e5e7eb",
                        type: "dashed",
                    },
                },
            },

            yAxis: {
                type: "value",
                name: data?.y_label || "Overall survival probability",
                nameLocation: "middle",
                nameGap: 52,
                min: 0,
                max: 1,
                axisLabel: {
                    formatter: value => Number(value).toFixed(1),
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
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#e5e7eb",
                        type: "dashed",
                    },
                },
            },

            series,
        };
    }, [
        data,
        title,
        showConfidenceInterval,
        lineWidth,
        showSymbols,
        width,
        height,
    ]);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        if (!chartInstanceRef.current) {
            chartInstanceRef.current = echarts.init(chartRef.current);
        }

        if (option) {
            chartInstanceRef.current.setOption(option, true);
        }

        chartInstanceRef.current.resize();

        return () => {
            chartInstanceRef.current?.dispose();
            chartInstanceRef.current = null;
        };
    }, [option]);

    useEffect(() => {
        chartInstanceRef.current?.resize();
    }, [width, height]);

    return (
        <div
            ref={chartRef}
            style={{
                width: "100%",
                height: "100%",
                minHeight: 0,
            }}
        />
    );
};

const SurvivalKMPlot = ({
    height = 520,
    containerSx = {},
    ...props
}) => {
    return (
        <ResponsiveVisualizationContainer
            height={height}
            sx={containerSx}
        >
            <SurvivalKMPlotCore {...props} />
        </ResponsiveVisualizationContainer>
    );
};

export default SurvivalKMPlot;
