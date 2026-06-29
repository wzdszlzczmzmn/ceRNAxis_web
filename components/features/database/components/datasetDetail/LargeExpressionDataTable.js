import { useEffect, useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Button } from "antd"
import { DatabaseOutlined } from "@ant-design/icons"

import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import EmptyView from "@/components/common/status/EmptyView"
import BasicChip from "@/components/ui/chips/BasicChip"
import EllipsisText from "@/components/common/text/EllipsisText"
import { StyledTable } from "@/components/ui/table/StyledTable"

import { useExpressionGeneList } from "@/components/features/database/hooks/datasetDetail/useExpressionGeneList"
import { useDatasetLargeExpressionData } from "@/components/features/database/hooks/datasetDetail/useDatasetLargeExpressionData"

import ExpressionGeneInput from "@/components/features/database/components/datasetDetail/ExpressionGeneInput"
import AvailableGeneModal from "@/components/features/database/components/datasetDetail/AvailableGeneModal"

const DEFAULT_SELECTED_GENE_COUNT = 5
const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

const LARGE_EXPRESSION_MODE_CONFIG = {
    tisch2: {
        idTitle: "Cell ID",
        totalLabel: "CELLS",
    },
    sctml: {
        idTitle: "Spot ID",
        totalLabel: "SPOTS",
    },
}

const getLargeExpressionModeConfig = (expressionMode) => {
    const normalizedMode = String(expressionMode || "").toLowerCase()

    return LARGE_EXPRESSION_MODE_CONFIG[normalizedMode] ?? {
        idTitle: "Observation ID",
        totalLabel: "RECORDS",
    }
}

const getDefaultSelectedGenes = (genes) => {
    return genes.slice(0, DEFAULT_SELECTED_GENE_COUNT)
}

const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === ""
}

const formatExpressionValue = (value) => {
    if (isEmptyValue(value)) {
        return "--"
    }

    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
        return String(value)
    }

    return numericValue.toFixed(4)
}

const buildLargeExpressionColumns = ({
    columns = [],
    expressionMode,
}) => {
    const modeConfig = getLargeExpressionModeConfig(expressionMode)

    return columns.map((column, index) => {
        if (index === 0) {
            return {
                title: modeConfig.idTitle,
                dataIndex: column,
                key: column,
                fixed: "left",
                width: 320,
                align: "center",
                render: value => (
                    <BasicChip
                        value={isEmptyValue(value) ? "--" : value}
                        color="volcano"
                    />
                ),
            }
        }

        return {
            title: column,
            dataIndex: column,
            key: column,
            width: 140,
            align: "center",
            render: value => (
                <EllipsisText text={formatExpressionValue(value)} />
            ),
        }
    })
}

const LargeExpressionDataLayout = ({
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
                <Box
                    component="h6"
                    sx={{
                        fontSize: "36px",
                        fontWeight: 700,
                        m: 0,
                    }}
                >
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

const LargeExpressionDataTable = ({
    dataset,
    expressionType,
    expressionMode,
}) => {
    const [selectedGenes, setSelectedGenes] = useState([])
    const [isGeneModalOpen, setIsGeneModalOpen] = useState(false)
    const [page, setPage] = useState(DEFAULT_PAGE)
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

    const {
        genes,
        count: geneCount,
        isLoading: isGeneLoading,
        isError: isGeneError,
    } = useExpressionGeneList(dataset, expressionType)

    useEffect(() => {
        setSelectedGenes([])
        setPage(DEFAULT_PAGE)
        setPageSize(DEFAULT_PAGE_SIZE)
    }, [dataset, expressionType])

    useEffect(() => {
        if (genes.length > 0 && selectedGenes.length === 0) {
            setSelectedGenes(getDefaultSelectedGenes(genes))
        }
    }, [genes, selectedGenes.length])

    useEffect(() => {
        setPage(DEFAULT_PAGE)
    }, [selectedGenes])

    const {
        count,
        columns,
        results,
        isLoading: isExpressionLoading,
        isValidating: isExpressionValidating,
        isError: isExpressionError,
    } = useDatasetLargeExpressionData({
        dataset,
        expressionType,
        genes: selectedGenes,
        page,
        pageSize,
    })

    const tableColumns = useMemo(() => {
        return buildLargeExpressionColumns({
            columns,
            expressionMode,
        })
    }, [columns, expressionMode])

    const modeConfig = getLargeExpressionModeConfig(expressionMode)

    const handlePageChange = (nextPage, nextPageSize) => {
        setPage(nextPage)
        setPageSize(nextPageSize)
    }

    if (isGeneLoading) {
        return (
            <LargeExpressionDataLayout expressionType={expressionType}>
                <LoadingView containerSx={{ height: "420px" }} />
            </LargeExpressionDataLayout>
        )
    }

    if (isGeneError) {
        return (
            <LargeExpressionDataLayout expressionType={expressionType}>
                <ErrorView containerSx={{ height: "420px" }} />
            </LargeExpressionDataLayout>
        )
    }

    if (!genes.length) {
        return (
            <LargeExpressionDataLayout expressionType={expressionType}>
                <EmptyView
                    bordered
                    description={`No ${expressionType} RNA Expression Data`}
                    containerSx={{ height: "420px" }}
                />
            </LargeExpressionDataLayout>
        )
    }

    const hasExpressionData = columns.length > 0 || results.length > 0

    return (
        <LargeExpressionDataLayout
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
                disabled={isExpressionValidating}
            />

            {isExpressionError && !hasExpressionData ? (
                <ErrorView containerSx={{ height: "30vh" }} />
            ) : (
                <StyledTable
                    loading={isExpressionLoading || isExpressionValidating}
                    columns={tableColumns}
                    rowKey={(record, index) => {
                        const idColumn = columns?.[0]

                        if (idColumn && record?.[idColumn]) {
                            return record[idColumn]
                        }

                        return `${page}-${index}`
                    }}
                    dataSource={results}
                    scroll={{ x: "max-content" }}
                    pagination={{
                        current: page,
                        pageSize,
                        total: count,
                        showSizeChanger: true,
                        pageSizeOptions: [20, 50, 100, 200],
                        showTotal: total => (
                            <Box
                                component="span"
                                fontSize="20px"
                                marginRight="16px"
                            >
                                TOTAL OF <strong>{total}</strong> {modeConfig.totalLabel}
                            </Box>
                        ),
                        onChange: handlePageChange,
                        onShowSizeChange: handlePageChange,
                    }}
                />
            )}
        </LargeExpressionDataLayout>
    )
}

export default LargeExpressionDataTable
