import { Card, Timeline, Typography } from "antd"
import { Box } from "@mui/system"
import { CalendarOutlined } from "@ant-design/icons"

const { Title } = Typography

const timelineItems = [
    {
        color: "blue",
        dot: <CalendarOutlined style={{ fontSize: "20px" }}/>,
        children: (
            <>
                <Title level={4} style={{ marginBottom: 8 }}>
                    Version 1.2: Workflow System Release
                </Title>

                <Box>
                    Added the <strong>ceRNAxisDB Workflow System</strong> for user-driven ceRNA axis analysis.
                    The workflow system provides three complementary analysis modes, covering custom RNA list
                    querying, cohort-based differential expression analysis, and TCGA reference-integrated analysis.

                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        <li>
                            <strong>Custom List Query:</strong> supports user-defined miRNA, mRNA, lncRNA, and
                            circRNA lists to retrieve curated ceRNA axes and immune-related annotations.
                        </li>

                        <li>
                            <strong>Paired Cohort Mode:</strong> supports case-control expression data upload,
                            differential expression analysis, ceRNA axis construction, and downstream visualization.
                        </li>

                        <li>
                            <strong>Hybrid Reference Mode:</strong> supports integration of uploaded mRNA data
                            with selected TCGA reference cancer profiles for reference-aware ceRNA analysis.
                        </li>

                        <li>
                            <strong>Workspace:</strong> added task tracking, task UUID query, result detail pages,
                            and downloadable workflow outputs.
                        </li>
                    </ul>
                </Box>
            </>
        ),
    },
    {
        color: "blue",
        dot: <CalendarOutlined style={{ fontSize: "20px" }}/>,
        children: (
            <>
                <Title level={4} style={{ marginBottom: 8 }}>
                    Version 1.1: Database System Release
                </Title>

                <Box>
                    Completed the <strong>ceRNAxisDB Database System</strong>, including RNA expression databases
                    and the ceRNA axis interaction network database. Users can browse cancer-related RNA expression
                    datasets, inspect dataset metadata, download expression files, and explore ceRNA regulatory
                    relationships.

                    <ul style={{ paddingLeft: "20px", margin: 0 }}>
                        <li>
                            <strong>RNA Expression Databases:</strong> added mRNA, miRNA, lncRNA, and circRNA
                            expression database pages with dataset-level metadata tables.
                        </li>

                        <li>
                            <strong>Dataset Detail:</strong> added sample metadata, aliquot expression files,
                            expression matrix browsing, and expression volcano plot panels.
                        </li>

                        <li>
                            <strong>mRNA Annotation Module:</strong> added ceRNA annotation network, ceRNA axis
                            final results, CMap results, log2FC correlation plot, expression correlation plot,
                            survival analysis, and DEG pathway enrichment plot.
                        </li>

                        <li>
                            <strong>ceRNA Axis Interaction Network Database:</strong> added searchable and
                            filterable RNA-RNA interaction records from curated public resources.
                        </li>
                    </ul>
                </Box>
            </>
        ),
    },
]

const News = () => {
    return (
        <Card
            title={<Title level={3}>ceRNAxisDB Release Notes</Title>}
            style={{
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                overflow: "auto",
            }}
        >
            <Box
                sx={{
                    maxWidth: 500,
                    minWidth: 500,
                    maxHeight: 460,
                }}
            >
                <Timeline mode="left" items={timelineItems}/>
            </Box>
        </Card>
    )
}

export default News
