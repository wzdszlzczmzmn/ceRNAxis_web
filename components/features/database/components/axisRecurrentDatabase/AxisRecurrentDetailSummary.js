"use client";

import { Stack } from "@mui/system";
import {
    Alert,
    Card,
    Descriptions,
    Space,
    Tag,
    Typography,
} from "antd";

import BasicChip
    from "@/components/ui/chips/BasicChip";


const { Text } = Typography;


const renderValue = value => {
    if (
        value === null
        || value === undefined
        || value === ""
    ) {
        return "-";
    }

    return value;
};


const renderCount = value => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};


const renderRatio = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "-";
    }

    return `${(number * 100).toFixed(1)}%`;
};


const renderDateTime = value => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
};


const renderCounterMap = (
    value,
    color = "default",
) => {
    const entries = Object.entries(
        value || {}
    );

    if (entries.length === 0) {
        return "-";
    }

    return (
        <Space wrap size={[4, 4]}>
            {entries.map(([key, count]) => (
                <Tag
                    key={key}
                    color={color}
                >
                    {key}: {count}
                </Tag>
            ))}
        </Space>
    );
};


const renderConsistency = value => {
    return (
        <Tag color={value ? "green" : "default"}>
            {value ? "Consistent" : "Inconsistent"}
        </Tag>
    );
};


const AxisRecurrentDetailSummary = ({
    summary,
    statistics,
}) => {
    if (!summary) {
        return null;
    }

    const axisFinalSummary = (
        summary.axis_final_summary
    );

    return (
        <Stack spacing={3}>
            <Card title="Axis Identity">
                <Descriptions
                    bordered
                    column={{
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                    }}
                >
                    <Descriptions.Item label="Axis ID">
                        {renderValue(summary.axis_id)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Axis Type">
                        <BasicChip
                            value={renderValue(
                                summary.axis_type
                            )}
                            color="purple"
                        />
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Axis Signature"
                        span={2}
                    >
                        <Text
                            copyable={Boolean(
                                summary.axis_signature
                            )}
                        >
                            {renderValue(
                                summary.axis_signature
                            )}
                        </Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="miRNA">
                        <BasicChip
                            value={renderValue(summary.miRNA)}
                            color="purple"
                        />
                    </Descriptions.Item>

                    <Descriptions.Item label="mRNA">
                        <BasicChip
                            value={renderValue(summary.mRNA)}
                            color="blue"
                        />
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            summary.ceRNA_type || "ceRNA"
                        }
                    >
                        <BasicChip
                            value={renderValue(summary.ceRNA)}
                            color={
                                summary.ceRNA_type === "circRNA"
                                    ? "gold"
                                    : "cyan"
                            }
                        />
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Recurrence Coverage">
                <Descriptions
                    bordered
                    column={{
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 4,
                    }}
                >
                    <Descriptions.Item label="Datasets">
                        {renderCount(summary.dataset_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Contexts">
                        {renderCount(summary.context_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="TCGA Datasets">
                        {renderCount(summary.tcga_dataset_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="TIMEDB Datasets">
                        {renderCount(summary.timedb_dataset_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="SC Datasets">
                        {renderCount(summary.sc_dataset_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="ST Datasets">
                        {renderCount(summary.st_dataset_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="TCGA Contexts">
                        {renderCount(summary.tcga_context_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="TIMEDB Contexts">
                        {renderCount(summary.timedb_context_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="SC Contexts">
                        {renderCount(summary.sc_context_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="ST Contexts">
                        {renderCount(summary.st_context_count)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Module2 Contexts">
                        {renderCount(
                            summary.module2_context_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Module3 Contexts">
                        {renderCount(
                            summary.module3_context_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Axis Final Contexts">
                        {renderCount(
                            summary.axis_final_context_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Sponge Contexts">
                        {renderCount(
                            summary.sponge_context_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Both Results Contexts">
                        {renderCount(
                            summary.both_result_context_count
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Axis Final Regulation Summary">
                {
                    axisFinalSummary
                        ? (
                            <Descriptions
                                bordered
                                column={{
                                    xs: 1,
                                    sm: 2,
                                    md: 3,
                                    lg: 4,
                                }}
                            >
                                <Descriptions.Item
                                    label="Dominant Regulation"
                                >
                                    <BasicChip
                                        value={renderValue(
                                            axisFinalSummary
                                                .dominant_axis_regulation
                                        )}
                                        color="volcano"
                                    />
                                </Descriptions.Item>

                                <Descriptions.Item label="Contexts">
                                    {renderCount(
                                        axisFinalSummary.context_count
                                    )}
                                </Descriptions.Item>

                                <Descriptions.Item label="Observations">
                                    {renderCount(
                                        axisFinalSummary
                                            .observation_count
                                    )}
                                </Descriptions.Item>

                                <Descriptions.Item label="Patterns">
                                    {renderCount(
                                        axisFinalSummary
                                            .regulation_pattern_count
                                    )}
                                </Descriptions.Item>

                                <Descriptions.Item label="Dominant Count">
                                    {renderCount(
                                        axisFinalSummary
                                            .dominant_regulation_count
                                    )}
                                </Descriptions.Item>

                                <Descriptions.Item label="Dominant Ratio">
                                    {renderRatio(
                                        axisFinalSummary
                                            .dominant_regulation_ratio
                                    )}
                                </Descriptions.Item>

                                <Descriptions.Item label="Consistency">
                                    {renderConsistency(
                                        axisFinalSummary
                                            .regulation_consistent
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        )
                        : (
                            <Alert
                                type="info"
                                showIcon
                                message="No Axis Final recurrent summary"
                                description={
                                    "This Axis may only be present in " +
                                    "Sponge result contexts."
                                }
                            />
                        )
                }
            </Card>

            <Card title="Displayed Context Statistics">
                <Descriptions
                    bordered
                    column={{
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                    }}
                >
                    <Descriptions.Item label="Contexts">
                        {renderCount(
                            statistics?.context_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Datasets">
                        {renderCount(
                            statistics?.dataset_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Observations">
                        {renderCount(
                            statistics?.observation_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Axis Final Observations"
                    >
                        {renderCount(
                            statistics
                                ?.axis_final_observation_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Sponge Observations"
                    >
                        {renderCount(
                            statistics
                                ?.sponge_observation_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Both Results Contexts"
                    >
                        {renderCount(
                            statistics
                                ?.both_result_context_count
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Sources"
                        span={2}
                    >
                        {renderCounterMap(
                            statistics?.source_counts,
                            "blue",
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Modules"
                        span={2}
                    >
                        {renderCounterMap(
                            statistics?.module_counts,
                            "purple",
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Group Types"
                        span={2}
                    >
                        {renderCounterMap(
                            statistics?.group_type_counts,
                            "cyan",
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="Regulations"
                        span={2}
                    >
                        {renderCounterMap(
                            statistics?.regulation_counts,
                            "volcano",
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </Stack>
    );
};


export default AxisRecurrentDetailSummary;
