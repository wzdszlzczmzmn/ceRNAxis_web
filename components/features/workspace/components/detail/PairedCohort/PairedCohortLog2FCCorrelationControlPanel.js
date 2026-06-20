"use client";

import {
    AutoComplete,
    Button,
    Divider,
    Select,
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

const INTERACTION_TYPE_OPTIONS = [
    {
        label: "miRNA-mRNA",
        value: "miRNA-mRNA",
    },
    {
        label: "miRNA-lncRNA",
        value: "miRNA-lncRNA",
    }
];

const PairedCohortLog2FCCorrelationControlPanel = ({
    queryConfig,
    setQueryConfig,
    visualConfig,
    setVisualConfig,
    searchKeyword,
    setSearchKeyword,
    searchOptions = [],
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
                        value={queryConfig.interactionType}
                        placeholder="Select interaction type"
                        options={INTERACTION_TYPE_OPTIONS}
                        onChange={value =>
                            setQueryConfig(prev => ({
                                ...prev,
                                interactionType: value,
                            }))
                        }
                    />
                </ControlField>
            </ControlGroup>

            <ControlGroup title="Highlight">
                <AutoComplete
                    allowClear
                    style={{ width: "100%" }}
                    value={searchKeyword}
                    options={searchOptions}
                    placeholder="Search miRNA or ceRNA, e.g. hsa-let-7c"
                    filterOption={(inputValue, option) =>
                        option?.value
                            ?.toLowerCase()
                            .includes(inputValue.toLowerCase())
                    }
                    onChange={value => setSearchKeyword(value)}
                />
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
                    label="Same-direction opacity"
                    value={visualConfig.pointOpacitySame}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            pointOpacitySame: value,
                        }))
                    }
                />

                <LabeledSlider
                    label="Opposite-direction opacity"
                    value={visualConfig.pointOpacityAnti}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onChange={value =>
                        setVisualConfig(prev => ({
                            ...prev,
                            pointOpacityAnti: value,
                        }))
                    }
                />
            </ControlGroup>
        </Stack>
    );
};

export default PairedCohortLog2FCCorrelationControlPanel;
