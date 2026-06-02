import { useEffect, useMemo, useState } from "react"
import { Stack } from "@mui/system"
import { Button, Collapse, ConfigProvider, Tooltip, Typography, Checkbox } from "antd"
import { DoubleLeftOutlined } from "@ant-design/icons"
import FilterCancel from "@/components/icons/FilterCancel"

const AxisFilterCollapse = ({ filters, setFilters, filterOptions, clearFilters }) => {
    const [activeKey, setActiveKey] = useState([])

    const collapseItems = useMemo(() => {
        return buildCollapseItems(filterOptions, filters, setFilters)
    }, [filterOptions, filters, setFilters])

    useEffect(() => {
        const fieldNames = (filterOptions?.fields || []).map(
            item => item['field_name']
        );

        setActiveKey(fieldNames)
    }, [filterOptions])

    const clearActiveKeys = () => {
        setActiveKey([])
    }

    const handleCollapseChange = (props) => {
        setActiveKey(props)
    }

    return (
        <Stack spacing={2} sx={{ pt: '8px' }}>
            <FilterOptions clearActiveKeys={clearActiveKeys} clearFilters={clearFilters}/>
            <ConfigProvider
                theme={{
                    components: {
                        Collapse: {
                            headerBg: '#FFFFFF'
                        }
                    }
                }}
            >
                <Collapse
                    items={collapseItems}
                    activeKey={activeKey}
                    onChange={handleCollapseChange}
                />
            </ConfigProvider>
        </Stack>
    )
}

const FilterOptions = ({ clearActiveKeys, clearFilters }) => (
    <Stack direction="row" spacing={2}>
        <Button icon={<DoubleLeftOutlined rotate={90}/>} onClick={clearActiveKeys}>Collapse All</Button>
        <Button icon={<FilterCancel/>} onClick={clearFilters}>Clear Filters</Button>
    </Stack>
)

const DefaultOptionWrapper = ({ option }) => (
    <Tooltip title={option}>
        <Typography.Text
            ellipsis={true}
            style={{
                maxWidth: '200px'
            }}
        >
            {option}
        </Typography.Text>
    </Tooltip>
)

const defaultFormatFn = (value) => {
    return value ? value : 'NA'
}

export const FilterCheckBox = ({
    name,
    options,
    selected,
    setSelected,
    OptionWrapper = DefaultOptionWrapper,
    formatFn = defaultFormatFn
}) => {
    const handelChange = (checkedValue) => {
        setSelected(prev => ({
            ...prev,
            [name]: checkedValue
        }))
    }

    return (
        <Checkbox.Group name={name} onChange={handelChange} value={selected[name]}>
            <Stack
                sx={{
                    width: '250px',
                    maxHeight: '200px',
                    overflowX: 'auto'
                }}
            >
                {
                    options.map(
                        (option, index) =>
                            <Checkbox
                                value={option}
                                key={index}
                            >
                                <OptionWrapper option={formatFn ? formatFn(option) : option}/>
                            </Checkbox>
                    )
                }
            </Stack>
        </Checkbox.Group>
    )
}

const buildCollapseItems = (filterOptions, filters, setFilters) => {
    return (filterOptions?.fields || []).map(
        item => ({
            key: item['field_name'],
            label: item['field_label'],
            children:
                <FilterCheckBox
                    name={item['field_name']}
                    options={item['options']}
                    selected={filters}
                    setSelected={setFilters}
                    formatFn={defaultFormatFn}
                />
        })
    )
}

export default AxisFilterCollapse
