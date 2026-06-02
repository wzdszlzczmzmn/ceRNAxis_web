import { useState } from "react"
import { Button, Input, Select, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const options = [
    {
        value: 'miRNA',
        label: 'miRNA'
    },
    {
        value: 'ceRNA',
        label: 'ceRNA'
    }
]

const AxisSearchBar = ({ onSearch }) => {
    const [draftSearch, setDraftSearch] = useState({
        field: "miRNA",
        value: "",
    })

    const handleSubmit = () => {
        onSearch({
            field: draftSearch.field,
            value: draftSearch.value.trim(),
        })
    }

    return (
        <Space.Compact>
            <Select
                value={draftSearch.field}
                options={options}
                onChange={(field) =>
                    setDraftSearch(prev => ({
                        ...prev,
                        field,
                        value: "",
                    }))
                }
                style={{ width: 120 }}
            />

            <Input
                allowClear
                value={draftSearch.value}
                onChange={(e) =>
                    setDraftSearch(prev => ({
                        ...prev,
                        value: e.target.value,
                    }))
                }
                onClear={() => {
                    setDraftSearch(prev => ({
                        ...prev,
                        value: "",
                    }));

                    onSearch({
                        field: draftSearch.field,
                        value: "",
                    });
                }}
                onPressEnter={handleSubmit}
                placeholder="Search ceRNA Axis..."
            />

            <Button icon={<SearchOutlined />} onClick={handleSubmit}/>
        </Space.Compact>
    );
}

export default AxisSearchBar
