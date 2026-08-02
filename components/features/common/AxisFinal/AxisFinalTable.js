"use client";

import { useMemo } from "react";
import { Button, Empty, Popover, Table, Tooltip } from "antd";

import BasicChip from "@/components/ui/chips/BasicChip";
import EllipsisText from "@/components/common/text/EllipsisText";
import { SearchOutlined } from "@ant-design/icons"
import Link from "next/link"

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

const PROJECT_MATCH_COLUMN_WIDTH = 400;
const PROJECT_MATCH_COLLAPSE_THRESHOLD = 2;

const isNoneGroupType = (value) => {
    return String(value ?? "").trim().toLowerCase() === "none";
};

const getProjectMatchChipColor = (match) => {
    const source = String(match?.source ?? "").toUpperCase();

    if (source === "TCGA") {
        return "blue";
    }

    if (source === "TIMEDB") {
        return "purple";
    }

    return "default";
};

const getProjectMatchURL = (match) => {
    const datasetName = String(
        match?.dataset_name ?? ""
    ).trim();

    if (!datasetName) {
        return null;
    }

    const params = new URLSearchParams({
        dataset: datasetName,
    });

    const moduleName = String(
        match?.module ?? ""
    ).trim().toLowerCase();

    const groupType = String(
        match?.group_type ?? ""
    ).trim().toLowerCase();

    if (
        moduleName === "module3" &&
        ["grade", "stage"].includes(groupType)
    ) {
        params.set("groupBy", groupType);
    }

    return (
        `/database/dataset/annotation?${params.toString()}`
    );
};

const getProjectMatchLabel = (match) => {
    if (!match) {
        return "-";
    }

    const datasetName = renderEmpty(match.dataset_name);
    const groupType = String(match.group_type ?? "").trim();
    const groupBy = String(match.group_by ?? "").trim();

    if (!groupType || isNoneGroupType(groupType)) {
        return datasetName;
    }

    if (groupBy) {
        return `${datasetName} · ${groupBy}`;
    }

    return `${datasetName} · ${groupType}`;
};

const ProjectMatchChip = ({
    match,
    color,
}) => {
    const url = getProjectMatchURL(match);

    const chip = (
        <BasicChip
            value={getProjectMatchLabel(match)}
            color={
                color ||
                getProjectMatchChipColor(match)
            }
            style={{
                cursor: "pointer",
            }}
        />
    );

    if (!url) {
        return chip;
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "inline-flex",
                textDecoration: "none",
                cursor: "pointer",
            }}
            onClick={event => {
                event.stopPropagation();
            }}
        >
            {chip}
        </a>
    );
};

const ProjectMatchChipList = ({
    matches,
    justifyContent = "center",
}) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent,
                gap: 8,
                flexWrap: "wrap",
            }}
        >
            {matches.map((match, index) => (
                <ProjectMatchChip
                    key={[
                        match?.project_id,
                        match?.occurrence_id,
                        match?.source,
                        match?.module,
                        match?.dataset_name,
                        match?.group_type,
                        match?.group_by,
                        index,
                    ].join("-")}
                    match={match}
                />
            ))}
        </div>
    );
};

const RemainingProjectMatches = ({
    matches,
}) => {
    return (
        <div
            style={{
                width: 360,
                maxWidth: "70vw",
                maxHeight: 320,
                overflowY: "auto",
                padding: 4,
            }}
        >
            <ProjectMatchChipList
                matches={matches}
                justifyContent="flex-start"
            />
        </div>
    );
};

const hasMatchedProject = record => {
    const matches = Array.isArray(
        record?.dataset_project_matches
    )
        ? record.dataset_project_matches
        : [];

    const reportedMatchCount = Number(
        record?.dataset_project_match_count ??
        matches.length
    );

    return (
        Number.isFinite(reportedMatchCount)
            ? reportedMatchCount > 0
            : matches.length > 0
    );
};


const getRecurrentAxisSearchPattern = record => {
    if (!record) {
        return null;
    }

    /*
     * Recurrent ceRNA search pattern:
     * miRNA|mRNA|lncRNA|circRNA
     *
     * Empty values must remain empty segments.
     */
    const patternParts = [
        record.miRNA,
        record.mRNA,
        record.lncRNA,
        record.circRNA,
    ].map(value => String(value ?? "").trim());

    const hasRequiredAxisFields = (
        patternParts[0] &&
        patternParts[1] &&
        (
            patternParts[2] ||
            patternParts[3]
        )
    );

    if (!hasRequiredAxisFields) {
        return null;
    }

    return patternParts.join("|");
};


const getRecurrentAxisSearchURL = record => {
    const pattern = getRecurrentAxisSearchPattern(record);

    if (!pattern) {
        return null;
    }

    const params = new URLSearchParams({
        search: pattern,
    });

    return (
        `/database/recurrentceRNA?${params.toString()}`
    );
};

const renderRecurrentAxisAction = (_, record) => {
    const matched = hasMatchedProject(record);
    const url = getRecurrentAxisSearchURL(record);

    if (!matched) {
        return (
            <Tooltip
                title={
                    "This axis has no matched project, " +
                    "so no recurrent ceRNA record is available."
                }
            >
                {/*
                 * Disabled Button cannot trigger Tooltip directly,
                 * so it must be wrapped by an element.
                 */}
                <span
                    style={{
                        display: "inline-flex",
                    }}
                >
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        disabled
                    >
                        Recurrent
                    </Button>
                </span>
            </Tooltip>
        );
    }

    if (!url) {
        return (
            <Tooltip
                title={
                    "The RNA fields required to build the " +
                    "recurrent ceRNA search pattern are incomplete."
                }
            >
                <span
                    style={{
                        display: "inline-flex",
                    }}
                >
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        disabled
                    >
                        Recurrent
                    </Button>
                </span>
            </Tooltip>
        );
    }

    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={event => {
                event.stopPropagation();
            }}
        >
            <Button
                type="primary"
                icon={<SearchOutlined />}
            >
                Recurrent
            </Button>
        </Link>
    );
};

const renderProjectMatchChips = (_, record) => {
    const matches = Array.isArray(
        record?.dataset_project_matches
    )
        ? record.dataset_project_matches
        : [];

    const reportedMatchCount = Number(
        record?.dataset_project_match_count ??
        matches.length
    );

    const matchCount = Number.isFinite(
        reportedMatchCount
    )
        ? reportedMatchCount
        : matches.length;

    if (matchCount <= 0 || matches.length === 0) {
        return (
            <BasicChip
                value="No match"
                color="default"
            />
        );
    }

    /*
     * One or two matches:
     * show all returned project chips directly.
     */
    if (
        matchCount <= PROJECT_MATCH_COLLAPSE_THRESHOLD
    ) {
        return (
            <ProjectMatchChipList
                matches={matches.slice(0, matchCount)}
            />
        );
    }

    /*
     * More than two matches:
     * show the first project and collapse all remaining
     * projects into a Popover.
     */
    const firstMatch = matches[0];
    const remainingMatches = matches.slice(1);

    /*
     * The backend may limit dataset_project_matches while keeping
     * dataset_project_match_count as the complete count.
     */
    const remainingCount = Math.max(
        matchCount - 1,
        0,
    );

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
            }}
        >
            <ProjectMatchChip
                match={firstMatch}
            />

            <Popover
                trigger="click"
                placement="bottomRight"
                title={`Matched Projects (${remainingCount})`}
                content={
                    remainingMatches.length > 0 ? (
                        <RemainingProjectMatches
                            matches={remainingMatches}
                        />
                    ) : (
                        <div>
                            No additional project details available.
                        </div>
                    )
                }
            >
                <span
                    style={{
                        display: "inline-flex",
                        cursor: "pointer",
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                        event.stopPropagation();
                    }}
                    onKeyDown={event => {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.stopPropagation();
                        }
                    }}
                >
                    <BasicChip
                        value={`+${remainingCount} Projects`}
                        color="gold"
                    />
                </span>
            </Popover>
        </div>
    );
};

const AxisFinalTable = ({
    rows = [],
    columns: visibleColumnKeys = [],
    loading = false,
    showProjectMatches = false,
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

        const dataColumns = visibleColumnKeySet
            ? allColumns.filter(column =>
                visibleColumnKeySet.has(column.dataIndex)
            )
            : allColumns;

        if (!showProjectMatches) {
            return dataColumns;
        }

        return [
            ...dataColumns,
            {
                title: "Matched Projects",
                dataIndex: "dataset_project_matches",
                key: "dataset_project_matches",
                width: PROJECT_MATCH_COLUMN_WIDTH,
                align: "center",
                fixed: "right",
                sorter: (a, b) => {
                    return Number(
                        a?.dataset_project_match_count ?? 0
                    ) - Number(
                        b?.dataset_project_match_count ?? 0
                    );
                },
                render: renderProjectMatchChips,
            },
            {
                title: "Action",
                key: "recurrent_axis_action",
                width: 140,
                align: "center",
                fixed: "right",
                render: renderRecurrentAxisAction,
            },
        ];
    }, [
        visibleColumnKeySet,
        axisTypeFilters,
        axisRegulationFilters,
        mRNARegulationFilters,
        miRNARegulationFilters,
        lncRNARegulationFilters,
        circRNARegulationFilters,
        showProjectMatches,
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
