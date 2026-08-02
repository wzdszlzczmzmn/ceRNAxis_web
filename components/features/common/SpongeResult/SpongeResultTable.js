"use client";

import { useMemo } from "react";
import {
    Button,
    Empty,
    Popover,
    Table,
    Tooltip,
} from "antd";

import BasicChip from "@/components/ui/chips/BasicChip";
import EllipsisText from "@/components/common/text/EllipsisText";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";


const DEFAULT_PAGE_SIZE = 10;
const PROJECT_MATCH_COLUMN_WIDTH = 400;
const PROJECT_MATCH_COLLAPSE_THRESHOLD = 2;


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


const getProjectMatchData = record => {
    const referenceMatches = Array.isArray(
        record?.reference_context_matches
    )
        ? record.reference_context_matches
        : null;

    const legacyMatches = Array.isArray(
        record?.dataset_project_matches
    )
        ? record.dataset_project_matches
        : [];

    const matches = referenceMatches ?? legacyMatches;

    const reportedCount = Number(
        record?.reference_context_match_count
        ?? record?.dataset_project_match_count
        ?? matches.length
    );

    const matchCount = Number.isFinite(
        reportedCount
    )
        ? reportedCount
        : matches.length;

    return {
        matches,
        matchCount,
    };
};


const hasMatchedProject = record => {
    const {
        matches,
        matchCount,
    } = getProjectMatchData(record);

    return (
        matchCount > 0
        || matches.length > 0
    );
};


const isNoneGroupType = value => {
    return (
        String(value ?? "")
            .trim()
            .toLowerCase()
        === "none"
    );
};


const getProjectMatchSource = match => {
    return String(
        match?.dataset_source
        ?? match?.source
        ?? ""
    )
        .trim()
        .toUpperCase();
};


const getProjectMatchChipColor = match => {
    const source = getProjectMatchSource(match);

    if (source === "TCGA") {
        return "blue";
    }

    if (source === "TIMEDB") {
        return "purple";
    }

    return "default";
};


const getProjectMatchURL = match => {
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
    )
        .trim()
        .toLowerCase();

    const groupType = String(
        match?.group_type ?? ""
    )
        .trim()
        .toLowerCase();

    if (
        moduleName === "module3"
        && ["grade", "stage"].includes(
            groupType
        )
    ) {
        params.set("groupBy", groupType);
    }

    return (
        `/database/dataset/annotation?${params.toString()}`
    );
};


const getProjectMatchLabel = match => {
    if (!match) {
        return "-";
    }

    const datasetName = renderEmpty(
        match.dataset_name
    );

    const groupType = String(
        match.group_type ?? ""
    ).trim();

    const groupBy = String(
        match.group_by ?? ""
    ).trim();

    if (
        !groupType
        || isNoneGroupType(groupType)
    ) {
        return datasetName;
    }

    if (groupBy) {
        return `${datasetName} · ${groupBy}`;
    }

    return `${datasetName} · ${groupType}`;
};


const ProjectMatchChip = ({
    match,
}) => {
    const url = getProjectMatchURL(match);

    const chip = (
        <BasicChip
            value={getProjectMatchLabel(match)}
            color={getProjectMatchChipColor(
                match
            )}
            style={{
                cursor: url
                    ? "pointer"
                    : "default",
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
                        match?.project_key,
                        match?.context_id,
                        match?.context_presence_id,
                        match?.dataset_source,
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


const renderProjectMatchChips = (
    _,
    record,
) => {
    const {
        matches,
        matchCount,
    } = getProjectMatchData(record);

    if (
        matchCount <= 0
        || matches.length === 0
    ) {
        return (
            <BasicChip
                value="No match"
                color="default"
            />
        );
    }

    if (
        matchCount
        <= PROJECT_MATCH_COLLAPSE_THRESHOLD
    ) {
        return (
            <ProjectMatchChipList
                matches={matches.slice(
                    0,
                    matchCount,
                )}
            />
        );
    }

    const firstMatch = matches[0];
    const remainingMatches = matches.slice(1);
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
                title={
                    `Matched Projects (${remainingCount})`
                }
                content={
                    remainingMatches.length > 0
                        ? (
                            <RemainingProjectMatches
                                matches={
                                    remainingMatches
                                }
                            />
                        )
                        : (
                            <div>
                                No additional project
                                details available.
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
                            event.key === "Enter"
                            || event.key === " "
                        ) {
                            event.stopPropagation();
                        }
                    }}
                >
                    <BasicChip
                        value={
                            `+${remainingCount} Projects`
                        }
                        color="gold"
                    />
                </span>
            </Popover>
        </div>
    );
};


const getRecurrentAxisSearchPattern = record => {
    if (!record) {
        return null;
    }

    const returnedSignature = String(
        record.axis_signature ?? ""
    ).trim();

    if (returnedSignature) {
        return returnedSignature;
    }

    const patternParts = [
        record.miRNA,
        record.mRNA,
        record.lncRNA,
        record.circRNA,
    ].map(value => {
        return String(value ?? "").trim();
    });

    const hasRequiredAxisFields = (
        patternParts[0]
        && patternParts[1]
        && (
            patternParts[2]
            || patternParts[3]
        )
    );

    if (!hasRequiredAxisFields) {
        return null;
    }

    return patternParts.join("|");
};


const getRecurrentAxisSearchURL = record => {
    const pattern = (
        getRecurrentAxisSearchPattern(record)
    );

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


const DisabledRecurrentButton = ({
    tooltip,
}) => {
    return (
        <Tooltip title={tooltip}>
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
};


const renderRecurrentAxisAction = (
    _,
    record,
) => {
    if (!hasMatchedProject(record)) {
        return (
            <DisabledRecurrentButton
                tooltip={
                    "This axis has no matched project, " +
                    "so no recurrent ceRNA record is " +
                    "available."
                }
            />
        );
    }

    const url = getRecurrentAxisSearchURL(
        record
    );

    if (!url) {
        return (
            <DisabledRecurrentButton
                tooltip={
                    "The RNA fields required to build " +
                    "the recurrent ceRNA search pattern " +
                    "are incomplete."
                }
            />
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


const SpongeResultTable = ({
    rows = [],
    columns: visibleColumnKeys = [],
    loading = false,
    showProjectMatches = false,
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

        const dataColumns = visibleColumnKeySet
            ? allColumns.filter(column => {
                return visibleColumnKeySet.has(
                    column.dataIndex
                );
            })
            : allColumns;

        if (!showProjectMatches) {
            return dataColumns;
        }

        return [
            ...dataColumns,
            {
                title: "Matched Projects",
                dataIndex:
                    "reference_context_matches",
                key: "reference_context_matches",
                width:
                PROJECT_MATCH_COLUMN_WIDTH,
                align: "center",
                fixed: "right",
                sorter: (rowA, rowB) => {
                    return (
                        getProjectMatchData(rowA)
                            .matchCount
                        - getProjectMatchData(rowB)
                            .matchCount
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
                render:
                renderRecurrentAxisAction,
            },
        ];
    }, [
        axisTypeFilters,
        visibleColumnKeySet,
        showProjectMatches,
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
                    record?.axis_key ||
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
