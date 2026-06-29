import { Box } from "@mui/system";
import BasicChip from "@/components/ui/chips/BasicChip";
import EllipsisText from "@/components/common/text/EllipsisText";
import { StyledTable } from "@/components/ui/table/StyledTable";
import GenderChip from "@/components/common/chip/GenderChip";
import PFSStatusChip from "@/components/common/chip/PFSStatusChip";
import OSStatusChip from "@/components/common/chip/OSStatusChip";
import {
    getFilterProps,
    numberSorter,
    renderEmpty,
    stringSorter
} from "@/components/features/common/sampleMeta/metaTableUtils"

const getGroupChipColor = (value) => {
    if (value === "case") {
        return "volcano";
    }

    if (value === "control") {
        return "green";
    }

    return "default";
};

const renderGroupChip = (value) => (
    <BasicChip
        value={renderEmpty(value)}
        color={getGroupChipColor(value)}
    />
);

export const getSampleMetaColumns = ({
    samples,
    expressionMode,
}) => {
    if (expressionMode === "timedb") {
        return getTIMEDBSampleMetaColumns(samples);
    }

    return getTCGASampleMetaColumns(samples);
};

export const getTCGASampleMetaColumns = (samples) => [
    {
        title: "Sample ID",
        dataIndex: "sample_id",
        fixed: "left",
        width: 180,
        align: "center",
        sorter: stringSorter("sample_id"),
        render: sampleId => <BasicChip value={sampleId} color="volcano" />,
    },
    {
        title: "Dataset",
        dataIndex: "dataset_name",
        align: "center",
        sorter: stringSorter("dataset_name"),
        ...getFilterProps(samples, "dataset_name"),
        render: value => <BasicChip value={renderEmpty(value)} color="blue" />,
    },
    {
        title: "Disease Type",
        dataIndex: "c_disease_type",
        align: "center",
        sorter: stringSorter("c_disease_type"),
        ...getFilterProps(samples, "c_disease_type"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Primary Site",
        dataIndex: "c_primiary_site",
        align: "center",
        sorter: stringSorter("c_primiary_site"),
        ...getFilterProps(samples, "c_primiary_site"),
        render: value => <BasicChip value={renderEmpty(value)} color="gold" />,
    },
    {
        title: "Tumor Stage",
        dataIndex: "c_tumor_stage",
        align: "center",
        sorter: stringSorter("c_tumor_stage"),
        ...getFilterProps(samples, "c_tumor_stage"),
        render: value => <BasicChip value={renderEmpty(value)} color="green" />,
    },
    {
        title: "Tumor Stage T",
        dataIndex: "c_tumor_stage_t",
        align: "center",
        sorter: stringSorter("c_tumor_stage_t"),
        ...getFilterProps(samples, "c_tumor_stage_t"),
        render: value => <BasicChip value={renderEmpty(value)} color="blue" />,
    },
    {
        title: "Tumor Stage N",
        dataIndex: "c_tumor_stage_n",
        align: "center",
        sorter: stringSorter("c_tumor_stage_n"),
        ...getFilterProps(samples, "c_tumor_stage_n"),
        render: value => <BasicChip value={renderEmpty(value)} color="purple" />,
    },
    {
        title: "Tumor Stage M",
        dataIndex: "c_tumor_stage_m",
        align: "center",
        sorter: stringSorter("c_tumor_stage_m"),
        ...getFilterProps(samples, "c_tumor_stage_m"),
        render: value => <BasicChip value={renderEmpty(value)} color="orange" />,
    },
    {
        title: "Tumor Grade",
        dataIndex: "c_tumor_grade",
        align: "center",
        sorter: stringSorter("c_tumor_grade"),
        ...getFilterProps(samples, "c_tumor_grade"),
        render: renderEmpty,
    },
    {
        title: "Ethnicity",
        dataIndex: "c_ethinicity",
        align: "center",
        sorter: stringSorter("c_ethinicity"),
        ...getFilterProps(samples, "c_ethinicity"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Race",
        dataIndex: "c_race",
        align: "center",
        sorter: stringSorter("c_race"),
        ...getFilterProps(samples, "c_race"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Gender",
        dataIndex: "c_gender",
        align: "center",
        sorter: stringSorter("c_gender"),
        ...getFilterProps(samples, "c_gender"),
        render: gender => <GenderChip value={gender} />,
    },
    {
        title: "Age",
        dataIndex: "n_age",
        align: "center",
        sorter: numberSorter("n_age"),
        render: renderEmpty,
    },
    {
        title: "PFS",
        dataIndex: "n_pfs",
        align: "center",
        sorter: numberSorter("n_pfs"),
        render: renderEmpty,
    },
    {
        title: "OS",
        dataIndex: "n_os",
        align: "center",
        sorter: numberSorter("n_os"),
        render: renderEmpty,
    },
    {
        title: "PFS Status",
        dataIndex: "c_pfs_status",
        align: "center",
        sorter: numberSorter("c_pfs_status"),
        render: value => <PFSStatusChip value={value} />,
    },
    {
        title: "OS Status",
        dataIndex: "c_os_status",
        align: "center",
        sorter: numberSorter("c_os_status"),
        render: value => <OSStatusChip value={value} />,
    },
    {
        title: "Group",
        dataIndex: "c_group",
        fixed: "right",
        width: 140,
        align: "center",
        sorter: stringSorter("c_group"),
        ...getFilterProps(samples, "c_group"),
        render: value => (
            <BasicChip
                value={renderEmpty(value)}
                color={
                    value === "case"
                        ? "volcano"
                        : value === "control"
                            ? "green"
                            : "default"
                }
            />
        ),
    },
];

export const getTIMEDBSampleMetaColumns = (samples) => [
    {
        title: "Sample ID",
        dataIndex: "sample_id",
        fixed: "left",
        width: 180,
        align: "center",
        sorter: stringSorter("sample_id"),
        render: sampleId => <BasicChip value={sampleId} color="volcano" />,
    },
    {
        title: "Project",
        dataIndex: "project_name",
        width: 160,
        align: "center",
        sorter: stringSorter("project_name"),
        ...getFilterProps(samples, "project_name"),
        render: value => <BasicChip value={renderEmpty(value)} color="blue" />,
    },
    {
        title: "Tumor Stage",
        dataIndex: "c_tumor_stage",
        width: 160,
        align: "center",
        sorter: stringSorter("c_tumor_stage"),
        ...getFilterProps(samples, "c_tumor_stage"),
        render: value => <BasicChip value={renderEmpty(value)} color="green" />,
    },
    {
        title: "Tumor Grade",
        dataIndex: "c_tumor_grade",
        width: 160,
        align: "center",
        sorter: stringSorter("c_tumor_grade"),
        ...getFilterProps(samples, "c_tumor_grade"),
        render: value => <BasicChip value={renderEmpty(value)} color="gold" />,
    },
    {
        title: "AJCC Pathologic T",
        dataIndex: "c_ajcc_pathologic_t",
        width: 180,
        align: "center",
        sorter: stringSorter("c_ajcc_pathologic_t"),
        ...getFilterProps(samples, "c_ajcc_pathologic_t"),
        render: value => <BasicChip value={renderEmpty(value)} color="blue" />,
    },
    {
        title: "AJCC Pathologic N",
        dataIndex: "c_ajcc_pathologic_n",
        width: 210,
        align: "center",
        sorter: stringSorter("c_ajcc_pathologic_n"),
        ...getFilterProps(samples, "c_ajcc_pathologic_n"),
        render: value => <BasicChip value={renderEmpty(value)} color="purple" />,
    },
    {
        title: "Primary Diagnosis",
        dataIndex: "c_primary_diagnosis",
        width: 220,
        align: "center",
        sorter: stringSorter("c_primary_diagnosis"),
        ...getFilterProps(samples, "c_primary_diagnosis"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Year of Diagnosis",
        dataIndex: "year_of_diagnosis",
        width: 170,
        align: "center",
        sorter: numberSorter("year_of_diagnosis"),
        render: renderEmpty,
    },
    {
        title: "Synchronous Malignancy",
        dataIndex: "c_synchronous_malignancy",
        width: 260,
        align: "center",
        sorter: stringSorter("c_synchronous_malignancy"),
        ...getFilterProps(samples, "c_synchronous_malignancy"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Cigarettes Per Day",
        dataIndex: "n_cigarettes_per_day",
        width: 190,
        align: "center",
        sorter: numberSorter("n_cigarettes_per_day"),
        render: renderEmpty,
    },
    {
        title: "Alcohol History",
        dataIndex: "c_alcohol_history",
        width: 180,
        align: "center",
        sorter: stringSorter("c_alcohol_history"),
        ...getFilterProps(samples, "c_alcohol_history"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Sample Histology",
        dataIndex: "c_sample_histology",
        width: 200,
        align: "center",
        sorter: stringSorter("c_sample_histology"),
        ...getFilterProps(samples, "c_sample_histology"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Years Smoked",
        dataIndex: "n_years_smoked",
        width: 160,
        align: "center",
        sorter: numberSorter("n_years_smoked"),
        render: renderEmpty,
    },
    {
        title: "Alcohol Intensity",
        dataIndex: "n_alcohol_intensity",
        width: 180,
        align: "center",
        sorter: numberSorter("n_alcohol_intensity"),
        render: renderEmpty,
    },
    {
        title: "Weight",
        dataIndex: "n_weight",
        width: 130,
        align: "center",
        sorter: numberSorter("n_weight"),
        render: renderEmpty,
    },
    {
        title: "Height",
        dataIndex: "n_height",
        width: 130,
        align: "center",
        sorter: numberSorter("n_height"),
        render: renderEmpty,
    },
    {
        title: "BMI",
        dataIndex: "n_bmi",
        width: 130,
        align: "center",
        sorter: numberSorter("n_bmi"),
        render: renderEmpty,
    },
    {
        title: "Race",
        dataIndex: "c_race",
        width: 160,
        align: "center",
        sorter: stringSorter("c_race"),
        ...getFilterProps(samples, "c_race"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Gender",
        dataIndex: "c_gender",
        width: 140,
        align: "center",
        sorter: stringSorter("c_gender"),
        ...getFilterProps(samples, "c_gender"),
        render: gender => <GenderChip value={gender} />,
    },
    {
        title: "Age",
        dataIndex: "n_age",
        width: 120,
        align: "center",
        sorter: numberSorter("n_age"),
        render: renderEmpty,
    },
    {
        title: "PFS",
        dataIndex: "pfs",
        width: 120,
        align: "center",
        sorter: numberSorter("pfs"),
        render: renderEmpty,
    },
    {
        title: "OS",
        dataIndex: "os",
        width: 120,
        align: "center",
        sorter: numberSorter("os"),
        render: renderEmpty,
    },
    {
        title: "PFS Status",
        dataIndex: "pfs_status",
        width: 150,
        align: "center",
        sorter: numberSorter("pfs_status"),
        ...getFilterProps(samples, "pfs_status"),
        render: value => <PFSStatusChip value={value} />,
    },
    {
        title: "OS Status",
        dataIndex: "os_status",
        width: 150,
        align: "center",
        sorter: numberSorter("os_status"),
        ...getFilterProps(samples, "os_status"),
        render: value => <OSStatusChip value={value} />,
    },
    {
        title: "Tumor Type",
        dataIndex: "c_tumor_type",
        width: 220,
        align: "center",
        sorter: stringSorter("c_tumor_type"),
        ...getFilterProps(samples, "c_tumor_type"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Tumor Subtype",
        dataIndex: "c_tumor_subtype",
        width: 180,
        align: "center",
        sorter: stringSorter("c_tumor_subtype"),
        ...getFilterProps(samples, "c_tumor_subtype"),
        render: value => <EllipsisText text={renderEmpty(value)} />,
    },
    {
        title: "Group Stage",
        dataIndex: "c_group_stage",
        width: 160,
        align: "center",
        sorter: stringSorter("c_group_stage"),
        ...getFilterProps(samples, "c_group_stage"),
        render: renderGroupChip,
    },
    {
        title: "Group N",
        dataIndex: "c_group_n",
        width: 140,
        align: "center",
        sorter: stringSorter("c_group_n"),
        ...getFilterProps(samples, "c_group_n"),
        render: renderGroupChip,
    },
    {
        title: "Group T",
        dataIndex: "c_group_t",
        width: 140,
        align: "center",
        sorter: stringSorter("c_group_t"),
        ...getFilterProps(samples, "c_group_t"),
        render: renderGroupChip,
    },
    {
        title: "Group Grade",
        dataIndex: "c_group_grade",
        fixed: "right",
        width: 160,
        align: "center",
        sorter: stringSorter("c_group_grade"),
        ...getFilterProps(samples, "c_group_grade"),
        render: renderGroupChip,
    },
    {
        title: "Group",
        dataIndex: "c_group",
        fixed: "right",
        width: 140,
        align: "center",
        sorter: stringSorter("c_group"),
        ...getFilterProps(samples, "c_group"),
        render: renderGroupChip,
    },
    {
        title: "Group By",
        dataIndex: "c_group_by",
        fixed: "right",
        width: 180,
        align: "center",
        sorter: stringSorter("c_group_by"),
        ...getFilterProps(samples, "c_group_by"),
        render: value => <BasicChip value={renderEmpty(value)} color="blue" />,
    },
];

const SampleMetaTable = ({
    count = 0,
    samples = [],
    expressionMode = "tcga",
    pagination,
    tableProps = {},
}) => {
    const columns = getSampleMetaColumns({
        samples,
        expressionMode,
    });

    return (
        <StyledTable
            pagination={
                pagination ?? {
                    total: count,
                    showTotal: (total) => (
                        <Box component="span" fontSize="16px" marginRight="16px">
                            TOTAL OF <strong>{total}</strong> SAMPLES
                        </Box>
                    ),
                }
            }
            columns={columns}
            rowKey={(record) => record.sample_id}
            dataSource={samples}
            scroll={{ x: "max-content" }}
            {...tableProps}
        />
    );
};

export default SampleMetaTable;
