import { Box, Stack } from "@mui/system"
import NetworkWrapper from "@/components/features/network/components/NetworkWrapper"

const NetworkPage = ({}) => {
    return (
        <Stack spacing={4} sx={{ marginTop: '24px' }}>
            <Box
                component='h6'
                sx={{ fontSize: '40px' }}
            >
                ceRNA Axis Network Query
            </Box>
            <NetworkWrapper/>
        </Stack>
    )
}

export default NetworkPage
