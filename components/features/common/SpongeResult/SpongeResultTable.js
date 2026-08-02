"use client";

import { useMemo } from "react";
import {
    Empty,
    Table,
    Tooltip,
} from "antd";

import BasicChip from "@/components/ui/chips/BasicChip";
import EllipsisText from "@/components/common/text/EllipsisText";


const DEFAULT_PAGE_SIZE = 10;


const isEmptyValue = value => {
    return (
        value === null ||
        value === undefined ||
        String(value).trim() === ""
    );
};


const renderEmpty = value => {
    return isEmptyValue(value)
        ? "-"
        : value;
};


const toNumber = value => {
    if (isEmptyValue(value)) {
        return null;
    }

    const numberValue = Number(value);

    return Number.isFinite(numberValue)
        ? numberValue
        : null;
};


const formatScore = value => {
    const numberValue = toNumber(value);

    if (numberValue === null) {
        return "-";
    }

    if (
        numberValue !== 0 &&
        Math.abs(numberValue) < 0.0001
    ) {
        return numberValue.toExponential(4);
    }

    return numberValue
        .toFixed(6)
        .replace(/0+$/, "")
        .replace(/\.$/, "");
};


const stringSorter = key => {
    return (rowA, rowB) => {
        return String(
            rowA?.[key] ?? ""
        ).localeCompare(
            String(rowB?.[key] ?? "")
        );
    };
};


const numberSorter = key => {
    return (rowA, rowB) => {
        const valueA = toNumber(rowA?.[key]);
        const valueB = toNumber(rowB?.[key]);

        if (valueA === null && valueB === null) {
            return 0;
        }

        if (valueA === null) {
            return -1;
        }

        if (valueB === null) {
            return 1;
        }

        return valueA - valueB;
    };
};


const getColumnFilters = (
    rows,
    key,
) => {
    return Array.from(
        new Set(
            rows
                .map(row => row?.[key])
                .filter(value => !isEmptyValue(value))
                .map(String)
        )
    )
        .sort((valueA, valueB) => {
            return valueA.localeCompare(valueB);
        })
        .map(value => ({
            text: value,
            value,
        }));
};


const renderGeneChip = (
    value,
    color,
) => {
    if (isEmptyValue(value)) {
        return "-";
    }

    return (
        <BasicChip
            value={String(value)}
            color={color}
        />
    );
};


const renderAxisID = value => {
    if (isEmptyValue(value)) {
        return "-";
    }

    return (
        <Tooltip title={String(value)}>
            <div>
                <EllipsisText
                    text={String(value)}
                />
            </div>
        </Tooltip>
    );
};


const renderScore = value => {
    return (
        <span
            style={{
                fontVariantNumeric: "tabular-nums",
                fontWeight: 500,
            }}
        >
            {formatScore(value)}
        </span>
    );
};


const SpongeResultTable = ({
    rows = [],
    columns: visibleColumnKeys = [],
    loading = false,
}) => {
    const normalizedRows = useMemo(() => {
        return Array.isArray(rows)
            ? rows
            : [];
    }, [rows]);

    const visibleColumnKeySet = useMemo(() => {
        if (
            !Array.isArray(visibleColumnKeys) ||
            visibleColumnKeys.length === 0
        ) {
            return null;
        }

        return new Set(visibleColumnKeys);
    }, [visibleColumnKeys]);

    const axisTypeFilters = useMemo(() => {
        return getColumnFilters(
            normalizedRows,
            "axis_type",
        );
    }, [normalizedRows]);

    const tableColumns = useMemo(() => {
        const allColumns = [
            {
                title: "Axis ID",
                dataIndex: "axis_id",
                key: "axis_id",
                width: 300,
                align: "center",
                sorter: stringSorter("axis_id"),
                render: renderAxisID,
            },
            {
                title: "Axis Type",
                dataIndex: "axis_type",
                key: "axis_type",
                width: 210,
                align: "center",
                filters: axisTypeFilters,
                onFilter: (value, record) => {
                    return (
                        String(record?.axis_type ?? "") ===
                        String(value)
                    );
                },
                sorter: stringSorter("axis_type"),
                render: value => (
                    <BasicChip
                        value={renderEmpty(value)}
                        color="purple"
                    />
                ),
            },
            {
                title: "mRNA",
                dataIndex: "mRNA",
                key: "mRNA",
                width: 170,
                align: "center",
                sorter: stringSorter("mRNA"),
                render: value => {
                    return renderGeneChip(
                        value,
                        "blue",
                    );
                },
            },
            {
                title: "miRNA",
                dataIndex: "miRNA",
                key: "miRNA",
                width: 190,
                align: "center",
                sorter: stringSorter("miRNA"),
                render: value => {
                    return renderGeneChip(
                        value,
                        "purple",
                    );
                },
            },
            {
                title: "lncRNA",
                dataIndex: "lncRNA",
                key: "lncRNA",
                width: 190,
                align: "center",
                sorter: stringSorter("lncRNA"),
                render: value => {
                    return renderGeneChip(
                        value,
                        "cyan",
                    );
                },
            },
            {
                title: "circRNA",
                dataIndex: "circRNA",
                key: "circRNA",
                width: 230,
                align: "center",
                sorter: stringSorter("circRNA"),
                render: value => {
                    return isEmptyValue(value)
                        ? "-"
                        : (
                            <EllipsisText
                                text={String(value)}
                            />
                        );
                },
            },
            {
                title: "Correlation",
                dataIndex: "cor",
                key: "cor",
                width: 150,
                align: "center",
                sorter: numberSorter("cor"),
                render: renderScore,
            },
            {
                title: "Partial Correlation",
                dataIndex: "pcor",
                key: "pcor",
                width: 180,
                align: "center",
                sorter: numberSorter("pcor"),
                render: renderScore,
            },
            {
                title: "Mediation Sensitivity",
                dataIndex: "mscor",
                key: "mscor",
                width: 190,
                align: "center",
                sorter: numberSorter("mscor"),
                render: renderScore,
            },
        ];

        if (!visibleColumnKeySet) {
            return allColumns;
        }

        return allColumns.filter(column => {
            return visibleColumnKeySet.has(
                column.dataIndex
            );
        });
    }, [
        axisTypeFilters,
        visibleColumnKeySet,
    ]);

    if (
        !loading &&
        normalizedRows.length === 0
    ) {
        return (
            <Empty
                description={
                    "No Sponge result available."
                }
            />
        );
    }

    return (
        <Table
            rowKey={(record, index) => {
                return (
                    record?.axis_id ||
                    [
                        record?.mRNA,
                        record?.miRNA,
                        record?.lncRNA,
                        record?.circRNA,
                        index,
                    ]
                        .map(value => value ?? "")
                        .join("-")
                );
            }}
            columns={tableColumns}
            dataSource={normalizedRows}
            loading={loading}
            scroll={{
                x: "max-content",
            }}
            pagination={{
                defaultPageSize: DEFAULT_PAGE_SIZE,
                showSizeChanger: true,
                pageSizeOptions: [
                    10,
                    20,
                    50,
                    100,
                ],
                showTotal: total => {
                    return `${total} records`;
                },
            }}
        />
    );
};


export default SpongeResultTable;
