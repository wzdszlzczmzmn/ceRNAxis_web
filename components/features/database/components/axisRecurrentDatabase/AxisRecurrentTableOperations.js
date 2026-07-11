"use client";

import { Box, Stack } from "@mui/system";
import { Statistic } from "antd";

import SplitterControlButton
    from "@/components/common/button/SplitterControlButton";
import AxisRecurrentSearchBar
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentSearchBar"


const AxisRecurrentTableOperations = ({
    recordNum,
    pattern,
    patternMeta,
    isShowLeft,
    onToggleFilters,
    onSearch,
}) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <SplitterControlButton
                isShowLeft={isShowLeft}
                handleIsShowLeftChange={onToggleFilters}
                title="Filter Options"
            />

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
            >
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ fontSize: "20px" }}
                >
                    <Box component="span">
                        TOTAL OF
                    </Box>

                    <Statistic
                        value={recordNum}
                        valueStyle={{
                            fontSize: "20px",
                            fontWeight: 700,
                        }}
                    />

                    <Box component="span">
                        RECURRENT AXES
                    </Box>
                </Stack>

                <AxisRecurrentSearchBar
                    value={pattern}
                    onSearch={onSearch}
                    patternMeta={patternMeta}
                />
            </Stack>
        </Stack>
    );
};

export default AxisRecurrentTableOperations;
