"use client";

import { useEffect, useState } from "react";
import {
    Button,
    Input,
    Space,
    Tooltip,
} from "antd";
import {
    InfoCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";


const AxisRecurrentSearchBar = ({
    value = "",
    onSearch,
    patternMeta = null,
}) => {
    const [draftPattern, setDraftPattern] = useState(value);

    useEffect(() => {
        setDraftPattern(value);
    }, [value]);

    const handleSubmit = () => {
        onSearch(draftPattern.trim());
    };

    const handleClear = () => {
        setDraftPattern("");
        onSearch("");
    };

    const patternHelp = (
        <div>
            <div>
                Format: miRNA|mRNA|lncRNA|circRNA
            </div>
            <div>
                Use * as a wildcard.
            </div>
            <div>
                Leave a segment empty to require an empty RNA field.
            </div>
            <div>
                Example: hsa-mir-*|BRD7|BAZ1A|
            </div>
        </div>
    );

    return (
        <Space.Compact>
            <Input
                allowClear
                value={draftPattern}
                onChange={event =>
                    setDraftPattern(event.target.value)
                }
                onClear={handleClear}
                onPressEnter={handleSubmit}
                placeholder={
                    patternMeta?.placeholder ||
                    "miRNA|mRNA|lncRNA|circRNA"
                }
                suffix={
                    <Tooltip title={patternHelp}>
                        <InfoCircleOutlined />
                    </Tooltip>
                }
                style={{
                    width: 420,
                }}
            />

            <Button
                icon={<SearchOutlined />}
                onClick={handleSubmit}
            />
        </Space.Compact>
    );
};

export default AxisRecurrentSearchBar;
