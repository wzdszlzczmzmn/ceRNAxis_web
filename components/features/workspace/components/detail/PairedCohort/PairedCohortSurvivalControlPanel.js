"use client";

import {
    Button,
    Divider,
    InputNumber,
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

const PairedCohortSurvivalControlPanel = ({
    visualConfig,
    setVisualConfig,
    summary,
    onCollapse,
}) => {
    const logrankP = summary?.logrank_p;

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
                        Survival Controls
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

            <ControlGroup title="Summary">
                <ControlField label="Raw samples">
                    <Box>{summary?.raw_count ?? "-"}</Box>
                </ControlField>

                <ControlField label="Cleaned samples">
                    <Box>{summary?.cleaned_count ?? "-"}</Box>
                </ControlField>

                <ControlField label="Dropped samples">
                    <Box>{summary?.dropped_count ?? "-"}</Box>
                </ControlField>

                <ControlField label="Log-rank p">
                    <Box>
                        {Number.isFinite(Number(logrankP))
                            ? Number(logrankP).toExponential(3)
                            : "NA"}
                    </Box>
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Appearance">
                <ControlField label="Show 95% CI" inline>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Switch
                            size="small"
                            checked={visualConfig.showConfidenceInterval}
                            onChange={checked =>
                                setVisualConfig(prev => ({
                                    ...prev,
                                    showConfidenceInterval: checked,
                                }))
                            }
                        />
                    </Box>
                </ControlField>

                <ControlField label="Show symbols" inline>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%",
                        }}
                    >
                        <Switch
                            size="small"
                            checked={visualConfig.showSymbols}
                            onChange={checked =>
                                setVisualConfig(prev => ({
                                    ...prev,
                                    showSymbols: checked,
                                }))
                            }
                        />
                    </Box>
                </ControlField>

                <ControlField label="Line width">
                    <InputNumber
                        min={1}
                        max={6}
                        step={0.5}
                        value={visualConfig.lineWidth}
                        style={{ width: "100%" }}
                        onChange={value =>
                            setVisualConfig(prev => ({
                                ...prev,
                                lineWidth: value ?? 2.5,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>
        </Stack>
    );
};

export default PairedCohortSurvivalControlPanel;
