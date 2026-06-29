import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { Tag } from "antd"

const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === ""
}

const renderEmpty = (value) => {
    return isEmptyValue(value) ? "--" : value
}

export const TISCH2_PREFERRED_COLUMNS = [
    "cell_id",
    "UMAP_1",
    "UMAP_2",
    "Cluster",
    "Celltype (malignancy)",
    "Celltype (major-lineage)",
    "Celltype (minor-lineage)",
    "Patient",
    "Sample",
    "Tissue",
]

export const SCTML_PREFERRED_COLUMNS = [
    "spot_id",
    "c_cell_type",
    "c_cell_type_confidence",
    "c_donor",
    "c_leiden",
    "c_malignancy",
    "c_cell_label",
    "n_spatial_x",
    "n_spatial_y",
]

const getPreferredColumns = (expressionMode) => {
    const normalizedMode = String(expressionMode || "").toLowerCase()

    if (normalizedMode === "tisch2") {
        return TISCH2_PREFERRED_COLUMNS
    }

    if (normalizedMode === "sctml") {
        return SCTML_PREFERRED_COLUMNS
    }

    return []
}

const renderText = (value) => (
    <EllipsisText text={renderEmpty(value)} />
)

const renderChip = (value, color = "blue") => (
    <BasicChip
        value={renderEmpty(value)}
        color={color}
    />
)

const renderTag = (value, color = "default") => (
    <Tag
        color={color}
        style={{ marginInlineEnd: 0 }}
    >
        {renderEmpty(value)}
    </Tag>
)

const LARGE_META_COLUMN_CONFIG = {
    cell_id: {
        title: "Cell ID",
        width: 300,
        fixed: "left",
        render: value => renderChip(value, "volcano"),
    },
    spot_id: {
        title: "Spot ID",
        width: 360,
        fixed: "left",
        render: value => renderChip(value, "volcano"),
    },

    UMAP_1: {
        title: "UMAP 1",
        width: 120,
        render: renderText,
    },
    UMAP_2: {
        title: "UMAP 2",
        width: 120,
        render: renderText,
    },
    Cluster: {
        title: "Cluster",
        width: 120,
        render: value => renderTag(value, "purple"),
    },

    "Celltype (malignancy)": {
        title: "Malignancy",
        width: 180,
        render: value => renderChip(value, "gold"),
    },
    "Celltype (major-lineage)": {
        title: "Major Lineage",
        width: 190,
        render: value => renderTag(value, "blue"),
    },

    "Celltype (minor-lineage)": {
        title: "Minor Lineage",
        width: 190,
        render: value => renderTag(value, "green"),
    },
    Patient: {
        title: "Patient",
        width: 160,
        render: renderText,
    },
    Sample: {
        title: "Sample",
        width: 180,
        render: value => renderChip(value, "blue"),
    },
    Tissue: {
        title: "Tissue",
        width: 140,
        render: value => renderChip(value, "orange"),
    },

    c_cell_type: {
        title: "Cell Type",
        width: 180,
        render: value => renderChip(value, "blue"),
    },
    c_cell_type_confidence: {
        title: "Confidence",
        width: 150,
        render: value => renderChip(value, "gold"),
    },
    c_donor: {
        title: "Donor",
        width: 340,
        render: renderText,
    },
    c_leiden: {
        title: "Leiden",
        width: 120,
        render: value => renderTag(value, "purple"),
    },
    c_malignancy: {
        title: "Malignancy",
        width: 150,
        render: value => renderChip(value, "volcano"),
    },
    c_cell_label: {
        title: "Cell Label",
        width: 180,
        render: value => renderChip(value, "green"),
    },
    n_spatial_x: {
        title: "Spatial X",
        width: 130,
        render: renderText,
    },
    n_spatial_y: {
        title: "Spatial Y",
        width: 130,
        render: renderText,
    },
}

const buildDynamicColumn = (column) => {
    return {
        title: column,
        dataIndex: column,
        key: column,
        width: 180,
        align: "center",
        render: renderText,
    }
}

const buildConfiguredColumn = (column) => {
    const config = LARGE_META_COLUMN_CONFIG[column]

    if (!config) {
        return buildDynamicColumn(column)
    }

    return {
        title: config.title ?? column,
        dataIndex: column,
        key: column,
        width: config.width ?? 180,
        fixed: config.fixed,
        align: "center",
        render: config.render ?? renderText,
    }
}

export const buildLargeMetaColumns = ({
    columns = [],
    expressionMode,
}) => {
    const actualColumnSet = new Set(columns)
    const preferredColumns = getPreferredColumns(expressionMode)
    const preferredColumnSet = new Set(preferredColumns)

    const configuredColumns = preferredColumns
        .filter(column => actualColumnSet.has(column))
        .map(column => buildConfiguredColumn(column))

    const dynamicColumns = columns
        .filter(column => !preferredColumnSet.has(column))
        .map(column => buildDynamicColumn(column))

    return [
        ...configuredColumns,
        ...dynamicColumns,
    ]
}
