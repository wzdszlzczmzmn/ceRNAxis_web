import { Box, Stack } from "@mui/system"
import SplitterControlButton from "@/components/common/button/SplitterControlButton"
import { Statistic } from "antd"
import AxisSearchBar from "@/components/features/database/components/ceRNAAxisDatabase/AxisSearchBar"

const AxisTableOperations = ({ recordNum, isShowLeft, handleIsShowLeftChange, handleSearch }) => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={handleIsShowLeftChange}
                title='Filter Options'
            />
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ fontSize: '20px' }}>
                    <Box component='span'>TOTAL OF </Box>
                    <Statistic value={recordNum} valueStyle={{ fontSize: '20px', fontWeight: 700 }}/>
                    <Box component='span'>ceRNA Axis Records</Box>
                </Stack>
                <AxisSearchBar onSearch={handleSearch}/>
            </Stack>
        </Stack>
    )
}

export default AxisTableOperations
