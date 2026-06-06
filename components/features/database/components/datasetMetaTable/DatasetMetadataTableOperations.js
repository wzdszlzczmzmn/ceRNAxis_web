import { useEffect, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Input, Statistic } from "antd"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"

const DatasetMetadataTableOperations = ({
    geneBioType,
    totalNum,
    shownNum,
    isShowLeft,
    handleIsShowLeftChange,
    searchText,
    handleSearchTextChange,
}) => {
    const [draftSearchText, setDraftSearchText] = useState(searchText ?? "")

    useEffect(() => {
        setDraftSearchText(searchText ?? "")
    }, [searchText])

    const handleSearch = () => {
        handleSearchTextChange(draftSearchText.trim())
    }

    const handleClear = () => {
        setDraftSearchText("")
        handleSearchTextChange("")
    }

    return (
        <Stack direction="row" justifyContent="space-between">
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                title="Filter Options"
            />

            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: "20px" }}>
                    <Box component="span">SHOWING</Box>
                    <Statistic value={shownNum} valueStyle={{ fontSize: "20px", fontWeight: 700 }} />
                    <Box component="span">/ {totalNum} {geneBioType} DATASETS</Box>
                </Stack>

                <Input.Search
                    allowClear
                    value={draftSearchText}
                    placeholder={`Search ${geneBioType} datasets...`}
                    onChange={(e) => setDraftSearchText(e.target.value)}
                    onSearch={handleSearch}
                    onClear={handleClear}
                    style={{ width: 280 }}
                />
            </Stack>
        </Stack>
    )
}

export default DatasetMetadataTableOperations
