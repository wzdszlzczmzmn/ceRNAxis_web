"use client";

import { useMemo, useState } from "react";
import { Button, Card, Empty, Flex, Input, Space, Tabs, Typography, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import BasicChip from "@/components/ui/chips/BasicChip";

const { Search } = Input;
const { Text } = Typography;

const RNA_TYPES = [
    { key: "miRNA", label: "miRNA", color: "volcano" },
    { key: "mRNA", label: "mRNA", color: "blue" },
    { key: "lncRNA", label: "lncRNA", color: "green" },
    { key: "circRNA", label: "circRNA", color: "purple" },
];

const getRnaList = (task, key) => {
    const rnas = task?.data?.rnas ?? task?.data?.input_rnas ?? {};

    const value = rnas[key];

    if (Array.isArray(value)) return value;

    if (typeof value === "string" && value.trim()) {
        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
};

const RNAListPanel = ({ label, color, list = [] }) => {
    const [keyword, setKeyword] = useState("");

    const filteredList = useMemo(() => {
        const value = keyword.trim().toLowerCase();

        if (!value) return list;

        return list.filter(item =>
            String(item).toLowerCase().includes(value)
        );
    }, [list, keyword]);

    const handleCopy = async () => {
        if (list.length === 0) return;

        try {
            await navigator.clipboard.writeText(list.join(","));
            message.success(`${label} list copied.`);
        } catch {
            message.error("Failed to copy RNA list.");
        }
    };

    if (list.length === 0) {
        return (
            <Empty
                description={`No ${label} submitted.`}
                style={{ padding: "32px 0" }}
            />
        );
    }

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <Search
                    allowClear
                    placeholder={`Search ${label}`}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ width: 320, maxWidth: "100%" }}
                />

                <Space size={8}>
                    <Text type="secondary">
                        Showing {filteredList.length} / {list.length}
                    </Text>

                    <Button
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                    >
                        Copy List
                    </Button>
                </Space>
            </Flex>

            <Flex wrap="wrap" gap={8}>
                {filteredList.map(item => (
                    <BasicChip
                        key={item}
                        value={item}
                        color={color}
                    />
                ))}
            </Flex>
        </Space>
    );
};

const SubmittedRNAListCard = ({ task }) => {
    const items = RNA_TYPES.map(item => {
        const list = getRnaList(task, item.key);

        return {
            key: item.key,
            label: `${item.label} (${list.length})`,
            children: (
                <RNAListPanel
                    label={item.label}
                    color={item.color}
                    list={list}
                />
            ),
        };
    });

    return (
        <Card title="Submitted RNA Lists">
            <Tabs
                defaultActiveKey="miRNA"
                items={items}
                style={{ marginTop: -16 }}
            />
        </Card>
    );
};

export default SubmittedRNAListCard;
