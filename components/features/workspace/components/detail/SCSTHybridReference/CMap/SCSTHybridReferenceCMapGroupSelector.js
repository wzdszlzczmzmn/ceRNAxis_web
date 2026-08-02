"use client";

import { Select } from "antd";

const SCSTHybridReferenceCMapGroupSelector = ({
    groupOptions = [],
    value,
    onChange,
}) => {
    return (
        <Select
            size="small"
            style={{
                width: 220,
            }}
            value={value}
            options={
                groupOptions.map(item => ({
                    label: item.label,
                    value: item.value,
                }))
            }
            onChange={onChange}
        />
    );
};

export default SCSTHybridReferenceCMapGroupSelector;
