import { useMemo, useState } from "react"
import { Modal, Input, Table, Alert } from "antd"
import { Box } from "@mui/system"

const AvailableGeneModal = ({
    open,
    onClose,
    genes = [],
    expressionType,
}) => {
    const [searchText, setSearchText] = useState("")

    const filteredGenes = useMemo(() => {
        const q = searchText.trim().toLowerCase()

        if (!q) return genes

        return genes.filter(gene =>
            String(gene).toLowerCase().includes(q)
        )
    }, [genes, searchText])

    const dataSource = useMemo(() => {
        return filteredGenes.map(gene => ({ gene }))
    }, [filteredGenes])

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={560}
            centered
            destroyOnHidden
            title={
                <Box
                    sx={{
                        fontSize: "28px",
                        fontWeight: 700,
                        lineHeight: 1.2,
                    }}
                >
                    {expressionType} Available Genes
                </Box>
            }
        >
            <Alert
                type="info"
                showIcon
                message="Use the search box below to quickly locate available genes."
                style={{
                    marginTop: '12px',
                }}
            />

            <Input.Search
                allowClear
                placeholder="Search gene, e.g. TP53"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={(value) => setSearchText(value.trim())}
                style={{
                    marginTop: "12px",
                    marginBottom: "18px",
                }}
            />

            <Table
                size="middle"
                rowKey="gene"
                columns={[
                    {
                        title: "Gene Symbol",
                        dataIndex: "gene",
                        align: 'center',
                        sorter: (a, b) => a.gene.localeCompare(b.gene),
                    },
                ]}
                dataSource={dataSource}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    showTotal: total => `Total ${total} genes`,
                    position: ["bottomCenter"],
                }}
            />
        </Modal>
    )
}

export default AvailableGeneModal
