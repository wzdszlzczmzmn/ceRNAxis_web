"use client";

import { useMemo } from "react";
import {
    Table,
    Tag,
    Tooltip,
    Typography,
} from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

import BasicChip
    from "@/components/ui/chips/BasicChip";


const { Text } = Typography;


const renderText = value => {
    if (
        value === null
        || value === undefined
        || value === ""
    ) {
        return "-";
    }

    return value;
};


const renderNumber = (
    value,
    digits = 4,
) => {
    if (
        value === null
        || value === undefined
        || value === ""
    ) {
        return "-";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return value;
    }

    return number.toFixed(digits);
};


const renderInteger = value => {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
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


const renderRegulation = value => {
    if (!value) {
        return "-";
    }

    const normalizedValue = String(
        value
    ).toLowerCase();

    let color = "default";

    if (
        normalizedValue === "up"
        || normalizedValue === "up_down_up"
    ) {
        color = "red";
    } else if (
        normalizedValue === "down"
        || normalizedValue === "down_up_down"
    ) {
        color = "blue";
    }

    return (
        <Tag color={color}>
            {value}
        </Tag>
    );
};


const renderGroupType = value => {
    if (!value) {
        return "-";
    }

    const colorMap = {
        none: "default",
        other: "purple",
        grade: "cyan",
        stage: "gold",
    };

    return (
        <Tag color={colorMap[value] || "default"}>
            {value}
        </Tag>
    );
};


const renderAvailability = value => {
    if (value) {
        return (
            <Tooltip title="Available">
                <CheckCircleOutlined
                    style={{
                        color: "#52c41a",
                        fontSize: "18px",
                    }}
                />
            </Tooltip>
        );
    }

    return (
        <Tooltip title="Unavailable">
            <CloseCircleOutlined
                style={{
                    color: "#bfbfbf",
                    fontSize: "18px",
                }}
            />
        </Tooltip>
    );
};


const renderFile = artifact => {
    if (!artifact) {
        return "-";
    }

    return (
        <Tooltip
            title={
                artifact.file_sha256
                    ? `SHA-256: ${artifact.file_sha256}`
                    : null
            }
        >
            <Text
                copyable={
                    artifact.file_name
                        ? {
                            text: artifact.file_name,
                        }
                        : false
                }
            >
                {renderText(artifact.file_name)}
            </Text>
        </Tooltip>
    );
};


const buildColumns = summary => {
    const ceRNAType = (
        summary?.ceRNA_type || "ceRNA"
    );

    const getCeRNALog2FC = record => {
        const evidence = (
            record.axis_final?.evidence
        );

        if (!evidence) {
            return null;
        }

        return ceRNAType === "circRNA"
            ? evidence.circRNA_log2FC
            : evidence.lncRNA_log2FC;
    };

    const getCeRNARegulation = record => {
        const evidence = (
            record.axis_final?.evidence
        );

        if (!evidence) {
            return "";
        }

        return ceRNAType === "circRNA"
            ? evidence.circRNA_regulation
            : evidence.lncRNA_regulation;
    };

    return [
        {
            title: "Context",
            children: [
                {
                    title: "Source",
                    dataIndex: "dataset_source",
                    key: "dataset_source",
                    fixed: "left",
                    align: "center",
                    width: 100,
                    render: value => (
                        <BasicChip
                            value={renderText(value)}
                            color={
                                value === "TCGA"
                                    ? "volcano"
                                    : "purple"
                            }
                        />
                    ),
                },
                {
                    title: "Module",
                    dataIndex: "module",
                    key: "module",
                    fixed: "left",
                    align: "center",
                    width: 105,
                    render: value => (
                        <Tag color="geekblue">
                            {renderText(value)}
                        </Tag>
                    ),
                },
                {
                    title: "Dataset",
                    dataIndex: "dataset_name",
                    key: "dataset_name",
                    fixed: "left",
                    align: "center",
                    width: 145,
                    render: renderText,
                },
                {
                    title: "Group Type",
                    dataIndex: "group_type",
                    key: "group_type",
                    fixed: "left",
                    align: "center",
                    width: 110,
                    render: renderGroupType,
                },
                {
                    title: "Group By",
                    dataIndex: "group_by",
                    key: "group_by",
                    fixed: "left",
                    align: "center",
                    width: 135,
                    render: renderText,
                },
                {
                    title: "Group Value",
                    dataIndex: "group_value",
                    key: "group_value",
                    fixed: "left",
                    align: "center",
                    width: 150,
                    render: renderText,
                },
            ],
        },
        {
            title: "Result Coverage",
            children: [
                {
                    title: "Observations",
                    dataIndex: "observation_count",
                    key: "observation_count",
                    align: "center",
                    width: 110,
                    render: renderInteger,
                },
                {
                    title: "Axis Final",
                    dataIndex: "axis_final_observation_count",
                    key: "axis_final_observation_count",
                    align: "center",
                    width: 95,
                    render: renderInteger,
                },
                {
                    title: "Sponge",
                    dataIndex: "sponge_observation_count",
                    key: "sponge_observation_count",
                    align: "center",
                    width: 90,
                    render: renderInteger,
                },
                {
                    title: "Both",
                    dataIndex: "has_both_results",
                    key: "has_both_results",
                    align: "center",
                    width: 80,
                    render: renderAvailability,
                },
            ],
        },
        {
            title: "Axis Final Evidence",
            children: [
                {
                    title: "Available",
                    dataIndex: "has_axis_final",
                    key: "has_axis_final",
                    align: "center",
                    width: 90,
                    render: renderAvailability,
                },
                {
                    title: "Axis Regulation",
                    key: "axis_regulation",
                    align: "center",
                    width: 145,
                    render: (_, record) =>
                        renderRegulation(
                            record.axis_final
                                ?.evidence
                                ?.axis_regulation
                        ),
                },
                {
                    title: "mRNA log2FC",
                    key: "mRNA_log2FC",
                    align: "center",
                    width: 110,
                    render: (_, record) =>
                        renderNumber(
                            record.axis_final
                                ?.evidence
                                ?.mRNA_log2FC
                        ),
                },
                {
                    title: "mRNA Regulation",
                    key: "mRNA_regulation",
                    align: "center",
                    width: 125,
                    render: (_, record) =>
                        renderRegulation(
                            record.axis_final
                                ?.evidence
                                ?.mRNA_regulation
                        ),
                },
                {
                    title: "miRNA log2FC",
                    key: "miRNA_log2FC",
                    align: "center",
                    width: 110,
                    render: (_, record) =>
                        renderNumber(
                            record.axis_final
                                ?.evidence
                                ?.miRNA_log2FC
                        ),
                },
                {
                    title: "miRNA Regulation",
                    key: "miRNA_regulation",
                    align: "center",
                    width: 125,
                    render: (_, record) =>
                        renderRegulation(
                            record.axis_final
                                ?.evidence
                                ?.miRNA_regulation
                        ),
                },
                {
                    title: `${ceRNAType} log2FC`,
                    key: "ceRNA_log2FC",
                    align: "center",
                    width: 115,
                    render: (_, record) =>
                        renderNumber(
                            getCeRNALog2FC(record)
                        ),
                },
                {
                    title: `${ceRNAType} Regulation`,
                    key: "ceRNA_regulation",
                    align: "center",
                    width: 135,
                    render: (_, record) =>
                        renderRegulation(
                            getCeRNARegulation(record)
                        ),
                },
                {
                    title: "Source Axis ID",
                    key: "axis_final_source_axis_id",
                    align: "center",
                    width: 220,
                    render: (_, record) => (
                        <Text
                            copyable={Boolean(
                                record.axis_final
                                    ?.source_axis_id
                            )}
                        >
                            {renderText(
                                record.axis_final
                                    ?.source_axis_id
                            )}
                        </Text>
                    ),
                },
            ],
        },
        {
            title: "Sponge Evidence",
            children: [
                {
                    title: "Available",
                    dataIndex: "has_sponge",
                    key: "has_sponge",
                    align: "center",
                    width: 90,
                    render: renderAvailability,
                },
                {
                    title: "cor",
                    key: "cor",
                    align: "center",
                    width: 90,
                    render: (_, record) =>
                        renderNumber(
                            record.sponge
                                ?.evidence
                                ?.cor
                        ),
                },
                {
                    title: "pcor",
                    key: "pcor",
                    align: "center",
                    width: 90,
                    render: (_, record) =>
                        renderNumber(
                            record.sponge
                                ?.evidence
                                ?.pcor
                        ),
                },
                {
                    title: "mscor",
                    key: "mscor",
                    align: "center",
                    width: 90,
                    render: (_, record) =>
                        renderNumber(
                            record.sponge
                                ?.evidence
                                ?.mscor
                        ),
                },
                {
                    title: "Source Axis ID",
                    key: "sponge_source_axis_id",
                    align: "center",
                    width: 220,
                    render: (_, record) => (
                        <Text
                            copyable={Boolean(
                                record.sponge
                                    ?.source_axis_id
                            )}
                        >
                            {renderText(
                                record.sponge
                                    ?.source_axis_id
                            )}
                        </Text>
                    ),
                },
            ],
        },
    ];
};


const AxisRecurrentDetailTable = ({
    summary,
    records,
    loading,
}) => {
    const columns = useMemo(
        () => buildColumns(summary),
        [summary],
    );

    return (
        <Table
            rowKey={record =>
                record.context_id || record.id
            }
            columns={columns}
            dataSource={records}
            loading={loading}
            bordered
            size="small"
            scroll={{
                x: "max-content",
            }}
            pagination={false}
            locale={{
                emptyText: "No matching contexts",
            }}
        />
    );
};


export default AxisRecurrentDetailTable;
