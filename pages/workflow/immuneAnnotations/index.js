import { Box, Stack } from "@mui/system"
import ImmuneAnnotationExploreSection
    from "@/components/features/workflow/components/immuneAnnotations/ImmuneAnnotationExploreSection"

const ImmuneAnnotations = ({}) => {
    return (
        <Stack spacing={4} sx={{ marginTop: '24px' }}>
            <Box
                component='h6'
                sx={{ fontSize: '40px' }}
            >
                Immune Annotations Explore
            </Box>
            <ImmuneAnnotationExploreSection />
        </Stack>
    )
}

export default ImmuneAnnotations
