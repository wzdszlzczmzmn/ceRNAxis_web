"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { Stack } from "@mui/system";
import {
    Button,
    Checkbox,
    Collapse,
    ConfigProvider,
    Tooltip,
    Typography,
} from "antd";
import { DoubleLeftOutlined } from "@ant-design/icons";

import FilterCancel from "@/components/icons/FilterCancel";


const AxisRecurrentFilterCollapse = ({
    filters,
    setFilters,
    filterOptions,
    clearFilters,
}) => {
    const [activeKey, setActiveKey] = useState([]);

    const itemFields = useMemo(() => {
        return (filterOptions?.fields || []).filter(
            item => item?.field_type === "items"
        );
    }, [filterOptions]);

    useEffect(() => {
        setActiveKey(
            itemFields.map(item => item.field_name)
        );
    }, [itemFields]);

    const collapseItems = useMemo(() => {
        return itemFields.map(item => ({
            key: item.field_name,
            label: item.field_label,
            children: (
                <FilterItemsGroup
                    name={item.field_name}
                    options={item.options || []}
                    selected={filters}
                    setSelected={setFilters}
                />
            ),
        }));
    }, [
        itemFields,
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


const FilterItemsGroup = ({
    name,
    options,
    selected,
    setSelected,
}) => {
    const selectedValues = selected?.[name] || [];

    const handleChange = checkedValues => {
        setSelected({
            ...selected,
            [name]: checkedValues,
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
                        option &&
                        typeof option === "object"
                    )
                        ? option
                        : {
                            label: String(option),
                            value: option,
                        };

                    return (
                        <Checkbox
                            key={String(
                                normalizedOption.value
                            )}
                            value={normalizedOption.value}
                        >
                            <Tooltip
                                title={normalizedOption.label}
                            >
                                <Typography.Text
                                    ellipsis
                                    style={{
                                        maxWidth: "200px",
                                    }}
                                >
                                    {normalizedOption.label}
                                </Typography.Text>
                            </Tooltip>
                        </Checkbox>
                    );
                })}
            </Stack>
        </Checkbox.Group>
    );
};

export default AxisRecurrentFilterCollapse;
