"use client";

import { Select } from "antd";


const WorkflowGroupSelector = ({
    options = [],
    value,
    onChange,
    width = 220,
}) => {
    return (
        <Select
            size="small"
            style={{
                width,
            }}
            value={value}
            options={options}
            onChange={onChange}
        />
    );
};


export default WorkflowGroupSelector;
