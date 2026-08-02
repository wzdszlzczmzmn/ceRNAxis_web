"use client";

import {
    useMemo,
    useState,
} from "react";

import { Stack } from "@mui/system";
import {
    Button,
    Checkbox,
    Collapse,
    ConfigProvider,
    InputNumber,
    Radio,
    Tooltip,
    Typography,
} from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";

import FilterCancel from "@/components/icons/FilterCancel";


const ALL_BOOLEAN_FILTER_VALUE = "__all__";

const SINGLE_BOOLEAN_FILTER_FIELDS = new Set([
    "has_axis_final",
    "has_sponge",
    "has_both_result_context",
    "regulation_available",
]);


const isSingleBooleanFilter = field => {
    if (
        !SINGLE_BOOLEAN_FILTER_FIELDS.has(
            field?.field_name
        )
    ) {
        return false;
    }

    const options = Array.isArray(field?.options)
        ? field.options
        : [];

    return (
        options.length > 0
        && options.every(option =>
            typeof option?.value === "boolean"
        )
    );
};


const setFilterValue = ({
    filters,
    setFilters,
    name,
    value,
}) => {
    const nextFilters = {
        ...(filters || {}),
    };

    const shouldDelete = (
        value === null
        || value === undefined
        || value === ""
        || (
            Array.isArray(value)
            && value.length === 0
        )
    );

    if (shouldDelete) {
        delete nextFilters[name];
    } else {
        nextFilters[name] = value;
    }

    setFilters(nextFilters);
};


const AxisRecurrentFilterCollapse = ({
    filters,
    setFilters,
    filterOptions,
    clearFilters,
}) => {
    const [activeKey, setActiveKey] = useState([
        "axis_type",
        "source",
        "has_axis_final",
        "has_sponge",
        "has_both_result_context",
    ]);

    const fields = useMemo(() => {
        return Array.isArray(filterOptions?.fields)
            ? filterOptions.fields
            : [];
    }, [filterOptions]);

    const collapseItems = useMemo(() => {
        return fields.map(field => {
            let children = null;

            if (
                field.field_type === "items"
                && isSingleBooleanFilter(field)
            ) {
                children = (
                    <FilterBooleanRadioGroup
                        name={field.field_name}
                        options={field.options || []}
                        filters={filters}
                        setFilters={setFilters}
                    />
                );
            } else if (
                field.field_type === "items"
            ) {
                children = (
                    <FilterItemsGroup
                        name={field.field_name}
                        options={field.options || []}
                        filters={filters}
                        setFilters={setFilters}
                    />
                );
            } else if (
                field.field_type === "number"
            ) {
                children = (
                    <FilterNumberInput
                        name={field.field_name}
                        minimum={field.minimum}
                        filters={filters}
                        setFilters={setFilters}
                    />
                );
            }

            return {
                key: field.field_name,
                label: field.field_label,
                children,
            };
        });
    }, [
        fields,
        filters,
        setFilters,
    ]);

    return (
        <Stack spacing={2} sx={{ pt: "8px" }}>
            <Stack direction="row" spacing={2}>
                <Button
                    icon={
                        <DoubleLeftOutlined rotate={90} />
                    }
                    onClick={() => setActiveKey([])}
                >
                    Collapse All
                </Button>

                <Button
                    icon={<FilterCancel />}
                    onClick={clearFilters}
                >
                    Clear Filters
                </Button>
            </Stack>

            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: "#FFFFFF",
                        },
                    },
                }}
            >
                <Collapse
                    items={collapseItems}
                    activeKey={activeKey}
                    onChange={setActiveKey}
                />
            </ConfigProvider>
        </Stack>
    );
};


const FilterBooleanRadioGroup = ({
    name,
    options,
    filters,
    setFilters,
}) => {
    const currentValue = filters?.[name];

    const selectedValue = (
        typeof currentValue === "boolean"
    )
        ? currentValue
        : ALL_BOOLEAN_FILTER_VALUE;

    const radioOptions = [
        {
            label: "Any",
            value: ALL_BOOLEAN_FILTER_VALUE,
        },
        ...options.map(option => ({
            label: option?.label ?? String(
                option?.value
            ),
            value: option?.value,
        })),
    ];

    const handleChange = event => {
        const nextValue = event.target.value;

        setFilterValue({
            filters,
            setFilters,
            name,
            value: (
                nextValue === ALL_BOOLEAN_FILTER_VALUE
                    ? undefined
                    : nextValue
            ),
        });
    };

    return (
        <Radio.Group
            name={name}
            value={selectedValue}
            onChange={handleChange}
        >
            <Stack spacing={1}>
                {radioOptions.map(option => (
                    <Radio
                        key={`${name}:${String(
                            option.value
                        )}`}
                        value={option.value}
                    >
                        {option.label}
                    </Radio>
                ))}
            </Stack>
        </Radio.Group>
    );
};


const FilterItemsGroup = ({
    name,
    options,
    filters,
    setFilters,
}) => {
    const selectedValues = Array.isArray(
        filters?.[name]
    )
        ? filters[name]
        : [];

    const handleChange = checkedValues => {
        setFilterValue({
            filters,
            setFilters,
            name,
            value: checkedValues,
        });
    };

    return (
        <Checkbox.Group
            name={name}
            value={selectedValues}
            onChange={handleChange}
        >
            <Stack
                sx={{
                    width: "250px",
                    maxHeight: "220px",
                    overflowY: "auto",
                    overflowX: "hidden",
                }}
            >
                {options.map(option => {
                    const normalizedOption = (
                        option
                        && typeof option === "object"
                    )
                        ? option
                        : {
                            label: String(option),
                            value: option,
                        };

                    return (
                        <Checkbox
                            key={`${name}:${String(
                                normalizedOption.value
                            )}`}
                            value={normalizedOption.value}
                        >
                            <Tooltip
                                title={
                                    normalizedOption.label
                                }
                            >
                                <Typography.Text
                                    ellipsis
                                    style={{
                                        maxWidth: "200px",
                                    }}
                                >
                                    {
                                        normalizedOption.label
                                    }
                                </Typography.Text>
                            </Tooltip>
                        </Checkbox>
                    );
                })}
            </Stack>
        </Checkbox.Group>
    );
};


const FilterNumberInput = ({
    name,
    minimum,
    filters,
    setFilters,
}) => {
    const value = filters?.[name] ?? null;

    const handleChange = nextValue => {
        setFilterValue({
            filters,
            setFilters,
            name,
            value: nextValue,
        });
    };

    return (
        <Stack spacing={1} sx={{ width: "250px" }}>
            <InputNumber
                value={value}
                min={minimum ?? 0}
                precision={0}
                controls
                placeholder={
                    minimum !== undefined
                        ? `Minimum: ${minimum}`
                        : "Enter a value"
                }
                onChange={handleChange}
                style={{
                    width: "235px",
                }}
            />

            <Typography.Text type="secondary">
                Leave empty to disable this filter.
            </Typography.Text>
        </Stack>
    );
};


export default AxisRecurrentFilterCollapse;
