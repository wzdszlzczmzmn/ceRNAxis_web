import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { Stack } from "@mui/system"
import { Button } from "antd"
import { FileTextOutlined, ProfileOutlined } from "@ant-design/icons"

export const DATASET_GENE_BIO_TYPES = ["mRNA", "miRNA", "lncRNA", "circRNA"]

export const DATASET_METADATA_FUSE_KEYS = [
    "dataset",
    "programme",
    "obs_type",
    "reference",
    "cancer_type",
    "cancer_type_full_name",
    "gene_bio_type",
    "workflow",
    "sample_nums",
    "cell_nums",
    "spot_nums",
]

export const DATASET_METADATA_FUSE_OPTIONS = {
    keys: DATASET_METADATA_FUSE_KEYS,
    isCaseSensitive: false,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 1,
}

export const MULTI_VALUE_FIELDS = new Set([
    "programme",
    "obs_type",
    "reference",
    "cancer_type",
    "workflow",
])

export const FILTER_FIELDS = [
    "programme",
    "obs_type",
    "reference",
    "cancer_type",
]

export const FILTER_LABEL_MAP = {
    programme: "Programme",
    obs_type: "Observation Type",
    reference: "Reference",
    cancer_type: "Cancer Type",
}

const normalizeEmpty = (value, fallback = "NA") => {
    if (value === null || value === undefined || value === "") {
        return fallback
    }

    return value
}

const safeCompare = (a, b, key) => {
    const av = a?.[key] == null ? "" : String(a[key])
    const bv = b?.[key] == null ? "" : String(b[key])
    return av.localeCompare(bv)
}

const numberCompare = (a, b, key) => {
    return (Number(a?.[key]) || 0) - (Number(b?.[key]) || 0)
}

const renderNumber = (value) => {
    return (
        <EllipsisText text={value ?? 0} />
    )
}

export const getDatasetMetadataColumns = (geneBioType) => {
    const columns = [
        {
            title: "Dataset",
            dataIndex: "dataset",
            fixed: "left",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "dataset"),
            render: value => (
                <BasicChip
                    value={value}
                    color="purple"
                />
            ),
        },
        {
            title: "Programme",
            dataIndex: "programme",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "programme"),
            render: value => (
                <EllipsisText text={normalizeEmpty(value)} />
            ),
        },
        {
            title: "Observation Type",
            dataIndex: "obs_type",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "obs_type"),
            render: value => (
                <BasicChip
                    value={normalizeEmpty(value)}
                    color="gold"
                />
            ),
        },
        {
            title: "Reference",
            dataIndex: "reference",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "reference"),
            render: value => (
                <BasicChip
                    value={normalizeEmpty(value)}
                    color="green"
                />
            ),
        },
        {
            title: "Cancer Type",
            dataIndex: "cancer_type",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "cancer_type"),
            render: value => (
                <EllipsisText text={normalizeEmpty(value)} />
            ),
        },
        {
            title: "Cancer Type Full Name",
            dataIndex: "cancer_type_full_name",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "cancer_type_full_name"),
            render: value => (
                <EllipsisText text={normalizeEmpty(value)} />
            ),
        },
        {
            title: "Gene Bio Type",
            dataIndex: "gene_bio_type",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "gene_bio_type"),
            render: value => (
                <BasicChip
                    value={normalizeEmpty(value)}
                    color="blue"
                />
            ),
        },
        {
            title: "Workflow",
            dataIndex: "workflow",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "workflow"),
            render: value => (
                <BasicChip
                    value={normalizeEmpty(value)}
                    color="volcano"
                />
            ),
        },
        {
            title: "Sample Num",
            dataIndex: "sample_nums",
            align: "center",
            sorter: (a, b) => numberCompare(a, b, "sample_nums"),
            render: renderNumber,
        },
        {
            title: "Cell Num",
            dataIndex: "cell_nums",
            align: "center",
            sorter: (a, b) => numberCompare(a, b, "cell_nums"),
            render: renderNumber,
        },
        {
            title: "Spot Num",
            dataIndex: "spot_nums",
            align: "center",
            sorter: (a, b) => numberCompare(a, b, "spot_nums"),
            render: renderNumber,
        },
        {
            title: "Action",
            key: "operation",
            fixed: "right",
            align: "center",
            render: (_, record) => {
                const dataset = record?.dataset

                return (
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            type="primary"
                            icon={<FileTextOutlined />}
                            href={`/database/dataset/detail?dataset=${encodeURIComponent(dataset)}`}
                        >
                            Detail
                        </Button>

                        {geneBioType === "mRNA" && (
                            <Button
                                icon={<ProfileOutlined />}
                                href={`/database/dataset/annotation?dataset=${encodeURIComponent(dataset)}`}
                            >
                                Annotation
                            </Button>
                        )}
                    </Stack>
                )
            },
        },
    ]

    return columns
}
