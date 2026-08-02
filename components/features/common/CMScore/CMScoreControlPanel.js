"use client";

import {
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
} from "@/components/features/visualization/components/VolcanoControlPrimitives";

const getItemLabel = taskType => {
    if (taskType === "CustomListQueryTask") {
        return "Gene";
    }

    return "Axis";
};

const getItemPlaceholder = taskType => {
    if (taskType === "CustomListQueryTask") {
        return "Select gene";
    }

    return "Select axis";
};

const CMScoreControlPanel = ({
    taskType,

    groupOptions = [],
    groupValue = null,
    groupLabel = "Group",
    onGroupChange,

    item,
    itemOptions = [],
    itemLoading = false,
    onItemChange,

    dataset,
    datasetOptions = [],
    datasetLoading = false,
    onDatasetChange,

    onCollapse,
}) => {
    const itemLabel = getItemLabel(taskType);

    const hasGroupSelector =
        groupOptions.length > 0;

    const itemDisabled =
        hasGroupSelector &&
        !groupValue;

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
                        CM-Score Controls
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
                    <ControlField
                        label={groupLabel}
                        tooltip="Select the group used for CM-score analysis."
                    >
                        <Select
                            showSearch
                            value={groupValue ?? undefined}
                            options={groupOptions}
                            placeholder="Select group"
                            style={{ width: "100%" }}
                            optionFilterProp="label"
                            onChange={onGroupChange}
                        />
                    </ControlField>
                )}

                <ControlField
                    label={itemLabel}
                    tooltip={
                        taskType === "CustomListQueryTask"
                            ? "Select a gene with an available CM-score result file."
                            : "Select an axis with an available CM-score result file."
                    }
                >
                    <Select
                        showSearch
                        allowClear
                        loading={itemLoading}
                        disabled={
                            groupOptions.length > 0 &&
                            !groupValue
                        }
                        value={item || undefined}
                        options={itemOptions}
                        placeholder={
                            groupOptions.length > 0 &&
                            !groupValue
                                ? "Select group first"
                                : getItemPlaceholder(taskType)
                        }
                        style={{ width: "100%" }}
                        optionFilterProp="label"
                        onChange={onItemChange}
                    />
                </ControlField>

                <ControlField
                    label="Drug signature"
                    tooltip="Select a drug perturbation signature from the selected CM-score result file."
                >
                    <Select
                        showSearch
                        allowClear
                        loading={datasetLoading}
                        disabled={!item}
                        value={dataset || undefined}
                        options={datasetOptions}
                        placeholder={
                            item
                                ? "Select drug signature"
                                : `Select ${itemLabel.toLowerCase()} first`
                        }
                        style={{ width: "100%" }}
                        optionFilterProp="label"
                        popupMatchSelectWidth={false}
                        onChange={onDatasetChange}
                    />
                </ControlField>
            </ControlGroup>
        </Stack>
    );
};

export default CMScoreControlPanel;
