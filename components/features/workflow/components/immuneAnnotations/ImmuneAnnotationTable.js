"use client";

import { useMemo, useState } from "react";
import { Empty, Flex, Input, Space, Table, Typography } from "antd";
import Fuse from "fuse.js";
import BasicChip from "@/components/ui/chips/BasicChip"

const { Search } = Input;
const { Text } = Typography;

const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

const formatDecimalOrScientific = (value) => {
    const num = toNumber(value);

    if (num === null) return "-";

    if (num === 0) return "0";

    if (Math.abs(num) < 0.01) {
        return num.toExponential(2);
    }

    return num.toFixed(5).replace(/0+$/, "").replace(/\.$/, "");
};

const formatNumber = (value, digits = 3) => {
    const num = toNumber(value);

    if (num === null) return "-";

    return num.toFixed(digits);
};

const getColumnFilters = (rows, key) => {
    return Array.from(
        new Set(
            rows
                .map(row => row[key])
                .filter(value => value !== undefined && value !== null && value !== "")
                .map(String)
        )
    )
        .sort((a, b) => a.localeCompare(b))
        .map(value => ({
            text: value,
            value,
        }));
};

const getEvidenceChipColor = (evidence) => {
    if (evidence === "Validated") return "green";
    if (evidence === "Predicted") return "orange";

    return "default";
};

const ImmuneAnnotationTable = ({
    rows = [],
    loading = false,
    mapInfo,
}) => {
    const [searchText, setSearchText] = useState("");

    const cancerFilters = useMemo(() => {
        return getColumnFilters(rows, "Cancer");
    }, [rows]);

    const pathwayFilters = useMemo(() => {
        return getColumnFilters(rows, "Immune checkpointPathway");
    }, [rows]);

    const evidenceFilters = useMemo(() => {
        return getColumnFilters(rows, "Evidence");
    }, [rows]);

    const fuse = useMemo(() => {
        return new Fuse(rows, {
            keys: [
                "miRNA",
                "Immune checkpointGene",
                "Cancer",
                "Immune checkpointPathway",
                "Evidence",
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 1,
        });
    }, [rows]);

    const filteredRows = useMemo(() => {
        const keyword = searchText.trim();

        if (!keyword) {
            return rows;
        }

        return fuse.search(keyword).map(result => result.item);
    }, [rows, fuse, searchText]);

    const columns = useMemo(() => [
        {
            title: "miRNA",
            dataIndex: "miRNA",
            key: "miRNA",
            align: "center",
            width: 190,
            fixed: "left",
            sorter: (a, b) =>
                String(a.miRNA ?? "").localeCompare(String(b.miRNA ?? "")),
            render: value => (
                <BasicChip
                    value={value || "-"}
                    color="purple"
                />
            ),
        },
        {
            title: "Checkpoint Gene",
            dataIndex: "Immune checkpointGene",
            key: "Immune checkpointGene",
            align: "center",
            width: 190,
            sorter: (a, b) =>
                String(a["Immune checkpointGene"] ?? "").localeCompare(
                    String(b["Immune checkpointGene"] ?? "")
                ),
            render: value => (
                <BasicChip
                    value={value || "-"}
                    color="blue"
                />
            ),
        },
        {
            title: "Correlation",
            dataIndex: "CorrelationCoefficient",
            key: "CorrelationCoefficient",
            width: 140,
            align: "center",
            sorter: (a, b) =>
                (toNumber(a.CorrelationCoefficient) ?? 0) -
                (toNumber(b.CorrelationCoefficient) ?? 0),
            render: value => formatNumber(value, 3),
        },
        {
            title: "P-value",
            dataIndex: "P-value",
            key: "P-value",
            width: 130,
            align: "center",
            sorter: (a, b) =>
                (toNumber(a["P-value"]) ?? 0) -
                (toNumber(b["P-value"]) ?? 0),
            render: value => formatDecimalOrScientific(value),
        },
        {
            title: "Q-value",
            dataIndex: "Q-value",
            key: "Q-value",
            width: 130,
            align: "center",
            sorter: (a, b) =>
                (toNumber(a["Q-value"]) ?? 0) -
                (toNumber(b["Q-value"]) ?? 0),
            render: value => formatDecimalOrScientific(value),
        },
        {
            title: "Cancer",
            dataIndex: "Cancer",
            key: "Cancer",
            width: 110,
            align: "center",
            filters: cancerFilters,
            onFilter: (value, record) =>
                String(record.Cancer ?? "") === String(value),
            sorter: (a, b) =>
                String(a.Cancer ?? "").localeCompare(String(b.Cancer ?? "")),
        },
        {
            title: "Checkpoint Pathway",
            dataIndex: "Immune checkpointPathway",
            key: "Immune checkpointPathway",
            width: 280,
            align: "center",
            ellipsis: true,
            filters: pathwayFilters,
            onFilter: (value, record) =>
                String(record["Immune checkpointPathway"] ?? "") === String(value),
            sorter: (a, b) =>
                String(a["Immune checkpointPathway"] ?? "").localeCompare(
                    String(b["Immune checkpointPathway"] ?? "")
                ),
        },
        {
            title: "Evidence",
            dataIndex: "Evidence",
            key: "Evidence",
            width: 130,
            align: "center",
            filters: evidenceFilters,
            onFilter: (value, record) =>
                String(record.Evidence ?? "") === String(value),
            sorter: (a, b) =>
                String(a.Evidence ?? "").localeCompare(String(b.Evidence ?? "")),
            render: value => (
                <BasicChip
                    value={value || "-"}
                    color={getEvidenceChipColor(value)}
                />
            ),
        },
    ], [
        cancerFilters,
        pathwayFilters,
        evidenceFilters,
    ]);

    if (!loading && !mapInfo) {
        return (
            <Empty description="Please select an immune annotation file." />
        );
    }

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Flex
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={12}
            >
                <Text type="secondary" style={{ fontSize: '16px' }}>
                    Showing {filteredRows.length} / {rows.length} records
                </Text>

                <Search
                    allowClear
                    placeholder="Search miRNA, checkpoint gene, pathway, cancer, evidence..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 460, maxWidth: "100%" }}
                />
            </Flex>

            <Table
                rowKey={(record, index) => `${mapInfo}-${index}`}
                columns={columns}
                dataSource={filteredRows}
                loading={loading}
                scroll={{ x: 1400 }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    showTotal: total => `${total} records`,
                }}
            />
        </Space>
    );
};

export default ImmuneAnnotationTable;
