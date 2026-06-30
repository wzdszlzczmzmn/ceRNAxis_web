import Head from "next/head"
import ContactContent from "@/components/features/contact/ContactContent"
import { Box, Stack } from "@mui/system"

const Contact = ({}) => {
    return (
        <>
            <Stack spacing={4} sx={{ marginTop: '24px' }}>
                <Box
                    component='h6'
                    sx={{ fontSize: '40px' }}
                >
                    Contact Page
                </Box>
            </Stack>
            <ContactContent/>
        </>
    )
}

export default Contact
