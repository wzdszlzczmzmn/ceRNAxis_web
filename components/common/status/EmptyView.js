import { Empty } from "antd";
import { Stack } from "@mui/system";

const EmptyView = ({
    width = "100%",
    height = 300,
    description = "No Data",
    containerSx,
}) => (
    <Stack
        sx={{
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
            ...containerSx,
        }}
    >
        <Empty description={description} />
    </Stack>
);

export default EmptyView;
