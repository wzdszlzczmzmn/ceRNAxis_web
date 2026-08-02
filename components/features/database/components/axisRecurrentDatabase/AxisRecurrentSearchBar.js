"use client";

import { useEffect, useMemo, useState } from "react";
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

    const patternHelp = useMemo(() => {
        const format = (
            patternMeta?.format
            || "miRNA|mRNA|lncRNA|circRNA"
        );
        const wildcard = patternMeta?.wildcard || "*";
        const examples = Array.isArray(patternMeta?.examples)
            ? patternMeta.examples
            : [];

        return (
            <div>
                <div>
                    Format: {format}
                </div>

                <div>
                    Use {wildcard} as a wildcard.
                </div>

                {
                    patternMeta?.empty_segment !== false && (
                        <div>
                            Leave a segment empty to require
                            an empty RNA field.
                        </div>
                    )
                }

                {
                    examples.map(example => (
                        <div key={example}>
                            Example: {example}
                        </div>
                    ))
                }
            </div>
        );
    }, [patternMeta]);

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
                    patternMeta?.placeholder
                    || patternMeta?.format
                    || "miRNA|mRNA|lncRNA|circRNA"
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
