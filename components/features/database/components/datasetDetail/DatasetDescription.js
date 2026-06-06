import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { Box, Stack } from "@mui/system"
import { Descriptions } from "antd"

const buildItems = (metadata) => [
    {
        key: 'name',
        label: 'Dataset Name',
        children: (
            <BasicChip
                value={metadata['dataset']}
                color='purple'
            />
        )
    },
    {
        key: 'programme',
        label: "Programme",
        children: metadata['programme'],
    },
    {
        key: 'observationType',
        label: "Observation Type",
        children: <BasicChip value={metadata['obs_type']} color="gold"/> ,
    },
    {
        key: 'reference',
        label: "Reference",
        children: <BasicChip value={metadata['reference']} color="green"/>,
    },
    {
        key: 'cancerType',
        label: "Cancer Type",
        children: metadata['cancer_type'],
    },
    {
        key: 'cancerTypeFullName',
        label: "Cancer Type Full Name",
        children: <EllipsisText text={metadata['cancer_type_full_name']} />,
    },
    {
        key: 'geneBioType',
        label: "Gene Bio Type",
        children: <BasicChip value={metadata['gene_bio_type']} color="blue" />,
    },
    {
        key: 'workflow',
        label: "Workflow",
        children: <BasicChip value={metadata['workflow'] === '' ? 'NA' : metadata['workflow']} color="volcano" />,
    },
    {
        key: 'sampleNum',
        label: "Sample Num",
        children: metadata['sample_nums'],
    },
]

const DatasetDescription = ({ metadata }) => {
    const items = buildItems(metadata)

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                spacing={6}
                sx={{
                    borderBottom: '2px solid #e0e0e0',
                    mb: '36px',
                    paddingBottom: '12px'
                }}
            >
                <Box component='h6'
                     sx={{
                         fontSize: '36px'
                     }}
                >
                    Dataset Information
                </Box>
            </Stack>
            <Descriptions
                bordered
                items={items}
                column={2}
                labelStyle={{ fontWeight: 'bold' }}
            />
        </>
    )
}

export default DatasetDescription
