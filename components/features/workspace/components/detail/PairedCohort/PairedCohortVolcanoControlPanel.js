"use client";

import {
    AutoComplete,
    Button,
    Divider,
    InputNumber,
    Select,
    Switch,
} from "antd";
import { Box, Stack } from "@mui/system";
import {
    MenuFoldOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import {
    ControlField,
    ControlGroup,
    LabeledSlider,
} from "@/components/features/visualization/components/VolcanoControlPrimitives";

const RNA_TYPE_OPTIONS = [
    {
        label: "mRNA",
        value: "mRNA",
    },
    {
        label: "miRNA",
        value: "miRNA",
    },
    {
        label: "lncRNA",
        value: "lncRNA",
    },
];

const PairedCohortVolcanoControlPanel = ({
    queryConfig,
    setQueryConfig,
    visualConfig,
    setVisualConfig,
    geneSearchOptions = [],
    searchGene,
    setSearchGene,
    currentCutoffs,
    onCollapse,
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
                    <SettingOutlined />

                    <Box
                        component="h6"
                        sx={{
                            m: 0,
                            fontSize: 18,
                            fontWeight: 700,
                        }}
                    >
                        Volcano Controls
                    </Box>
                </Stack>

                <Button
                    size="small"
                    type="text"
                    icon={<MenuFoldOutlined />}
                    onClick={onCollapse}
                />
            </Stack>

            <Divider style={{ margin: "4px 0 8px" }} />

            <ControlGroup title="Data">
                <ControlField label="RNA type">
                    <Select
                        size="middle"
                        style={{ width: "100%" }}
                        value={queryConfig.rnaType}
                        placeholder="Select RNA type"
                        options={RNA_TYPE_OPTIONS}
                        onChange={value =>
                            setQueryConfig(prev => ({
                                ...prev,
                                rnaType: value,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Thresholds">
                <ControlField label="log2FC cutoff">
                    <InputNumber
                        disabled
                        value={currentCutoffs?.logfc_cutoff}
                        style={{ width: "100%" }}
                    />
                </ControlField>

                <ControlField label="Adjusted p-value cutoff">
                    <InputNumber
                        disabled
                        value={currentCutoffs?.padj_cutoff}
                        style={{ width: "100%" }}
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
                <ControlField label="Show labels" inline>
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
                    step={0.05}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            pointOpacity: value,
                        }))
                    }
                />

                <ControlField
                    label="Aspect ratio"
                    tooltip="Controls the internal plot area width-to-height ratio."
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
    );
};

export default PairedCohortVolcanoControlPanel;
