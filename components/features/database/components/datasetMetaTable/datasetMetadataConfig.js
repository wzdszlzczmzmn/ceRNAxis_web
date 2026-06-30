import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { Stack } from "@mui/system"
import { Button, Dropdown } from "antd"
import { DownloadOutlined, DownOutlined, FileTextOutlined, ProfileOutlined } from "@ant-design/icons"
import {
    getDatasetDownloadUrl,
    getTCGAAnnotationDownloadUrl,
    getTIMEDBAnnotationDownloadUrl
} from "@/lib/api/database/datasetMetaTable"

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

const TCGA_ANNOTATION_DATASETS = new Set([
    "TCGA_ACC_mRNA",
    "TCGA_BRCA_mRNA",
    "TCGA_CHOL_mRNA",
    "TCGA_ESCA_mRNA",
    "TCGA_KICH_mRNA",
    "TCGA_KIRP_mRNA",
    "TCGA_LUAD_mRNA",
    "TCGA_MESO_mRNA",
    "TCGA_PRAD_mRNA",
    "TCGA_SKCM_mRNA",
    "TCGA_TGCT_mRNA",
    "TCGA_UVM_mRNA",
    "TCGA_BLCA_mRNA",
    "TCGA_CESC_mRNA",
    "TCGA_COAD_mRNA",
    "TCGA_HNSC_mRNA",
    "TCGA_KIRC_mRNA",
    "TCGA_LIHC_mRNA",
    "TCGA_LUSC_mRNA",
    "TCGA_PAAD_mRNA",
    "TCGA_READ_mRNA",
    "TCGA_STAD_mRNA",
    "TCGA_THCA_mRNA",
])

const TIMEDB_ANNOTATION_DATASETS = new Set([
    "GSE101472_COAD",
    "GSE135304_LUAD",
    "GSE157010",
    "GSE18670",
    "GSE20189",
    "GSE26571",
    "GSE32894",
    "GSE38932",
    "GSE41271_LUAD",
    "GSE42363",
    "GSE47404",
    "GSE62321",
    "GSE68606_LUAD",
    "GSE76124",
    "GSE9638",
    "GSE104922",
    "GSE135304_LUSC",
    "GSE157284",
    "GSE19697",
    "GSE20194",
    "GSE29621",
    "GSE33371_ACC",
    "GSE38939",
    "GSE41271_LUSC",
    "GSE42404",
    "GSE48408",
    "GSE62932",
    "GSE74553",
    "GSE83836",
    "GSE97177",
    "GSE107591",
    "GSE143985",
    "GSE15852",
    "GSE19750",
    "GSE22050_ESCA",
    "GSE31448",
    "GSE37200",
    "GSE39582",
    "GSE41994",
    "GSE43365",
    "GSE49355",
    "GSE63111",
    "GSE75037",
    "GSE8607",
    "GSE98528",
    "GSE10927_ACC",
    "GSE146114_GPL10558",
    "GSE17710",
    "GSE19915",
    "GSE22050_STAD",
    "GSE31595",
    "GSE37201",
    "GSE40115",
    "GSE42127_LUAD",
    "GSE45168",
    "GSE49481",
    "GSE65074",
    "GSE75316",
    "GSE89563",
    "GSE128959",
    "GSE157009",
    "GSE17907",
    "GSE19949",
    "GSE23822",
    "GSE32548",
    "GSE38832",
    "GSE40911",
    "GSE42127_LUSC",
    "GSE45670",
    "GSE50081",
    "GSE66272_KIRC",
    "GSE76019",
    "GSE92921",
])

const getAnnotationDownloadType = (dataset) => {
    if (TCGA_ANNOTATION_DATASETS.has(dataset)) {
        return "tcga"
    }

    if (TIMEDB_ANNOTATION_DATASETS.has(dataset)) {
        return "timedb"
    }

    return null
}

const getAnnotationDownloadUrl = (dataset, annotationType) => {
    if (annotationType === "tcga") {
        return getTCGAAnnotationDownloadUrl(dataset)
    }

    if (annotationType === "timedb") {
        return getTIMEDBAnnotationDownloadUrl(dataset)
    }

    return null
}

const DatasetDownloadButton = ({ dataset }) => {
    const annotationType = getAnnotationDownloadType(dataset)
    const annotationDownloadUrl = getAnnotationDownloadUrl(
        dataset,
        annotationType,
    )

    if (!annotationDownloadUrl) {
        return (
            <Button
                icon={<DownloadOutlined />}
                href={getDatasetDownloadUrl(dataset)}
                target="_blank"
            >
                Download
            </Button>
        )
    }

    const items = [
        {
            key: "expression",
            label: (
                <a
                    href={getDatasetDownloadUrl(dataset)}
                    target="_blank"
                    rel="noreferrer"
                >
                    Expression Data
                </a>
            ),
        },
        {
            key: "annotation",
            label: (
                <a
                    href={annotationDownloadUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    Annotation Data
                </a>
            ),
        },
    ]

    return (
        <Dropdown
            menu={{ items }}
            trigger={["hover"]}
            placement="bottomRight"
        >
            <Button icon={<DownloadOutlined />}>
                Download
            </Button>
        </Dropdown>
    )
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
                const isSampleDataset = record?.obs_type === 'sample'
                const showAnnotation = geneBioType === "mRNA" && isSampleDataset

                return (
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            type="primary"
                            icon={<FileTextOutlined />}
                            href={`/database/dataset/detail?dataset=${encodeURIComponent(dataset)}`}
                        >
                            Detail
                        </Button>

                        {showAnnotation && (
                            <Button
                                icon={<ProfileOutlined />}
                                href={`/database/dataset/annotation?dataset=${encodeURIComponent(dataset)}`}
                            >
                                Annotation
                            </Button>
                        )}

                        <DatasetDownloadButton dataset={dataset} />
                    </Stack>
                )
            },
        }
    ]

    return columns
}
