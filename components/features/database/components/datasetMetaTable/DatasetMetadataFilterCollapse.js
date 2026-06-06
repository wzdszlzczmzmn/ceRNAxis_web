import { useMemo, useState } from "react"
import { Stack } from "@mui/system"
import { Button, Checkbox, Collapse, ConfigProvider, Tooltip, Typography } from "antd"
import { DoubleLeftOutlined } from "@ant-design/icons"
import FilterCancel from "@/components/icons/FilterCancel"
import { FILTER_LABEL_MAP } from "./datasetMetadataConfig"

const DatasetMetadataFilterCollapse = ({
    filters,
    setFilters,
    availableFilters,
    clearFilters,
}) => {
    const [activeKey, setActiveKey] = useState([
        "cancer_type",
    ])

    const collapseItems = useMemo(() => {
        return Object.keys(availableFilters).map(key => ({
            key,
            label: FILTER_LABEL_MAP[key] || key,
            children: (
                <FilterCheckBox
                    name={key}
                    options={availableFilters[key]}
                    selected={filters}
                    setSelected={setFilters}
                />
            ),
        }))
    }, [availableFilters, filters, setFilters])

    return (
        <Stack spacing={2} sx={{ pt: "8px" }}>
            <Stack direction="row" spacing={2}>
                <Button icon={<DoubleLeftOutlined rotate={90} />} onClick={() => setActiveKey([])}>
                    Collapse All
                </Button>
                <Button icon={<FilterCancel />} onClick={clearFilters}>
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
    )
}

const FilterCheckBox = ({
    name,
    options,
    selected,
    setSelected,
}) => {
    const handleChange = (checkedValue) => {
        setSelected(prev => ({
            ...prev,
            [name]: checkedValue,
        }))
    }

    return (
        <Checkbox.Group
            name={name}
            onChange={handleChange}
            value={selected[name] || []}
        >
            <Stack
                sx={{
                    width: "245px",
                    maxHeight: "400px",
                    overflowX: "auto",
                }}
            >
                {options.map((option, index) => (
                    <Checkbox value={option} key={`${name}-${index}`}>
                        <Tooltip title={option || "NA"}>
                            <Typography.Text ellipsis style={{ maxWidth: "200px" }}>
                                {option || "NA"}
                            </Typography.Text>
                        </Tooltip>
                    </Checkbox>
                ))}
            </Stack>
        </Checkbox.Group>
    )
}

export default DatasetMetadataFilterCollapse
