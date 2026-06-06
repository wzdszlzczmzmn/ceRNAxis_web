import { StyledTable } from "@/components/ui/table/StyledTable"
import { getDatasetMetadataColumns } from "./datasetMetadataConfig"

const DatasetMetadataTable = ({ data, geneBioType }) => {
    return (
        <StyledTable
            columns={getDatasetMetadataColumns(geneBioType)}
            rowKey={(record) => record.id}
            dataSource={data}
            scroll={{ x: "max-content" }}
        />
    )
}

export default DatasetMetadataTable
