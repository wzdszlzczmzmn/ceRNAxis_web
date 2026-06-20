import { Badge, Button, Space } from "antd";

export const TASK_STATUS_TEXT_MAP = {
    R: "Running",
    P: "Pending",
    S: "Success",
    F: "Failed",

    0: "Pending",
    1: "Running",
    2: "Success",
    3: "Failed",
};

export const TASK_STATUS_BADGE_STATUS_MAP = {
    R: "processing",
    P: "default",
    S: "success",
    F: "error",

    0: "default",
    1: "processing",
    2: "success",
    3: "error",
};

export const TASK_STATUS_NORMALIZED_MAP = {
    R: "R",
    P: "P",
    S: "S",
    F: "F",

    0: "P",
    1: "R",
    2: "S",
    3: "F",
};

export const getTaskData = (taskInformation) => {
    return taskInformation?.data ?? {};
};

export const normalizeTaskStatus = (status) => {
    return TASK_STATUS_NORMALIZED_MAP[status] ?? status;
};

export const isTaskSuccess = (status) => {
    return normalizeTaskStatus(status) === "S";
};

export const isTaskPending = (status) => {
    return normalizeTaskStatus(status) === "P";
};

export const getStatusBadge = (taskInformation) => {
    const data = getTaskData(taskInformation);

    const normalizedStatus = normalizeTaskStatus(data.status);

    const statusText =
        TASK_STATUS_TEXT_MAP[data.status] ||
        TASK_STATUS_TEXT_MAP[normalizedStatus] ||
        data.status ||
        "Unknown";

    const badgeStatus =
        TASK_STATUS_BADGE_STATUS_MAP[data.status] ||
        TASK_STATUS_BADGE_STATUS_MAP[normalizedStatus] ||
        "default";

    if (normalizedStatus === "P") {
        return (
            <Space>
                <Badge status={badgeStatus} text={statusText} />

                {data.position !== undefined && data.position !== null && (
                    <Button
                        size="small"
                        style={{
                            backgroundColor: "#E47443",
                            color: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #E47443",
                            borderRadius: 20,
                        }}
                    >
                        Queue Position: {Number.parseInt(data.position, 10) + 1}
                    </Button>
                )}
            </Space>
        );
    }

    return <Badge status={badgeStatus} text={statusText} />;
};

export const getListCount = (value) => {
    if (Array.isArray(value)) return value.length;

    if (typeof value === "string" && value.trim()) {
        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean)
            .length;
    }

    return 0;
};
