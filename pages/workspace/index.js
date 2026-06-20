"use client";

import { useState } from "react";
import {
    Button,
    Input,
} from "antd";
import { Box, Stack } from "@mui/system";
import { SearchOutlined } from "@ant-design/icons";
import api from "@/lib/api/axios";
import { useGlobalMessage } from "@/context/MessageContext";
import { getQueryTaskURL } from "@/lib/api/analysis";
import TaskInformationDetail from "@/components/features/workspace/components/taskInformation/TaskInformationDetail";

const Workspace = () => {
    const messageApi = useGlobalMessage();

    const [taskUUID, setTaskUUID] = useState("");
    const [taskInformation, setTaskInformation] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleUUIDChange = (e) => {
        setTaskUUID(e.target.value);
    };

    const handleSearch = async () => {
        const value = taskUUID.trim();

        if (!value) {
            messageApi.warning("Please enter a task UUID.");
            return;
        }

        try {
            setIsSearching(true);

            const response = await api.get(getQueryTaskURL(), {
                params: {
                    taskUUID: value,
                },
            });

            setTaskInformation(response.data);
        } catch (error) {
            setTaskInformation(null);

            const message =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.message ||
                "Please check the UUID you submitted.";

            if (error.code === "ERR_BAD_REQUEST" || error.response?.status === 400) {
                messageApi.error("Please enter a correct UUID.");
            } else {
                messageApi.error(message);
            }
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Stack spacing={4} sx={{ alignItems: "center" }}>
            <Box
                component="h6"
                sx={{
                    fontSize: "40px",
                    paddingBottom: "20px",
                    paddingTop: "48px",
                }}
            >
                Task Query
            </Box>

            <Stack
                direction="row"
                spacing={3}
                sx={{
                    alignItems: "center",
                    width: "100%",
                    maxWidth: 1120,
                }}
            >
                <Box
                    component="span"
                    sx={{
                        fontSize: 20,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                    }}
                >
                    UUID:
                </Box>

                <Input
                    placeholder="Please enter task UUID..."
                    allowClear
                    size="large"
                    value={taskUUID}
                    onChange={handleUUIDChange}
                    onPressEnter={handleSearch}
                    style={{
                        flex: 1,
                        borderRadius: 18,
                    }}
                />

                <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    loading={isSearching}
                    style={{
                        borderRadius: 18,
                        minWidth: 140,
                    }}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Stack>

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1120,
                }}
            >
                <TaskInformationDetail
                    taskInformation={taskInformation}
                    onRefresh={handleSearch}
                />
            </Box>
        </Stack>
    );
};

export default Workspace;
