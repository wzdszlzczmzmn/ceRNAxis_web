import { Box, Stack } from "@mui/system"
import {
    BarChartOutlined,
    FileTextOutlined,
    ProfileOutlined,
} from "@ant-design/icons"
import { Button } from "antd"
import DatabaseIcon from "@/components/icons/Database"

const PRIMARY_BLUE = "#062A73"
const ACCENT_CORAL = "#D96A5F"
const TEXT_DARK = "#202124"
const TEXT_MUTED = "#6B7583"
const BUTTON_LIGHT_BG = "#F5F8FC"

const stats = [
    { value: "[N]", label: "miRNA–mRNA interactions" },
    { value: "[N]", label: "miRNA–lncRNA interactions" },
    { value: "[N]", label: "miRNA–circRNA interactions" },
    { value: "[N]", label: "ceRNA axes" },
    { value: "[N]", label: "cancer types" },
    { value: "[N]", label: "cohorts" },
    { value: "[N]", label: "bulk samples" },
    { value: "[N]", label: "single cells" },
    { value: "[N]", label: "spatial spots" },
]

const HomeIntroduction = ({}) => (
    <Box
        component="section"
        sx={{
            width: "100%",
            px: {
                xs: "20px",
                md: "48px",
            },
            py: {
                xs: "56px",
                md: "72px",
            },
            textAlign: "center",
        }}
    >
        <Stack
            spacing={4}
            alignItems="center"
            sx={{
                maxWidth: 1800,
                mx: "auto",
            }}
        >
            <Stack spacing={2} alignItems="center">
                <Box
                    component="h1"
                    sx={{
                        m: 0,
                        color: TEXT_DARK,
                        fontSize: {
                            xs: "32px",
                            sm: "40px",
                            md: "50px",
                            lg: "58px",
                        },
                        fontWeight: 800,
                        lineHeight: 1.15,
                        letterSpacing: "-0.03em",
                    }}
                >
                    Explore Cancer ceRNA axes with
                </Box>

                <Box
                    component="h1"
                    sx={{
                        m: 0,
                        fontSize: {
                            xs: "42px",
                            sm: "52px",
                            md: "64px",
                            lg: "72px",
                        },
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: "-0.04em",
                        color: PRIMARY_BLUE,
                    }}
                >
                    ceRNA
                    <Box
                        component="span"
                        sx={{
                            color: ACCENT_CORAL,
                        }}
                    >
                        xis
                    </Box>
                    DB
                </Box>

                <Stack
                    spacing={3}
                    alignItems="center"
                    sx={{
                        pt: {
                            xs: "18px",
                            md: "22px",
                        },
                        width: "100%",
                    }}
                >
                    <Box
                        component="p"
                        sx={{
                            m: 0,
                            width: "100%",
                            maxWidth: {
                                xs: "100%",
                                md: 1440,
                                lg: 1560,
                            },
                            color: TEXT_MUTED,
                            fontSize: {
                                xs: "15px",
                                md: "17px",
                                lg: "19px",
                            },
                            fontWeight: 400,
                            lineHeight: 1.65,
                        }}
                    >
                        ceRNAxisDB is a next-generation cancer ceRNA resource that integrates pan-cancer bulk RNA data,
                        single-cell transcriptomics, and spatial transcriptomics to identify clinically stratified ceRNA
                        axes across human cancers. It is built on a high-confidence ceRNA background network curated from
                        TargetScan 8.0, miRTarBase 9.0, miRDB 6.0, NPInter 4.0, ENCORI/starBase, miRWalk v3, RNAInter,
                        and circNet 2.0, enabling context-aware discovery and prioritization of actionable ceRNA regulatory
                        hypotheses.
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: {
                                xs: "12px",
                                md: "16px",
                            },
                            width: "100%",
                            maxWidth: 1180,
                        }}
                    >
                        {stats.map((item) => (
                            <Box
                                key={item.label}
                                sx={{
                                    width: {
                                        xs: "calc(50% - 6px)",
                                        sm: "calc(33.333% - 11px)",
                                        md: "214px",
                                    },
                                    px: "18px",
                                    py: "16px",
                                    borderRadius: "14px",
                                    backgroundColor: "#F7F9FC",
                                    border: "1px solid #E3E9F2",
                                    textAlign: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        color: PRIMARY_BLUE,
                                        fontSize: {
                                            xs: "24px",
                                            md: "30px",
                                        },
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {item.value}
                                </Box>

                                <Box
                                    sx={{
                                        mt: "6px",
                                        color: TEXT_MUTED,
                                        fontSize: {
                                            xs: "12px",
                                            md: "13px",
                                        },
                                        fontWeight: 500,
                                        lineHeight: 1.35,
                                    }}
                                >
                                    {item.label}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Stack>
            </Stack>

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                    pt: 1,
                }}
            >
                <Button
                    href="/database/datasetMetaTable?gene_bio_type=mRNA"
                    size="large"
                    icon={<DatabaseIcon/>}
                    style={{
                        minWidth: 132,
                        height: 44,
                        backgroundColor: PRIMARY_BLUE,
                        color: "#ffffff",
                        border: `1px solid ${PRIMARY_BLUE}`,
                        fontWeight: 600,
                        borderRadius: 8,
                    }}
                >
                    Database
                </Button>

                <Button
                    href="/workflow"
                    size="large"
                    icon={<BarChartOutlined/>}
                    style={{
                        minWidth: 132,
                        height: 44,
                        backgroundColor: ACCENT_CORAL,
                        color: "#ffffff",
                        border: `1px solid ${ACCENT_CORAL}`,
                        fontWeight: 600,
                        borderRadius: 8,
                    }}
                >
                    Workflow
                </Button>

                <Button
                    href="/workspace"
                    size="large"
                    icon={<ProfileOutlined/>}
                    style={{
                        minWidth: 132,
                        height: 44,
                        backgroundColor: BUTTON_LIGHT_BG,
                        color: PRIMARY_BLUE,
                        border: `1px solid #D7E0EF`,
                        fontWeight: 600,
                        borderRadius: 8,
                    }}
                >
                    Workspace
                </Button>

                <Button
                    href="/tutorial"
                    size="large"
                    icon={<FileTextOutlined/>}
                    style={{
                        minWidth: 132,
                        height: 44,
                        backgroundColor: "#ffffff",
                        color: PRIMARY_BLUE,
                        border: `1px solid #C8D3E6`,
                        fontWeight: 600,
                        borderRadius: 8,
                    }}
                >
                    Tutorial
                </Button>
            </Stack>
        </Stack>
    </Box>
)

export default HomeIntroduction
