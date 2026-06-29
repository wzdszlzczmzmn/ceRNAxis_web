"use client";

import {
    Button,
    Divider,
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

const buildPairLabel = item => {
    if (!item) return "";

    return `${item.gene1} ↔ ${item.gene2}`;
};

const ExpCorrelationControlPanel = ({
    queryConfig,
    setQueryConfig,
    visualConfig,
    setVisualConfig,
    validTypes = [],
    pairOptions = [],
    onCollapse,
}) => {
    const typeOptions = validTypes.map(type => ({
        label: type,
        value: type,
    }));

    const selectedPairValue =
        queryConfig.gene1 && queryConfig.gene2
            ? `${queryConfig.gene1}__${queryConfig.gene2}`
            : undefined;

    const selectPairOptions = pairOptions.map(item => ({
        label: buildPairLabel(item),
        value: `${item.gene1}__${item.gene2}`,
        raw: item,
    }));

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
                        Correlation Controls
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
                <ControlField label="Interaction type">
                    <Select
                        size="middle"
                        style={{ width: "100%" }}
                        value={queryConfig.type}
                        placeholder="Select interaction type"
                        options={typeOptions}
                        disabled={typeOptions.length === 0}
                        onChange={value =>
                            setQueryConfig(prev => ({
                                ...prev,
                                type: value,
                                gene1: null,
                                gene2: null,
                            }))
                        }
                    />
                </ControlField>

                <ControlField label="Gene pair">
                    <Select
                        showSearch
                        allowClear
                        size="middle"
                        style={{ width: "100%" }}
                        value={selectedPairValue}
                        placeholder="Select gene pair"
                        options={selectPairOptions}
                        optionFilterProp="label"
                        disabled={selectPairOptions.length === 0}
                        onChange={(value, option) => {
                            if (!value || !option?.raw) {
                                setQueryConfig(prev => ({
                                    ...prev,
                                    gene1: null,
                                    gene2: null,
                                }));
                                return;
                            }

                            setQueryConfig(prev => ({
                                ...prev,
                                gene1: option.raw.gene1,
                                gene2: option.raw.gene2,
                                type: option.raw.type,
                            }));
                        }}
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Regression">
                <ControlField label="Show regression line" inline>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Switch
                            size="small"
                            checked={visualConfig.showRegressionLine}
                            onChange={checked =>
                                setVisualConfig(prev => ({
                                    ...prev,
                                    showRegressionLine: checked,
                                }))
                            }
                        />
                    </Box>
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Appearance">
                <LabeledSlider
                    label="Point size"
                    value={visualConfig.pointSize}
                    min={4}
                    max={16}
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
            </ControlGroup>
        </Stack>
    );
};

export default ExpCorrelationControlPanel;
