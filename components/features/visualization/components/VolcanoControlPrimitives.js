"use client";

import { Box, Stack } from "@mui/system";
import { Slider, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export const ControlGroup = ({ title, children }) => (
    <Stack spacing={1.2}>
        <Typography.Text strong>{title}</Typography.Text>
        {children}
    </Stack>
);

export const ControlField = ({
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
);

export const LabeledSlider = ({
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
);
