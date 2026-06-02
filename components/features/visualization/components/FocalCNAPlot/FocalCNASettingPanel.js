import { useMemo, useState } from "react"
import { Box, Stack } from "@mui/system"
import { Collapse, ConfigProvider, Select } from "antd"
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons"
import { SettingNumberInput } from "@/components/features/visualization/components/input/SettingInput"
import {
    RenderButtonGroup
} from "@/components/features/visualization/components/CNAEmbeddingMap/CNAEmbeddingMapSettingPanel"

const CNTypeLabelMap = {
    allele: 'Allele-Specific Copy Number Segment',
    cns: 'Copy Number Segment',
    mcns: 'Masked Copy Number Segments'
}

const buildCNTypeOptions = (focalOptions) => {
    return Object.keys(focalOptions).map(key => ({
        label: CNTypeLabelMap[key],
        value: key
    }))
}

const buildWorkflowOptions = (focalOptions ,type) => {
    return focalOptions[type].map(workflow => ({
        label: workflow,
        value: workflow
    }))
}

const chromosomeOptions = [
    { value: 'all', label: 'All' },
    { value: 'chr1', label: 'Chr1' },
    { value: 'chr2', label: 'Chr2' },
    { value: 'chr3', label: 'Chr3' },
    { value: 'chr4', label: 'Chr4' },
    { value: 'chr5', label: 'Chr5' },
    { value: 'chr6', label: 'Chr6' },
    { value: 'chr7', label: 'Chr7' },
    { value: 'chr8', label: 'Chr8' },
    { value: 'chr9', label: 'Chr9' },
    { value: 'chr10', label: 'Chr10' },
    { value: 'chr11', label: 'Chr11' },
    { value: 'chr12', label: 'Chr12' },
    { value: 'chr13', label: 'Chr13' },
    { value: 'chr14', label: 'Chr14' },
    { value: 'chr15', label: 'Chr15' },
    { value: 'chr16', label: 'Chr16' },
    { value: 'chr17', label: 'Chr17' },
    { value: 'chr18', label: 'Chr18' },
    { value: 'chr19', label: 'Chr19' },
    { value: 'chr20', label: 'Chr20' },
    { value: 'chr21', label: 'Chr21' },
    { value: 'chr22', label: 'Chr22' },
]

const DataSetting = ({
    focalOptions,
    renderDataSetting,
    handleRenderDataSettingChange,
    onRender,
    onReset
}) => {
    const CNTypeOptions = buildCNTypeOptions(focalOptions)
    const workflowOptions = buildWorkflowOptions(focalOptions, renderDataSetting['type'])

    return (
        <Stack spacing={3}>
            <Stack spacing={1}>
                <Box sx={{ fontWeight: 500 }}>Protocol Type:</Box>
                <Select
                    value={renderDataSetting.type}
                    onChange={(value) => handleRenderDataSettingChange('type', value)}
                    options={CNTypeOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
                <Box sx={{ fontWeight: 500 }}>Workflow:</Box>
                <Select
                    value={renderDataSetting.workflow}
                    onChange={(value) => handleRenderDataSettingChange('workflow', value)}
                    options={workflowOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
                <Box sx={{ fontWeight: 500 }}>Chromosome:</Box>
                <Select
                    value={renderDataSetting.chromosome}
                    onChange={(value) => handleRenderDataSettingChange('chromosome', value)}
                    options={chromosomeOptions}
                    style={{ width: '240px' }}
                    size='large'
                />
            </Stack>
            <RenderButtonGroup
                onRender={onRender}
                resetRenderData={onReset}
            />
        </Stack>

    )
}

const ChartSetting = ({ config, configKey, handleConfigChange }) => (
    <Stack spacing={2}>
        <SettingNumberInput
            title='Margin Horizontal:'
            config={config}
            configKey={configKey}
            configSubKey='marginX'
            handleConfigChange={handleConfigChange}
        />
        <SettingNumberInput
            title='Margin Vertical:'
            config={config}
            configKey={configKey}
            configSubKey='marginY'
            handleConfigChange={handleConfigChange}
        />
    </Stack>
)

const buildCollapseItems = (
    config,
    handleConfigChange,
    focalOptions,
    renderDataSetting,
    handleRenderDataSettingChange,
    onRender,
    onReset
) => [
    {
        key: 'data',
        label: 'Data Setting',
        extra: <PieChartOutlined/>,
        children: (
            <DataSetting
                focalOptions={focalOptions}
                renderDataSetting={renderDataSetting}
                handleRenderDataSettingChange={handleRenderDataSettingChange}
                onRender={onRender}
                onReset={onReset}
            />
        )
    },
    {
        key: 'chart',
        label: 'Chart Setting',
        extra: <SettingOutlined/>,
        children: (
            <ChartSetting
                config={config}
                configKey='chart'
                handleConfigChange={handleConfigChange}
            />
        )
    }
]

const FocalCNASettingPanel = ({
    focalOptions,
    renderDataSetting,
    handleRenderDataSettingChange,
    config,
    handleConfigChange,
    onRender,
    onReset
}) => {
    const [activeKey, setActiveKey] = useState(['data', 'chart'])

    const items = useMemo(() => {
        return buildCollapseItems(
            config,
            handleConfigChange,
            focalOptions,
            renderDataSetting,
            handleRenderDataSettingChange,
            onRender,
            onReset
        )
    }, [config, focalOptions, handleConfigChange, handleRenderDataSettingChange, onRender, onReset, renderDataSetting])

    const handleCollapseChange = (props) => {
        setActiveKey(props)
    }

    return (
        <Box
            sx={{
                paddingLeft: '12px',
                paddingTop: '12px',
                height: '920px',
                maxHeight: '920px'
            }}
        >
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: '#FFFFFF',
                            fontSize: '16px',
                            headerPadding: '16px 16px'
                        }
                    }
                }}
            >
                <Collapse
                    items={items}
                    activeKey={activeKey}
                    onChange={handleCollapseChange}
                    size='middle'
                />
            </ConfigProvider>
            <Box sx={{ paddingTop: '12px' }}></Box>
        </Box>
    )
}

export default FocalCNASettingPanel
