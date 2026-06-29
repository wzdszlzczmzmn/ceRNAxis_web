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

const formatNumber = (value, digits = 4) => {
    const num = toNumber(value);

    if (num === null) {
        return "-";
    }

    return num.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
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

const getPerturbationTypeColor = (value) => {
    const normalized = String(value ?? "").toUpperCase();

    if (normalized === "CP") {
        return "blue";
    }

    if (normalized === "KD") {
        return "purple";
    }

    if (normalized === "OE") {
        return "green";
    }

    return "default";
};

const renderCenteredEllipsis = (value) => {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <EllipsisText text={renderEmpty(value)} />
        </div>
    );
};

const renderPerturbationType = (value) => {
    return (
        <BasicChip
            value={renderEmpty(value)}
            color={getPerturbationTypeColor(value)}
        />
    );
};

const renderTau = (value) => {
    const num = toNumber(value);

    if (num === null) {
        return "-";
    }

    const color = num >= 0 ? "volcano" : "blue";

    return (
        <BasicChip
            value={formatNumber(num, 4)}
            color={color}
        />
    );
};

const DEFAULT_CMAP_COLUMN_ORDER = [
    "c_perturbation",
    "c_perturbation_name",
    "c_perturbation_type",
    "n_tau",
    "c_cell_line",
    "n_perturbation_size",
];

const FALLBACK_COLUMN_WIDTH = 180;

const buildFallbackColumn = (key) => {
    return {
        title: key,
        dataIndex: key,
        key,
        width: FALLBACK_COLUMN_WIDTH,
        align: "center",
        sorter: stringSorter(key),
        render: renderCenteredEllipsis,
    };
};

const CMapResultTable = ({
    rows = [],
    columns: visibleColumnKeys = [],
    loading = false,
}) => {
    const resolvedColumnKeys = useMemo(() => {
        if (Array.isArray(visibleColumnKeys) && visibleColumnKeys.length > 0) {
            return visibleColumnKeys;
        }

        if (rows.length > 0) {
            return Object.keys(rows[0]);
        }

        return DEFAULT_CMAP_COLUMN_ORDER;
    }, [visibleColumnKeys, rows]);

    const perturbationTypeFilters = useMemo(() => {
        return getColumnFilters(rows, "c_perturbation_type");
    }, [rows]);

    const cellLineFilters = useMemo(() => {
        return getColumnFilters(rows, "c_cell_line");
    }, [rows]);

    const tableColumns = useMemo(() => {
        const columnMap = {
            c_perturbation: {
                title: "Perturbation",
                dataIndex: "c_perturbation",
                key: "c_perturbation",
                width: 360,
                align: "center",
                sorter: stringSorter("c_perturbation"),
                render: renderCenteredEllipsis,
            },
            c_perturbation_name: {
                title: "Perturbation Name",
                dataIndex: "c_perturbation_name",
                key: "c_perturbation_name",
                width: 320,
                align: "center",
                sorter: stringSorter("c_perturbation_name"),
                render: renderCenteredEllipsis,
            },
            c_perturbation_type: {
                title: "Type",
                dataIndex: "c_perturbation_type",
                key: "c_perturbation_type",
                width: 130,
                align: "center",
                filters: perturbationTypeFilters,
                onFilter: (value, record) =>
                    String(record.c_perturbation_type ?? "") === String(value),
                sorter: stringSorter("c_perturbation_type"),
                render: renderPerturbationType,
            },
            n_tau: {
                title: "Tau",
                dataIndex: "n_tau",
                key: "n_tau",
                width: 130,
                align: "center",
                sorter: numberSorter("n_tau"),
                defaultSortOrder: "descend",
                render: renderTau,
            },
            c_cell_line: {
                title: "Cell Line",
                dataIndex: "c_cell_line",
                key: "c_cell_line",
                width: 150,
                align: "center",
                filters: cellLineFilters,
                onFilter: (value, record) =>
                    String(record.c_cell_line ?? "") === String(value),
                sorter: stringSorter("c_cell_line"),
                render: value => (
                    <BasicChip
                        value={renderEmpty(value)}
                        color="gold"
                    />
                ),
            },
            n_perturbation_size: {
                title: "Perturbation Size",
                dataIndex: "n_perturbation_size",
                key: "n_perturbation_size",
                width: 180,
                align: "center",
                sorter: numberSorter("n_perturbation_size"),
                render: value => formatNumber(value, 0),
            },
        };

        return resolvedColumnKeys.map(key => {
            return columnMap[key] ?? buildFallbackColumn(key);
        });
    }, [
        resolvedColumnKeys,
        perturbationTypeFilters,
        cellLineFilters,
    ]);

    if (!loading && rows.length === 0) {
        return <Empty description="No CMap result available." />;
    }

    return (
        <Table
            rowKey={(record, index) =>
                [
                    record.c_perturbation,
                    record.c_cell_line,
                    record.n_tau,
                    index,
                ].join("-")
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

export default CMapResultTable;
