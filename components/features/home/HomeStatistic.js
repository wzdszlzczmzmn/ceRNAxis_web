import { Box, Stack } from "@mui/system"
import { Card, Col, Row, Statistic, Typography } from "antd"
import CountUp from "react-countup"
import useIntersectionObserver from "@/components/features/home/useIntersectionObserver"

const { Title } = Typography

const PRIMARY_BLUE = "#062A73"
const TEXT_MUTED = "#6B7583"

const buildHomeStatistics = () => [
    {
        name: "miRNA-mRNA interactions",
        count: 7816887,
    },
    {
        name: "miRNA-lncRNA interactions",
        count: 174986,
    },
    {
        name: "miRNA-circRNA interactions",
        count: 9333801,
    },
    {
        name: "cohorts",
        count: 192,
    },
    {
        name: "cancer types",
        count: 23,
    },
    {
        name: "cohort-specific ceRNA axes",
        count: 6832,
    },
    {
        name: "bulk samples",
        count: 14716,
    },
    {
        name: "single cells",
        count: 6229469,
    },
    {
        name: "spatial spots",
        count: 128831,
    },
]

const formatter = value => (
    <CountUp
        end={value}
        separator=","
        duration={1}
        preserveValue
    />
)

const HomeStatistic = ({ showTitle = false }) => {
    const homeStatistics = buildHomeStatistics()
    const [containerRef, isVisible] = useIntersectionObserver()

    return (
        <Box
            sx={{
                mb: {
                    xs: 3,
                    md: 5,
                },
                width: "100%",
                maxWidth: 1200,
                mx: "auto",
            }}
        >
            {showTitle && (
                <Title
                    level={2}
                    style={{
                        textAlign: "center",
                        marginBottom: "36px",
                        fontSize: "28px",
                        fontWeight: 700,
                    }}
                >
                    Statistics
                </Title>
            )}

            <Row
                gutter={[
                    16,
                    16,
                ]}
                justify="center"
            >
                {homeStatistics.map((homeStatistic, index) => (
                    <Col
                        xs={12}
                        sm={8}
                        md={8}
                        lg={8}
                        key={homeStatistic.name}
                    >
                        <Card
                            style={{
                                textAlign: "center",
                                height: "100%",
                                border: "1px solid #E3E9F2",
                                borderRadius: "14px",
                                backgroundColor: "#F7F9FC",
                            }}
                            bodyStyle={{
                                padding: "16px 18px",
                            }}
                        >
                            {index === 0 && <Box ref={containerRef}/>}

                            <Stack
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    minHeight: {
                                        xs: "74px",
                                        md: "82px",
                                    },
                                }}
                            >
                                <Statistic
                                    value={homeStatistic.count}
                                    valueStyle={{
                                        color: PRIMARY_BLUE,
                                        fontSize: "30px",
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                    }}
                                    formatter={isVisible ? formatter : null}
                                />

                                <Box
                                    sx={{
                                        mt: "6px",
                                        color: TEXT_MUTED,
                                        fontSize: {
                                            xs: "12px",
                                            md: "14px",
                                        },
                                        fontWeight: 500,
                                        lineHeight: 1.35,
                                    }}
                                >
                                    {homeStatistic.name}
                                </Box>
                            </Stack>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Box>
    )
}

export default HomeStatistic
