import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { Stack } from "@mui/system"
import { Button } from "antd"
import { FileTextOutlined } from "@ant-design/icons"

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
    "reference",
    "cancer_type",
]

export const FILTER_LABEL_MAP = {
    programme: "Programme",
    reference: "Reference",
    cancer_type: "Cancer Type",
}

const safeCompare = (a, b, key) => {
    const av = a?.[key] == null ? "" : String(a[key])
    const bv = b?.[key] == null ? "" : String(b[key])
    return av.localeCompare(bv)
}

const numberCompare = (a, b, key) => {
    return (Number(a?.[key]) || 0) - (Number(b?.[key]) || 0)
}

export const getDatasetMetadataColumns = (geneBioType) => {
    const columns = [
        {
            title: "Dataset",
            dataIndex: "dataset",
            fixed: "left",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "dataset"),
            render: value => <BasicChip value={value} color="purple" />,
        },
        {
            title: "Programme",
            dataIndex: "programme",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "programme"),
            render: value => <EllipsisText text={value} />,
        },
        {
            title: "Observation Type",
            dataIndex: "obs_type",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "obs_type"),
            render: value => <BasicChip value={value} color="gold"/> ,
        },
        {
            title: "Reference",
            dataIndex: "reference",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "reference"),
            render: value => <BasicChip value={value === '' ? 'NA' : value} color="green"/>,
        },
        {
            title: "Cancer Type",
            dataIndex: "cancer_type",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "cancer_type"),
            render: value => <EllipsisText text={value} />,
        },
        {
            title: "Cancer Type Full Name",
            dataIndex: "cancer_type_full_name",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "cancer_type_full_name"),
            render: value => <EllipsisText text={value} />,
        },
        {
            title: "Gene Bio Type",
            dataIndex: "gene_bio_type",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "gene_bio_type"),
            render: value => <BasicChip value={value} color="blue" />,
        },
        {
            title: "Workflow",
            dataIndex: "workflow",
            align: "center",
            sorter: (a, b) => safeCompare(a, b, "workflow"),
            render: value => <BasicChip value={value === '' ? 'NA' : value} color="volcano" />,
        },
        {
            title: "Sample Num",
            dataIndex: "sample_nums",
            align: "center",
            sorter: (a, b) => numberCompare(a, b, "sample_nums"),
            render: value => <EllipsisText text={value} />,
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <Stack direction="row" spacing={2} justifyContent='center'>
                    <Button
                        type='primary'
                        icon={<FileTextOutlined/>}
                        href={`/database/dataset/detail?dataset=${record['dataset']}`}
                    >
                        Detail
                    </Button>

                </Stack>
            )
        }
    ]

    if (geneBioType === "mRNA") {
        return columns
    }

    return columns
}
