import { Box, Stack } from "@mui/system"


const Workspace = ({ tasks, userId }) => {
    return (
        <Stack spacing={4} sx={{ marginTop: '24px' }}>
            <Box
                component='h6'
                sx={{ fontSize: '40px' }}
            >
                Workspace Page
            </Box>
        </Stack>
    )
}

export default Workspace
