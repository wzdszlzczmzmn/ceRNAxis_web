import { Empty } from "antd"
import { Stack } from "@mui/system"

const EmptyView = ({
    width = "100%",
    height = 300,
    description = "No Data",
    bordered = false,
    containerSx,
}) => (
    <Stack
        sx={{
            width,
            height,
            justifyContent: "center",
            alignItems: "center",

            ...(bordered && {
                border: "1px dashed #d9d9d9",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "#fafafa",
            }),

            ...containerSx,
        }}
    >
        <Empty description={description} />
    </Stack>
)

export default EmptyView
