"use client";

import { useState } from "react";
import { Stack } from "@mui/system";
import { Space } from "antd";

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
import useAxisRecurrentMeta from "@/components/features/database/hooks/axisRecurrentDatabase/useAxisRecurrentMeta"
import useAxisRecurrentRecords from "@/components/features/database/hooks/axisRecurrentDatabase/useAxisRecurrentRecords"
import AxisRecurrentFilterCollapse
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentFilterCollapse"
import AxisRecurrentTableOperations
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentTableOperations"


const renderRNAChip = (value, color) => {
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


const columns = [
    {
        title: "miRNA",
        dataIndex: "miRNA",
        key: "miRNA",
        align: "center",
        fixed: "left",
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
        sorter: true,
        render: value => renderRNAChip(
            value,
            "blue",
        ),
    },
    {
        title: "lncRNA",
        dataIndex: "lncRNA",
        key: "lncRNA",
        align: "center",
        sorter: true,
        render: value => renderRNAChip(
            value,
            "cyan",
        ),
    },
    {
        title: "circRNA",
        dataIndex: "circRNA",
        key: "circRNA",
        align: "center",
        sorter: true,
        render: value => renderRNAChip(
            value,
            "gold",
        ),
    },
    {
        title: "Axis Type",
        dataIndex: "axis_type",
        key: "axis_type",
        align: "center",
        sorter: true,
        render: value => (
            <BasicChip
                value={value || "-"}
                color="purple"
            />
        ),
    },
    {
        title: "Projects",
        dataIndex: "project_count",
        key: "project_count",
        align: "center",
        sorter: true,
    },
    {
        title: "Datasets",
        dataIndex: "dataset_count",
        key: "dataset_count",
        align: "center",
        sorter: true,
    },
    {
        title: "TCGA Projects",
        dataIndex: "tcga_project_count",
        key: "tcga_project_count",
        align: "center",
        sorter: true,
    },
    {
        title: "TIMEDB Projects",
        dataIndex: "timedb_project_count",
        key: "timedb_project_count",
        align: "center",
        sorter: true,
    },
    {
        title: "Dominant Regulation",
        dataIndex: "dominant_axis_regulation",
        key: "dominant_axis_regulation",
        align: "center",
        sorter: true,
        render: value => (
            <BasicChip
                value={value || "-"}
                color="volcano"
            />
        ),
    },
    {
        title: "Pattern Count",
        dataIndex: "regulation_pattern_count",
        key: "regulation_pattern_count",
        align: "center",
        sorter: true,
    },
    {
        title: "Dominant Count",
        dataIndex: "dominant_regulation_count",
        key: "dominant_regulation_count",
        align: "center",
        sorter: true,
    },
    {
        title: "Consistency",
        dataIndex: "regulation_consistent",
        key: "regulation_consistent",
        align: "center",
        render: value => (
            <BasicChip
                value={
                    value
                        ? "Consistent"
                        : "Inconsistent"
                }
                color={value ? "green" : "default"}
            />
        ),
    },
];


const AxisRecurrentTable = () => {
    const [isShowLeft, setIsShowLeft] = useState(true);

    const {
        meta,
        patternMeta,
        filterOptions,
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
    } = useAxisRecurrentRecords();

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

    if (isMetaError) {
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
                        rowKey="id"
                        columns={columns}
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
                            showTotal: total =>
                                `${total} recurrent axes`,
                        }}
                        onChange={handleTableChange}
                    />
                </Stack>
            }
        />
    );
};

export default AxisRecurrentTable;
