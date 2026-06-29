import { useState } from "react"
import { Box, Stack } from "@mui/system"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { useDatasetLargeMetaList } from "@/components/features/database/hooks/datasetDetail/useDatasetLargeMetaList"
import LargeMetaTable from "@/components/features/database/components/datasetDetail/LargeMetaTable"

const TITLE_MAP = {
    tisch2: "Cell Meta",
    sctml: "Spot Meta",
}

const DatasetLargeMetaSection = ({
    dataset,
    expressionMode,
}) => {
    const normalizedExpressionMode = String(expressionMode || "").toLowerCase()

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const {
        count,
        columns,
        rows,
        isLoading,
        isValidating,
        isError,
    } = useDatasetLargeMetaList({
        dataset,
        page,
        pageSize,
    })

    const handlePageChange = (nextPage, nextPageSize) => {
        setPage(nextPage)
        setPageSize(nextPageSize)
    }

    const hasData = rows.length > 0 || columns.length > 0

    if (isLoading && !hasData) {
        return (
            <LoadingView
                containerSx={{
                    height: "40vh",
                    marginTop: "40px",
                }}
            />
        )
    }

    if (isError && !hasData) {
        return (
            <ErrorView
                containerSx={{
                    height: "40vh",
                    marginTop: "40px",
                }}
            />
        )
    }

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
                    {TITLE_MAP[normalizedExpressionMode] ?? "Large Meta"}
                </Box>
            </Stack>

            <LargeMetaTable
                count={count}
                columns={columns}
                rows={rows}
                page={page}
                pageSize={pageSize}
                expressionMode={expressionMode}
                loading={isValidating}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default DatasetLargeMetaSection
