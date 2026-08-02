"use client";

import { useMemo, useState } from "react";
import {
    Button,
    Card,
    Empty,
    Flex,
    Input,
    Space,
    Tabs,
    Typography,
    message,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import BasicChip from "@/components/ui/chips/BasicChip";

const { Search } = Input;
const { Text } = Typography;

const BASE_RNA_TYPES = [
    {
        key: "miRNA",
        label: "miRNA",
        color: "volcano",
    },
    {
        key: "lncRNA",
        label: "lncRNA",
        color: "green",
    },
    {
        key: "circRNA",
        label: "circRNA",
        color: "purple",
    },
];

const STANDARD_MRNA_TYPE = {
    key: "mRNA",
    label: "mRNA",
    color: "blue",
};

const DIRECTIONAL_MRNA_TYPES = [
    {
        key: "mRNA_up",
        label: "mRNA Up",
        color: "green",
    },
    {
        key: "mRNA_down",
        label: "mRNA Down",
        color: "red",
    },
];

const getTaskData = (task) => {
    return task?.data ?? task ?? {};
};

const getHasMrnaDirection = (task) => {
    const data = getTaskData(task);
    const params = data.params ?? data.workflow_params ?? {};

    return Boolean(
        data.has_mrna_direction ??
        params.has_mrna_direction ??
        false
    );
};

const getRnaTypes = (task) => {
    const hasMrnaDirection = getHasMrnaDirection(task);

    return [
        BASE_RNA_TYPES[0],
        ...(hasMrnaDirection
            ? DIRECTIONAL_MRNA_TYPES
            : [STANDARD_MRNA_TYPE]),
        BASE_RNA_TYPES[1],
        BASE_RNA_TYPES[2],
    ];
};

const getRnaList = (task, key) => {
    const data = getTaskData(task);

    const rnas =
        data.rnas ??
        data.input_rnas ??
        {};

    const value = rnas[key];

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim()) {
        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }

    return [];
};

const RNAListPanel = ({
    label,
    color,
    list = [],
}) => {
    const [keyword, setKeyword] = useState("");

    const filteredList = useMemo(() => {
        const normalizedKeyword = keyword
            .trim()
            .toLowerCase();

        if (!normalizedKeyword) {
            return list;
        }

        return list.filter(item =>
            String(item)
                .toLowerCase()
                .includes(normalizedKeyword)
        );
    }, [list, keyword]);

    const handleCopy = async () => {
        if (list.length === 0) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                list.join(",")
            );

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
        <Space
            direction="vertical"
            size={16}
            style={{ width: "100%" }}
        >
            <Flex
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={12}
            >
                <Search
                    allowClear
                    placeholder={`Search ${label}`}
                    value={keyword}
                    onChange={(event) =>
                        setKeyword(event.target.value)
                    }
                    style={{
                        width: 320,
                        maxWidth: "100%",
                    }}
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
                {filteredList.map((item, index) => (
                    <BasicChip
                        key={`${item}-${index}`}
                        value={item}
                        color={color}
                    />
                ))}
            </Flex>
        </Space>
    );
};

const SubmittedRNAListCard = ({ task }) => {
    const rnaTypes = useMemo(
        () => getRnaTypes(task),
        [task]
    );

    const items = useMemo(
        () =>
            rnaTypes.map(item => {
                const list = getRnaList(
                    task,
                    item.key
                );

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
            }),
        [task, rnaTypes]
    );

    const defaultActiveKey =
        items[0]?.key ?? "miRNA";

    return (
        <Card title="Submitted RNA Lists">
            <Tabs
                defaultActiveKey={defaultActiveKey}
                items={items}
                style={{ marginTop: -16 }}
            />
        </Card>
    );
};

export default SubmittedRNAListCard;
