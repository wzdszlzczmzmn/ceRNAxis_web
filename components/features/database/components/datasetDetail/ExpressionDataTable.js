import { useEffect, useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Button, Statistic } from "antd"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import EmptyView from "@/components/common/status/EmptyView"
import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { StyledTable } from "@/components/ui/table/StyledTable"
import { useExpressionGeneList } from "@/components/features/database/hooks/datasetDetail/useExpressionGeneList"
import { useDatasetExpressionData } from "@/components/features/database/hooks/datasetDetail/useDatasetExpressionData"
import ExpressionGeneInput from "./ExpressionGeneInput"
import AvailableGeneModal from "@/components/features/database/components/datasetDetail/AvailableGeneModal"
import { DatabaseOutlined } from "@ant-design/icons"

const DEFAULT_SELECTED_GENE_COUNT = 5

const getDefaultSelectedGenes = (genes) => {
    return genes.slice(0, DEFAULT_SELECTED_GENE_COUNT)
}

const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === ""
}

const numberSorter = (key) => (a, b) => {
    const av = Number(a?.[key])
    const bv = Number(b?.[key])

    return (Number.isFinite(av) ? av : -Infinity) -
        (Number.isFinite(bv) ? bv : -Infinity)
}

const stringSorter = (key) => (a, b) => {
    const av = isEmptyValue(a?.[key]) ? "" : String(a[key])
    const bv = isEmptyValue(b?.[key]) ? "" : String(b[key])

    return av.localeCompare(bv)
}

const buildExpressionColumns = (columns) => {
    if (!columns || columns.length === 0) return []

    return columns.map((column, index) => {
        if (index === 0) {
            return {
                title: "Sample ID",
                dataIndex: column,
                fixed: "left",
                align: "center",
                sorter: stringSorter(column),
                render: value => <BasicChip value={value} color="volcano"/>,
            }
        }

        return {
            title: column,
            dataIndex: column,
            align: "center",
            sorter: numberSorter(column),
            render: value => (
                <EllipsisText
                    text={isEmptyValue(value) ? "--" : Number(value).toFixed(4)}
                />
            ),
        }
    })
}

const ExpressionDataLayout = ({
    expressionType,
    geneCount,
    showActions = false,
    onBrowseGenes,
    children,
}) => {
    return (
        <Stack spacing={3}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    pb: "12px",
                }}
            >
                <Box component="h6" sx={{ fontSize: "36px", fontWeight: 700, m: 0 }}>
                    {expressionType} Expression
                </Box>

                {showActions && (
                    <Stack direction="row" spacing={2}>
                        <BasicChip
                            value={`${geneCount.toLocaleString()} Genes Available`}
                            color="blue"
                            style={{
                                height: "36px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0 14px",
                                fontSize: "14px",
                                fontWeight: 500,
                            }}
                        />

                        <Button
                            type="primary"
                            icon={<DatabaseOutlined />}
                            onClick={onBrowseGenes}
                        >
                            Browse Genes
                        </Button>
                    </Stack>
                )}
            </Stack>

            {children}
        </Stack>
    )
}

const ExpressionDataTable = ({ dataset, rnaType, expressionType }) => {
    const [selectedGenes, setSelectedGenes] = useState([])
    const [isGeneModalOpen, setIsGeneModalOpen] = useState(false)

    const {
        genes,
        count: geneCount,
        isLoading: isGeneLoading,
        isError: isGeneError,
    } = useExpressionGeneList(dataset, rnaType, expressionType)

    useEffect(() => {
        setSelectedGenes([])
    }, [dataset, rnaType, expressionType])

    useEffect(() => {
        if (genes.length > 0 && selectedGenes.length === 0) {
            setSelectedGenes(getDefaultSelectedGenes(genes))
        }
    }, [genes, selectedGenes.length])

    const {
        count,
        columns,
        results,
        isLoading: isExpressionLoading,
        isError: isExpressionError,
    } = useDatasetExpressionData({
        dataset,
        expressionType,
        genes: selectedGenes,
    })

    const tableColumns = useMemo(() => {
        return buildExpressionColumns(columns)
    }, [columns])

    if (isGeneLoading) {
        return (
            <ExpressionDataLayout expressionType={expressionType}>
                <LoadingView containerSx={{ height: "420px" }} />
            </ExpressionDataLayout>
        )
    }

    if (isGeneError) {
        return (
            <ExpressionDataLayout expressionType={expressionType}>
                <ErrorView containerSx={{ height: "420px" }} />
            </ExpressionDataLayout>
        )
    }

    if (!genes.length) {
        return (
            <ExpressionDataLayout expressionType={expressionType}>
                <EmptyView
                    bordered
                    description={`No ${expressionType} RNA Expression Data`}
                    containerSx={{ height: "420px" }}
                />
            </ExpressionDataLayout>
        )
    }

    return (
        <ExpressionDataLayout
            expressionType={expressionType}
            geneCount={geneCount}
            showActions
            onBrowseGenes={() => setIsGeneModalOpen(true)}
        >
            <AvailableGeneModal
                open={isGeneModalOpen}
                onClose={() => setIsGeneModalOpen(false)}
                genes={genes}
                expressionType={expressionType}
            />

            <ExpressionGeneInput
                availableGenes={genes}
                selectedGenes={selectedGenes}
                setSelectedGenes={setSelectedGenes}
                disabled={isExpressionLoading}
            />

            {isExpressionError ? (
                <ErrorView containerSx={{ height: "30vh" }} />
            ) : (
                <StyledTable
                    loading={isExpressionLoading}
                    columns={tableColumns}
                    rowKey={(record) => record[columns?.[0]]}
                    dataSource={results}
                    scroll={{ x: "max-content" }}
                    pagination={{
                        total: count,
                        showSizeChanger: true,
                        showTotal: (total) => (
                            <Box component="span" fontSize="20px" marginRight="16px">
                                TOTAL OF <strong>{total}</strong> SAMPLES
                            </Box>
                        ),
                    }}
                />
            )}
        </ExpressionDataLayout>
    )
}

export default ExpressionDataTable
