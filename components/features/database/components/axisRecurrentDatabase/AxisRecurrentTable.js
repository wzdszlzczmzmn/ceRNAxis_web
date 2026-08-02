"use client";

import {
    useMemo,
    useState,
} from "react";

import { Stack } from "@mui/system";
import {
    Button,
    Tooltip,
    Typography,
} from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import SplitterLayout
    from "@/components/layouts/SplitterLayout";
import LoadingView
    from "@/components/common/status/LoadingView";
import ErrorView
    from "@/components/common/status/ErrorView";
import BasicChip
    from "@/components/ui/chips/BasicChip";
import { StyledTable }
    from "@/components/ui/table/StyledTable";
import useAxisRecurrentMeta
    from "@/components/features/database/hooks/axisRecurrentDatabase/useAxisRecurrentMeta";
import useAxisRecurrentRecords
    from "@/components/features/database/hooks/axisRecurrentDatabase/useAxisRecurrentRecords";
import AxisRecurrentFilterCollapse
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentFilterCollapse";
import AxisRecurrentTableOperations
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentTableOperations";


const renderRNAChip = (
    value,
    color,
) => {
    if (!value) {
        return "-";
    }

    return (
        <BasicChip
            value={value}
            color={color}
        />
    );
};


const renderCount = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return number;
};


const formatPercent = value => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "-";
    }

    return `${(number * 100).toFixed(1)}%`;
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


const renderConsistency = value => {
    if (value === null || value === undefined) {
        return "-";
    }

    return (
        <BasicChip
            value={
                value
                    ? "Consistent"
                    : "Inconsistent"
            }
            color={value ? "green" : "default"}
        />
    );
};


const getAxisFinalSummary = record => {
    return record?.axis_final_summary || null;
};


const columns = [
    {
        title: "miRNA",
        dataIndex: "miRNA",
        key: "miRNA",
        align: "center",
        fixed: "left",
        width: 150,
        sorter: true,
        render: value => renderRNAChip(
            value,
            "purple",
        ),
    },
    {
        title: "mRNA",
        dataIndex: "mRNA",
        key: "mRNA",
        align: "center",
        fixed: "left",
        width: 140,
        sorter: true,
        render: value => renderRNAChip(
            value,
            "blue",
        ),
    },
    {
        title: "lncRNA/circRNA",
        key: "ceRNA",
        align: "center",
        width: 170,
        render: (_, record) => {
            if (record.lncRNA) {
                return renderRNAChip(
                    record.lncRNA,
                    "cyan",
                );
            }

            return renderRNAChip(
                record.circRNA,
                "gold",
            );
        },
    },
    {
        title: "Axis Type",
        dataIndex: "axis_type",
        key: "axis_type",
        align: "center",
        width: 190,
        sorter: true,
        render: value => (
            <BasicChip
                value={value || "-"}
                color="purple"
            />
        ),
    },

    {
        title: "Datasets",
        dataIndex: "dataset_count",
        key: "dataset_count",
        align: "center",
        width: 100,
        sorter: true,
        render: renderCount,
    },
    {
        title: "Contexts",
        dataIndex: "context_count",
        key: "context_count",
        align: "center",
        width: 100,
        sorter: true,
        render: renderCount,
    },

    {
        title: "TCGA Datasets",
        dataIndex: "tcga_dataset_count",
        key: "tcga_dataset_count",
        align: "center",
        width: 180,
        sorter: true,
        render: renderCount,
    },
    {
        title: "TIMEDB Datasets",
        dataIndex: "timedb_dataset_count",
        key: "timedb_dataset_count",
        align: "center",
        width: 180,
        sorter: true,
        render: renderCount,
    },
    {
        title: "TCGA Contexts",
        dataIndex: "tcga_context_count",
        key: "tcga_context_count",
        align: "center",
        width: 180,
        render: renderCount,
    },
    {
        title: "TIMEDB Contexts",
        dataIndex: "timedb_context_count",
        key: "timedb_context_count",
        align: "center",
        width: 180,
        render: renderCount,
    },

    {
        title: "Module2 Contexts",
        dataIndex: "module2_context_count",
        key: "module2_context_count",
        align: "center",
        width: 180,
        render: renderCount,
    },
    {
        title: "Module3 Contexts",
        dataIndex: "module3_context_count",
        key: "module3_context_count",
        align: "center",
        width: 180,
        render: renderCount,
    },

    {
        title: "Axis Final",
        dataIndex: "axis_final_context_count",
        key: "axis_final_context_count",
        align: "center",
        width: 110,
        sorter: true,
        render: renderCount,
    },
    {
        title: "Sponge",
        dataIndex: "sponge_context_count",
        key: "sponge_context_count",
        align: "center",
        width: 100,
        sorter: true,
        render: renderCount,
    },
    {
        title: "Both",
        dataIndex: "both_result_context_count",
        key: "both_result_context_count",
        align: "center",
        width: 90,
        sorter: true,
        render: value => (
            <Tooltip title="Contexts containing both Axis Final and Sponge">
                <span>
                    {renderCount(value)}
                </span>
            </Tooltip>
        ),
    },

    {
        title: "Axis Final Available",
        dataIndex: "has_axis_final",
        key: "has_axis_final",
        align: "center",
        width: 180,
        render: renderAvailability,
    },
    {
        title: "Sponge Available",
        dataIndex: "has_sponge",
        key: "has_sponge",
        align: "center",
        width: 180,
        render: renderAvailability,
    },

    {
        title: "Dominant Regulation",
        key: "dominant_axis_regulation",
        align: "center",
        width: 175,
        render: (_, record) => {
            const summary = getAxisFinalSummary(record);

            if (!summary) {
                return "-";
            }

            const value = (
                summary.dominant_axis_regulation
                || "-"
            );

            return (
                <BasicChip
                    value={value}
                    color={
                        value === "down_up_down"
                            ? "blue"
                            : "volcano"
                    }
                />
            );
        },
    },
    {
        title: "Patterns",
        key: "regulation_pattern_count",
        align: "center",
        width: 100,
        sorter: true,
        render: (_, record) => {
            const summary = getAxisFinalSummary(record);

            return summary
                ? renderCount(
                    summary.regulation_pattern_count
                )
                : "-";
        },
    },
    {
        title: "Dominant Count",
        key: "dominant_regulation_count",
        align: "center",
        width: 180,
        sorter: true,
        render: (_, record) => {
            const summary = getAxisFinalSummary(record);

            return summary
                ? renderCount(
                    summary.dominant_regulation_count
                )
                : "-";
        },
    },
    {
        title: "Observations",
        key: "observation_count",
        align: "center",
        width: 115,
        render: (_, record) => {
            const summary = getAxisFinalSummary(record);

            return summary
                ? renderCount(
                    summary.observation_count
                )
                : "-";
        },
    },
    {
        title: "Dominant Ratio",
        key: "dominant_regulation_ratio",
        align: "center",
        width: 180,
        render: (_, record) => {
            const summary = getAxisFinalSummary(record);

            return summary
                ? formatPercent(
                    summary.dominant_regulation_ratio
                )
                : "-";
        },
    },
    {
        title: "Consistency",
        key: "regulation_consistent",
        align: "center",
        width: 130,
        render: (_, record) => {
            const summary = getAxisFinalSummary(record);

            return renderConsistency(
                summary?.regulation_consistent
            );
        },
    },

    {
        title: "Action",
        key: "action",
        align: "center",
        fixed: "right",
        width: 110,
        render: (_, record) => (
            <Link
                href={{
                    pathname: "/database/recurrentceRNA/detail",
                    query: {
                        signature: record.axis_signature,
                    },
                }}
                target="_blank"
            >
                <Button
                    type="primary"
                    icon={<FileTextOutlined />}
                >
                    Detail
                </Button>
            </Link>
        ),
    },
];


const AxisRecurrentTable = ({
    initialSearch = "",
}) => {
    const [isShowLeft, setIsShowLeft] = useState(true);

    const {
        meta,
        patternMeta,
        filterOptions,
        defaultFilters,
        defaultSort,
        isLoading: isMetaLoading,
        isError: isMetaError,
    } = useAxisRecurrentMeta();

    const {
        records,
        pattern,
        filters,
        pagination,
        isLoading,
        isError,

        setFilters,
        clearFilters,
        handleSearch,
        handleTableChange,
    } = useAxisRecurrentRecords({
        initialPattern: initialSearch,
        defaultFilters,
        defaultSort,
        enabled: Boolean(meta),
    });

    const tableColumns = useMemo(
        () => columns,
        [],
    );

    if (isMetaLoading) {
        return (
            <LoadingView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    if (isMetaError || isError) {
        return (
            <ErrorView
                containerSx={{
                    height: "80vh",
                    marginTop: "40px",
                }}
            />
        );
    }

    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanel={
                <AxisRecurrentFilterCollapse
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                    clearFilters={clearFilters}
                />
            }
            rightPanel={
                <Stack
                    spacing={3}
                    sx={{ pt: "8px" }}
                >
                    <AxisRecurrentTableOperations
                        recordNum={pagination.total}
                        pattern={pattern}
                        patternMeta={patternMeta}
                        isShowLeft={isShowLeft}
                        onToggleFilters={() =>
                            setIsShowLeft(prev => !prev)
                        }
                        onSearch={handleSearch}
                    />

                    <StyledTable
                        rowKey="axis_key"
                        columns={tableColumns}
                        dataSource={records}
                        loading={isLoading}
                        scroll={{
                            x: "max-content",
                        }}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            pageSizeOptions: [
                                10,
                                20,
                                50,
                                100,
                            ],
                        }}
                        onChange={handleTableChange}
                    />
                </Stack>
            }
        />
    );
};


export default AxisRecurrentTable;
