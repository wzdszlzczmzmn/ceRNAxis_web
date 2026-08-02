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

const RANKING_METHOD_OPTIONS = [
    {
        label: "Absolute NES",
        value: "abs_nes",
    },
    {
        label: "NES descending",
        value: "nes_desc",
    },
    {
        label: "NES ascending",
        value: "nes_asc",
    },
    {
        label: "FDR significance",
        value: "fdr",
    },
];

const DEGPathwayControlPanel = ({
    groupOptions = [],
    groupValue = null,
    groupLabel = "Group",
    onGroupChange,

    visualConfig,
    setVisualConfig,
    pathwaySearchOptions = [],
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
                        Pathway Controls
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
                {groupOptions.length > 0 && (
                    <ControlField label={groupLabel}>
                        <Select
                            value={groupValue ?? undefined}
                            placeholder="Select group"
                            options={groupOptions}
                            style={{ width: "100%" }}
                            onChange={onGroupChange}
                        />
                    </ControlField>
                )}

                <ControlField
                    label="Ranking method"
                    tooltip="Controls how pathways are ranked before displaying Top N or all pathways."
                >
                    <Select
                        value={visualConfig.rankingMethod}
                        style={{ width: "100%" }}
                        options={RANKING_METHOD_OPTIONS}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                rankingMethod: value,
                            }))
                        }
                    />
                </ControlField>

                <ControlField
                    label="Show all pathways"
                    tooltip="When enabled, all pathways are included and a vertical dataZoom scrollbar is shown on the Y axis."
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
                            checked={visualConfig.showAll}
                            onChange={checked =>
                                setVisualConfig(prev => ({
                                    ...prev,
                                    showAll: checked,
                                    searchInput: checked
                                        ? prev.searchInput
                                        : "",
                                    focusKeyword: checked
                                        ? prev.focusKeyword
                                        : "",
                                }))
                            }
                        />
                    </Box>
                </ControlField>

                <ControlField
                    label="Top pathways"
                    tooltip="Number of pathways displayed when Show all pathways is disabled."
                >
                    <InputNumber
                        min={5}
                        max={100}
                        step={1}
                        disabled={visualConfig.showAll}
                        value={visualConfig.topN}
                        style={{ width: "100%" }}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                topN: value ?? 30,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Focus">
                <ControlField
                    label="Search pathway"
                    tooltip="Search is only available in Show all mode. The matched pathway will be highlighted and moved near the center of the visible window."
                >
                    <AutoComplete
                        allowClear
                        disabled={!visualConfig.showAll}
                        value={visualConfig.searchInput}
                        options={pathwaySearchOptions}
                        style={{ width: "100%" }}
                        placeholder={
                            visualConfig.showAll
                                ? "Select pathway to focus"
                                : "Enable Show all pathways first"
                        }
                        filterOption={(inputValue, option) =>
                            option?.value
                                ?.toLowerCase()
                                .includes(inputValue.toLowerCase())
                        }
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                searchInput: value,
                                focusKeyword: value
                                    ? prev.focusKeyword
                                    : "",
                            }))
                        }
                        onSelect={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                searchInput: value,
                                focusKeyword: value,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Appearance">
                <LabeledSlider
                    label="Min bubble size"
                    value={visualConfig.minBubbleSize}
                    min={4}
                    max={24}
                    step={1}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            minBubbleSize: value,
                        }))
                    }
                />

                <LabeledSlider
                    label="Max bubble size"
                    value={visualConfig.maxBubbleSize}
                    min={16}
                    max={60}
                    step={1}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            maxBubbleSize: value,
                        }))
                    }
                />
            </ControlGroup>
        </Stack>
    );
};

export default DEGPathwayControlPanel;
