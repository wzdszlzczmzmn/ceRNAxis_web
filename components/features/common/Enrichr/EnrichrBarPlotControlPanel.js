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
} from "@/components/features/visualization/components/VolcanoControlPrimitives";

const DIRECTION_OPTIONS = [
    {
        label: "mRNA Up",
        value: "up",
    },
    {
        label: "mRNA Down",
        value: "down",
    },
];

const X_AXIS_SCALE_OPTIONS = [
    {
        label: "Linear Combined Score",
        value: "linear",
    },
    {
        label: "Log10 Combined Score",
        value: "log10",
    },
];

const RANKING_METHOD_OPTIONS = [
    {
        label: "Combined Score descending",
        value: "combined_score_desc",
    },
    {
        label: "Combined Score ascending",
        value: "combined_score_asc",
    },
    {
        label: "Adjusted p-value",
        value: "adjusted_p_value",
    },
    {
        label: "Odds Ratio descending",
        value: "odds_ratio_desc",
    },
];

const EnrichrBarPlotControlPanel = ({
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
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <SettingOutlined />

                    <Box
                        component="h6"
                        sx={{
                            m: 0,
                            fontSize: 18,
                            fontWeight: 700,
                        }}
                    >
                        Enrichment Controls
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
                <ControlField
                    label="mRNA direction"
                    tooltip="Select the upregulated or downregulated mRNA Enrichment result."
                >
                    <Select
                        value={visualConfig.direction}
                        style={{ width: "100%" }}
                        options={DIRECTION_OPTIONS}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                direction: value,
                                searchInput: "",
                                focusKeyword: "",
                            }))
                        }
                    />
                </ControlField>

                <ControlField
                    label="X-axis scale"
                    tooltip="Linear shows the original Combined Score. Log10 compresses large differences between pathways."
                >
                    <Select
                        value={visualConfig.xAxisScale}
                        style={{ width: "100%" }}
                        options={X_AXIS_SCALE_OPTIONS}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                xAxisScale: value,
                            }))
                        }
                    />
                </ControlField>

                <ControlField
                    label="Ranking method"
                    tooltip="Controls how terms are ranked before displaying Top N or all terms."
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
                    label="Show all terms"
                    tooltip="When enabled, all terms are shown and a vertical scrollbar is displayed."
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
                    label="Top terms"
                    tooltip="Maximum number of terms displayed when Show all terms is disabled."
                >
                    <InputNumber
                        min={5}
                        max={30}
                        step={1}
                        disabled={visualConfig.showAll}
                        value={visualConfig.topN}
                        style={{ width: "100%" }}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                topN: Math.min(
                                    30,
                                    Math.max(5, value ?? 30)
                                ),
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Focus">
                <ControlField
                    label="Search term"
                    tooltip="Search is available in Show all mode. The selected term is moved into the visible window and highlighted."
                >
                    <AutoComplete
                        allowClear
                        disabled={!visualConfig.showAll}
                        value={visualConfig.searchInput}
                        options={pathwaySearchOptions}
                        style={{ width: "100%" }}
                        placeholder={
                            visualConfig.showAll
                                ? "Select term to focus"
                                : "Enable Show all terms first"
                        }
                        filterOption={(inputValue, option) =>
                            String(option?.value ?? "")
                                .toLowerCase()
                                .includes(
                                    inputValue.toLowerCase()
                                )
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
        </Stack>
    );
};

export default EnrichrBarPlotControlPanel;
