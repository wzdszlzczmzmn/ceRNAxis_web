"use client";

import { useMemo } from "react";
import { Empty, Table } from "antd";

import BasicChip from "@/components/ui/chips/BasicChip";
import EllipsisText from "@/components/common/text/EllipsisText";

const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === "";
};

const toNumber = (value) => {
    if (isEmptyValue(value)) {
        return null;
    }

    const num = Number(value);

    return Number.isFinite(num) ? num : null;
};

const renderEmpty = (value) => {
    return isEmptyValue(value) ? "-" : value;
};

const formatLog2FC = (value) => {
    const num = toNumber(value);

    if (num === null) {
        return "-";
    }

    return num.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
};

const stringSorter = (key) => (a, b) => {
    return String(a?.[key] ?? "").localeCompare(String(b?.[key] ?? ""));
};

const numberSorter = (key) => (a, b) => {
    return (toNumber(a?.[key]) ?? -Infinity) -
        (toNumber(b?.[key]) ?? -Infinity);
};

const getColumnFilters = (rows, key) => {
    return Array.from(
        new Set(
            rows
                .map(row => row?.[key])
                .filter(value => !isEmptyValue(value))
                .map(String)
        )
    )
        .sort((a, b) => a.localeCompare(b))
        .map(value => ({
            text: value,
            value,
        }));
};

const getRegulationChipColor = (value) => {
    const normalized = String(value ?? "").toLowerCase();

    if (normalized === "up") {
        return "volcano";
    }

    if (normalized === "down") {
        return "blue";
    }

    if (normalized === "notsig" || normalized === "not_sig") {
        return "default";
    }

    return "default";
};

const renderRegulationChip = (value) => (
    <BasicChip
        value={renderEmpty(value)}
        color={getRegulationChipColor(value)}
    />
);

const renderGeneChip = (value, color) => (
    <BasicChip
        value={renderEmpty(value)}
        color={color}
    />
);

const AxisFinalTable = ({
    rows = [],
    columns: visibleColumnKeys = [],
    loading = false,
}) => {
    const visibleColumnKeySet = useMemo(() => {
        if (!Array.isArray(visibleColumnKeys) || visibleColumnKeys.length === 0) {
            return null;
        }

        return new Set(visibleColumnKeys);
    }, [visibleColumnKeys]);

    const axisTypeFilters = useMemo(() => {
        return getColumnFilters(rows, "axis_type");
    }, [rows]);

    const axisRegulationFilters = useMemo(() => {
        return getColumnFilters(rows, "axis_regulation");
    }, [rows]);

    const mRNARegulationFilters = useMemo(() => {
        return getColumnFilters(rows, "mRNA_regulation");
    }, [rows]);

    const miRNARegulationFilters = useMemo(() => {
        return getColumnFilters(rows, "miRNA_regulation");
    }, [rows]);

    const lncRNARegulationFilters = useMemo(() => {
        return getColumnFilters(rows, "lncRNA_regulation");
    }, [rows]);

    const circRNARegulationFilters = useMemo(() => {
        return getColumnFilters(rows, "circRNA_regulation");
    }, [rows]);

    const tableColumns = useMemo(() => {
        const allColumns = [
            {
                title: "Axis ID",
                dataIndex: "axis_id",
                key: "axis_id",
                width: 300,
                align: "center",
                sorter: stringSorter("axis_id"),
                render: value => <EllipsisText text={renderEmpty(value)} />,
            },
            {
                title: "Axis Type",
                dataIndex: "axis_type",
                key: "axis_type",
                width: 190,
                align: "center",
                filters: axisTypeFilters,
                onFilter: (value, record) =>
                    String(record.axis_type ?? "") === String(value),
                sorter: stringSorter("axis_type"),
                render: value => (
                    <BasicChip value={renderEmpty(value)} color="purple" />
                ),
            },
            {
                title: "Axis Regulation",
                dataIndex: "axis_regulation",
                key: "axis_regulation",
                width: 180,
                align: "center",
                filters: axisRegulationFilters,
                onFilter: (value, record) =>
                    String(record.axis_regulation ?? "") === String(value),
                sorter: stringSorter("axis_regulation"),
                render: value => (
                    <BasicChip value={renderEmpty(value)} color="gold" />
                ),
            },
            {
                title: "mRNA",
                dataIndex: "mRNA",
                key: "mRNA",
                width: 160,
                align: "center",
                sorter: stringSorter("mRNA"),
                render: value => renderGeneChip(value, "blue"),
            },
            {
                title: "mRNA log2FC",
                dataIndex: "mRNA_log2FC",
                key: "mRNA_log2FC",
                width: 140,
                align: "center",
                sorter: numberSorter("mRNA_log2FC"),
                render: formatLog2FC,
            },
            {
                title: "mRNA Regulation",
                dataIndex: "mRNA_regulation",
                key: "mRNA_regulation",
                width: 180,
                align: "center",
                filters: mRNARegulationFilters,
                onFilter: (value, record) =>
                    String(record.mRNA_regulation ?? "") === String(value),
                sorter: stringSorter("mRNA_regulation"),
                render: renderRegulationChip,
            },
            {
                title: "miRNA",
                dataIndex: "miRNA",
                key: "miRNA",
                width: 180,
                align: "center",
                sorter: stringSorter("miRNA"),
                render: value => renderGeneChip(value, "purple"),
            },
            {
                title: "miRNA log2FC",
                dataIndex: "miRNA_log2FC",
                key: "miRNA_log2FC",
                width: 160,
                align: "center",
                sorter: numberSorter("miRNA_log2FC"),
                render: formatLog2FC,
            },
            {
                title: "miRNA Regulation",
                dataIndex: "miRNA_regulation",
                key: "miRNA_regulation",
                width: 200,
                align: "center",
                filters: miRNARegulationFilters,
                onFilter: (value, record) =>
                    String(record.miRNA_regulation ?? "") === String(value),
                sorter: stringSorter("miRNA_regulation"),
                render: renderRegulationChip,
            },
            {
                title: "lncRNA",
                dataIndex: "lncRNA",
                key: "lncRNA",
                width: 180,
                align: "center",
                sorter: stringSorter("lncRNA"),
                render: value => renderGeneChip(value, "cyan"),
            },
            {
                title: "lncRNA log2FC",
                dataIndex: "lncRNA_log2FC",
                key: "lncRNA_log2FC",
                width: 160,
                align: "center",
                sorter: numberSorter("lncRNA_log2FC"),
                render: formatLog2FC,
            },
            {
                title: "lncRNA Regulation",
                dataIndex: "lncRNA_regulation",
                key: "lncRNA_regulation",
                width: 200,
                align: "center",
                filters: lncRNARegulationFilters,
                onFilter: (value, record) =>
                    String(record.lncRNA_regulation ?? "") === String(value),
                sorter: stringSorter("lncRNA_regulation"),
                render: renderRegulationChip,
            },
            {
                title: "circRNA",
                dataIndex: "circRNA",
                key: "circRNA",
                width: 220,
                align: "center",
                sorter: stringSorter("circRNA"),
                render: value => <EllipsisText text={renderEmpty(value)} />,
            },
            {
                title: "circRNA log2FC",
                dataIndex: "circRNA_log2FC",
                key: "circRNA_log2FC",
                width: 150,
                align: "center",
                sorter: numberSorter("circRNA_log2FC"),
                render: formatLog2FC,
            },
            {
                title: "circRNA Regulation",
                dataIndex: "circRNA_regulation",
                key: "circRNA_regulation",
                width: 200,
                align: "center",
                filters: circRNARegulationFilters,
                onFilter: (value, record) =>
                    String(record.circRNA_regulation ?? "") === String(value),
                sorter: stringSorter("circRNA_regulation"),
                render: renderRegulationChip,
            },
        ];

        if (!visibleColumnKeySet) {
            return allColumns;
        }

        return allColumns.filter(column =>
            visibleColumnKeySet.has(column.dataIndex)
        );
    }, [
        visibleColumnKeySet,
        axisTypeFilters,
        axisRegulationFilters,
        mRNARegulationFilters,
        miRNARegulationFilters,
        lncRNARegulationFilters,
        circRNARegulationFilters,
    ]);

    if (!loading && rows.length === 0) {
        return <Empty description="No ceRNA axis final result available." />;
    }

    return (
        <Table
            rowKey={(record, index) =>
                record.axis_id ||
                `${record.mRNA}-${record.miRNA}-${record.lncRNA}-${record.circRNA ?? ""}-${index}`
            }
            columns={tableColumns}
            dataSource={rows}
            loading={loading}
            scroll={{ x: "max-content" }}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                showTotal: total => `${total} records`,
            }}
        />
    );
};

export default AxisFinalTable;
