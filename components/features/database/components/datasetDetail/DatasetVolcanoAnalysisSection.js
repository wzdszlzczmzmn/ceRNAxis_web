import { useEffect, useState } from "react"
import { Box, Stack } from "@mui/system"
import {
    AutoComplete,
    Button,
    Divider,
    Input,
    InputNumber,
    Select,
    Space,
    Switch,
    Tooltip,
    Typography,
    Slider
} from "antd"
import { Splitter } from "antd"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    SettingOutlined,
} from "@ant-design/icons"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import EmptyView from "@/components/common/status/EmptyView"
import VolcanoPlot from "@/components/features/visualization/components/VolcanoPlot"
import { useDatasetDegVolcano } from "@/components/features/database/hooks/datasetDetail/useDatasetDegVolcano"

const DEFAULT_VISUAL_CONFIG = {
    showLabels: true,
    labelTopN: 10,
    pointSize: 7,
    pointOpacity: 0.8,
    plotAspectRatio: 1.3,
}

const VolcanoControlPanel = ({
    queryConfig,
    setQueryConfig,
    visualConfig,
    setVisualConfig,
    availableDegExpressionTypes = [],
    geneSearchOptions = [],
    searchGene,
    setSearchGene,
    onCollapse
}) => {
    return (
        <Stack
            spacing={2}
            sx={{
                height: "100%",
                p: 2,
                bgcolor: "#fafafa",
                overflowY: "auto",
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <SettingOutlined/>
                    <Box component="h6" sx={{ m: 0, fontSize: 18, fontWeight: 700 }}>
                        Volcano Controls
                    </Box>
                </Stack>

                <Button
                    size="small"
                    type="text"
                    icon={<MenuFoldOutlined/>}
                    onClick={onCollapse}
                />
            </Stack>

            <Divider style={{ margin: "4px 0 8px" }}/>

            <ControlGroup title="Data">
                <ControlField label="Expression type">
                    <Select
                        size="middle"
                        style={{ width: "100%" }}
                        value={queryConfig.expressionType}
                        placeholder="Select expression type"
                        options={availableDegExpressionTypes.map(type => ({
                            label: type,
                            value: type,
                        }))}
                        onChange={value =>
                            setQueryConfig(prev => ({
                                ...prev,
                                expressionType: value,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Highlight Gene">
                <AutoComplete
                    allowClear
                    style={{ width: "100%" }}
                    value={searchGene}
                    options={geneSearchOptions}
                    placeholder="Search gene, e.g. TP53"
                    filterOption={(inputValue, option) =>
                        option?.value
                            ?.toLowerCase()
                            .includes(inputValue.toLowerCase())
                    }
                    onChange={value => setSearchGene(value)}
                />
            </ControlGroup>

            <ControlGroup title="Labels">
                <ControlField
                    label="Show labels"
                    inline
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Switch
                            size="small"
                            checked={visualConfig.showLabels}
                            onChange={checked =>
                                setVisualConfig(prev => ({
                                    ...prev,
                                    showLabels: checked,
                                }))
                            }
                        />
                    </Box>
                </ControlField>

                <ControlField
                    label="Label top N"
                    tooltip="Number of most significant non-NotSig genes to display as text labels, ranked by adjusted p-value."
                >
                    <InputNumber
                        min={0}
                        max={50}
                        step={1}
                        value={visualConfig.labelTopN}
                        disabled={!visualConfig.showLabels}
                        style={{ width: "100%" }}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                labelTopN: value ?? 10,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Appearance">
                <LabeledSlider
                    label="Point size"
                    value={visualConfig.pointSize}
                    min={3}
                    max={14}
                    step={1}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            pointSize: value,
                        }))
                    }
                />

                <LabeledSlider
                    label="Point opacity"
                    value={visualConfig.pointOpacity}
                    min={0.1}
                    max={1}
                    step={0.1}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            pointOpacity: value,
                        }))
                    }
                />

                <ControlField
                    label="Aspect ratio"
                    tooltip="Controls the internal plot area width-to-height ratio. Larger values make the volcano plot wider without changing the outer responsive container."
                >
                    <Select
                        value={visualConfig.plotAspectRatio}
                        style={{ width: "100%" }}
                        options={[
                            { label: "Square 1.0", value: 1 },
                            { label: "Standard 1.3", value: 1.3 },
                            { label: "Wide 1.6", value: 1.6 },
                            { label: "Extra wide 2.0", value: 2 },
                        ]}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                plotAspectRatio: value,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>
        </Stack>
    )
}

const ControlGroup = ({ title, children }) => (
    <Stack spacing={1.2}>
        <Typography.Text strong>{title}</Typography.Text>
        {children}
    </Stack>
)

const ControlField = ({
    label,
    tooltip,
    children,
    inline = false,
}) => (
    <Stack
        direction={inline ? "row" : "column"}
        spacing={inline ? 1.5 : 0.8}
        alignItems={inline ? "center" : "stretch"}
        justifyContent={inline ? "space-between" : "flex-start"}
        sx={{ width: "100%" }}
    >
        <Stack direction="row" spacing={0.6} alignItems="center">
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                {label}
            </Typography.Text>

            {tooltip && (
                <Tooltip title={tooltip}>
                    <QuestionCircleOutlined
                        style={{
                            fontSize: 12,
                            color: "#8c8c8c",
                            cursor: "help",
                        }}
                    />
                </Tooltip>
            )}
        </Stack>

        <Box
            sx={{
                flexShrink: 0,
                minWidth: inline ? 52 : "100%",
            }}
        >
            {children}
        </Box>
    </Stack>
)

const LabeledSlider = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
}) => (
    <Stack spacing={0.4}>
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                {label}
            </Typography.Text>

            <Typography.Text
                strong
                style={{
                    fontSize: 13,
                    color: "#1f1f1f",
                }}
            >
                {value}
            </Typography.Text>
        </Stack>

        <Box
            sx={{
                px: 0.5,
                "& .ant-slider": {
                    margin: "6px 0 4px",
                },
            }}
        >
            <Slider
                min={min}
                max={max}
                step={step}
                value={value}
                tooltip={{ formatter: value => value }}
                onChange={onChange}
            />
        </Box>
    </Stack>
)

const hasVolcanoData = data => {
    if (!data?.groups) return false

    return ["NotSig", "Down", "Up"].some(group => {
        return Array.isArray(data.groups[group]) && data.groups[group].length > 0
    })
}

const getGeneSearchOptions = data => {
    if (!data?.groups) return []

    const genes = ["NotSig", "Down", "Up"]
        .flatMap(group => data.groups[group] || [])
        .map(item => item.gene_name)
        .filter(Boolean)

    return Array.from(new Set(genes)).map(gene => ({
        label: gene,
        value: gene,
    }))
}

const DatasetVolcanoAnalysisSection = ({
    dataset,
    availableDegExpressionTypes,
    height = 620,
}) => {
    const [queryConfig, setQueryConfig] = useState({
        expressionType: null,
    })
    const [visualConfig, setVisualConfig] = useState(DEFAULT_VISUAL_CONFIG)
    const [searchGene, setSearchGene] = useState("")
    const [isControlPanelCollapsed, setIsControlPanelCollapsed] = useState(false)

    useEffect(() => {
        if (!availableDegExpressionTypes?.length) {
            setQueryConfig(prev => ({
                ...prev,
                expressionType: null,
            }))
            return
        }

        setQueryConfig(prev => {
            if (availableDegExpressionTypes.includes(prev.expressionType)) {
                return prev
            }

            return {
                ...prev,
                expressionType: availableDegExpressionTypes[0],
            }
        })
    }, [availableDegExpressionTypes])

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
        mutate,
    } = useDatasetDegVolcano({
        dataset,
        expressionType: queryConfig.expressionType,
    })

    const geneSearchOptions = getGeneSearchOptions(volcanoData)

    const renderPlotContent = () => {
        if (isLoading) {
            return <LoadingView containerSx={{ height: "100%" }}/>
        }

        if (isError) {
            return <ErrorView containerSx={{ height: "100%" }}/>
        }

        if (!hasVolcanoData(volcanoData)) {
            return (
                <EmptyView
                    bordered
                    description="No volcano plot data"
                    containerSx={{ height: "100%" }}
                />
            )
        }

        return (
            <VolcanoPlot
                data={volcanoData}
                titlePrimary={titlePrimary}
                titleSecondary={titleSecondary}
                height="100%"
                logfcCutoff={visualConfig.logfcCutoff}
                padjCutoff={visualConfig.padjCutoff}
                showLabels={visualConfig.showLabels}
                labelTopN={visualConfig.labelTopN}
                pointSize={visualConfig.pointSize}
                pointOpacity={visualConfig.pointOpacity}
                plotAspectRatio={visualConfig.plotAspectRatio}
                highlightGene={searchGene.trim()}
                containerSx={{
                    minHeight: 0,
                }}
            />
        )
    }

    return (
        <Stack spacing={3}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    pb: "12px",
                }}
            >
                <Box component="h6" sx={{ fontSize: "36px", fontWeight: 700, m: 0 }}>
                    Expression Volcano Plot
                </Box>
            </Stack>

            <Box
                sx={{
                    height,
                    minHeight: 520,
                    border: "1px solid #e5e7eb",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#fff",
                }}
            >
                <Splitter>
                    {!isControlPanelCollapsed && (
                        <Splitter.Panel
                            defaultSize={320}
                            min={260}
                            max={500}
                        >
                            <VolcanoControlPanel
                                queryConfig={queryConfig}
                                setQueryConfig={setQueryConfig}
                                visualConfig={visualConfig}
                                setVisualConfig={setVisualConfig}
                                availableDegExpressionTypes={availableDegExpressionTypes}
                                geneSearchOptions={geneSearchOptions}
                                searchGene={searchGene}
                                setSearchGene={setSearchGene}
                                onCollapse={() => setIsControlPanelCollapsed(true)}
                            />
                        </Splitter.Panel>
                    )}

                    <Splitter.Panel>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                p: 2,
                                position: "relative",
                            }}
                        >
                            {isControlPanelCollapsed && (
                                <Button
                                    size="small"
                                    icon={<MenuUnfoldOutlined/>}
                                    onClick={() => setIsControlPanelCollapsed(false)}
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        left: 12,
                                        zIndex: 10,
                                    }}
                                >
                                    Controls
                                </Button>
                            )}

                            {renderPlotContent()}
                        </Box>
                    </Splitter.Panel>
                </Splitter>
            </Box>
        </Stack>
    )
}

export default DatasetVolcanoAnalysisSection
