import { Box, Stack } from "@mui/system"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { StyledTable } from "@/components/ui/table/StyledTable"
import { useDatasetSampleMetaList } from "@/components/features/database/hooks/datasetDetail/useDatasetSampleMetaList"
import GenderChip from "@/components/common/chip/GenderChip"
import PFSStatusChip from "@/components/common/chip/PFSStatusChip"
import OSStatusChip from "@/components/common/chip/OSStatusChip"

const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === ""
}

const normalizeFilterValue = (value) => {
    return isEmptyValue(value) ? "NA" : String(value).trim()
}

const renderEmpty = (value) => {
    return isEmptyValue(value) ? "--" : value
}

const stringSorter = (key) => (a, b) => {
    const av = isEmptyValue(a?.[key]) ? "" : String(a[key])
    const bv = isEmptyValue(b?.[key]) ? "" : String(b[key])
    return av.localeCompare(bv)
}

const numberSorter = (key) => (a, b) => {
    const av = Number(a?.[key])
    const bv = Number(b?.[key])

    return (Number.isFinite(av) ? av : -Infinity) -
        (Number.isFinite(bv) ? bv : -Infinity)
}

const getColumnFilters = (data, key, labelFormatter = normalizeFilterValue) => {
    const values = data.map(item => normalizeFilterValue(item?.[key]))

    return [...new Set(values)]
        .sort((a, b) => a.localeCompare(b))
        .map(value => ({
            text: labelFormatter(value),
            value,
        }))
}

const getFilterProps = (data, key, labelFormatter) => {
    return {
        filters: getColumnFilters(data, key, labelFormatter),
        filterSearch: true,
        onFilter: (value, record) => {
            return normalizeFilterValue(record?.[key]) === value
        },
    }
}

const getSampleMetaColumns = (samples) => [
    {
        title: "Sample ID",
        dataIndex: "sample_id",
        fixed: "left",
        align: "center",
        sorter: stringSorter("sample_id"),
        render: sampleId => <BasicChip value={sampleId} color="volcano" />,
    },
    {
        title: "Disease Type",
        dataIndex: "c_disease_type",
        align: "center",
        sorter: stringSorter("c_disease_type"),
        ...getFilterProps(samples, "c_disease_type"),
        render: value => (
            <Stack sx={{ alignItems: "center" }}>
                <EllipsisText text={renderEmpty(value)} />
            </Stack>
        ),
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
        render: value => (
            <PFSStatusChip value={value} />
        ),
    },
    {
        title: "OS Status",
        dataIndex: "c_os_status",
        align: "center",
        sorter: numberSorter("c_os_status"),
        render: value => (
            <OSStatusChip value={value} />
        ),
    },
]

const DatasetSampleMetaTable = ({ dataset }) => {
    const {
        count,
        samples,
        isLoading,
        isError,
    } = useDatasetSampleMetaList(dataset)

    if (isLoading) {
        return <LoadingView containerSx={{ height: "40vh", marginTop: "40px" }} />
    }

    if (isError) {
        return <ErrorView containerSx={{ height: "40vh", marginTop: "40px" }} />
    }

    const columns = getSampleMetaColumns(samples)

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    mb: "36px",
                    pb: "12px",
                }}
            >
                <Box component="h6" sx={{ fontSize: "36px", m: 0 }}>
                    Sample Meta
                </Box>
            </Stack>

            <StyledTable
                pagination={{
                    total: count,
                    showTotal: (total) => (
                        <Box component="span" fontSize="20px" marginRight="16px">
                            TOTAL OF <strong>{total}</strong> SAMPLES
                        </Box>
                    ),
                }}
                columns={columns}
                rowKey={(record) => record.sample_id}
                dataSource={samples}
                scroll={{ x: "max-content" }}
            />
        </>
    )
}

export default DatasetSampleMetaTable
