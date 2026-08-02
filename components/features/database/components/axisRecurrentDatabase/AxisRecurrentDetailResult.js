"use client";

import { Alert, Card } from "antd";
import { Stack } from "@mui/system";

import LoadingView
    from "@/components/common/status/LoadingView";
import ErrorView
    from "@/components/common/status/ErrorView";

import useAxisRecurrentDetail
    from "@/components/features/database/hooks/axisRecurrentDatabase/useAxisRecurrentDetail";

import AxisRecurrentDetailSummary
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentDetailSummary";

import AxisRecurrentDetailTable
    from "@/components/features/database/components/axisRecurrentDatabase/AxisRecurrentDetailTable";


const getErrorMessage = error => {
    const data = error?.response?.data;

    if (typeof data?.detail === "string") {
        return data.detail;
    }

    if (
        data
        && typeof data === "object"
        && !Array.isArray(data)
    ) {
        const firstEntry = Object.entries(data)[0];

        if (firstEntry) {
            const [fieldName, value] = firstEntry;

            if (Array.isArray(value)) {
                return `${fieldName}: ${value.join(" ")}`;
            }

            if (typeof value === "string") {
                return `${fieldName}: ${value}`;
            }
        }
    }

    return "Failed to load recurrent Axis detail.";
};


const AxisRecurrentDetailResult = ({
    signature,
}) => {
    const {
        summary,
        statistics,
        records,
        count,
        isLoading,
        isValidating,
        isError,
        error,
    } = useAxisRecurrentDetail(signature);

    if (!signature) {
        return (
            <Alert
                type="warning"
                showIcon
                message="Missing Axis signature"
                description={
                    "The recurrent Axis signature was " +
                    "not provided."
                }
            />
        );
    }

    if (isLoading) {
        return (
            <LoadingView
                containerSx={{
                    minHeight: "400px",
                }}
            />
        );
    }

    if (isError) {
        return (
            <ErrorView
                message={getErrorMessage(error)}
                containerSx={{
                    minHeight: "400px",
                }}
            />
        );
    }

    if (!summary) {
        return (
            <Alert
                type="info"
                showIcon
                message="Recurrent Axis not found"
            />
        );
    }

    return (
        <Stack spacing={3}>
            <AxisRecurrentDetailSummary
                summary={summary}
                statistics={statistics}
            />

            <Card
                title={`Context Records (${count})`}
            >
                {
                    count === 0 && (
                        <Alert
                            type="info"
                            showIcon
                            message="No matching contexts"
                            style={{
                                marginBottom: "16px",
                            }}
                        />
                    )
                }

                <AxisRecurrentDetailTable
                    summary={summary}
                    records={records}
                    loading={isValidating}
                />
            </Card>
        </Stack>
    );
};


export default AxisRecurrentDetailResult;
