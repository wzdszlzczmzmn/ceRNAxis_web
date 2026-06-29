import { Box } from "@mui/system"
import { StyledTable } from "@/components/ui/table/StyledTable"
import { buildLargeMetaColumns } from "@/components/features/database/components/datasetDetail/largeMetaColumns"

const getRowKey = (record, index, columns, page) => {
    if (record?.cell_id) {
        return record.cell_id
    }

    if (record?.spot_id) {
        return record.spot_id
    }

    const firstColumn = columns?.[0]

    if (firstColumn && record?.[firstColumn]) {
        return record[firstColumn]
    }

    return `${page}-${index}`
}

const LargeMetaTable = ({
    count = 0,
    columns = [],
    rows = [],
    page = 1,
    pageSize = 50,
    expressionMode,
    loading = false,
    onPageChange,
    tableProps = {},
}) => {
    const tableColumns = buildLargeMetaColumns({
        columns,
        expressionMode,
    })

    return (
        <StyledTable
            rowKey={(record, index) => getRowKey(record, index, columns, page)}
            columns={tableColumns}
            dataSource={rows}
            loading={loading}
            pagination={{
                current: page,
                pageSize,
                total: count,
                showSizeChanger: true,
                pageSizeOptions: [10, 50, 100, 200],
                showTotal: total => (
                    <Box component="span" fontSize="16px" marginRight="16px">
                        TOTAL OF <strong>{total}</strong> RECORDS
                    </Box>
                ),
                onChange: onPageChange,
                onShowSizeChange: onPageChange,
            }}
            scroll={{ x: "max-content" }}
            {...tableProps}
        />
    )
}

export default LargeMetaTable
