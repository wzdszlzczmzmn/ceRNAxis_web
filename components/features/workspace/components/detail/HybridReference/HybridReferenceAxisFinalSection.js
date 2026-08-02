"use client";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import {
    useHybridReferenceAxisFinal
} from "@/components/features/workspace/hooks/AxisFinal/useHybridReferenceAxisFinal"

const HybridReferenceAxisFinalSection = ({
    task,
}) => {
    const taskData = task?.data ?? {};

    const {
        count,
        columns,
        results,
        isLoading,
        isError,
    } = useHybridReferenceAxisFinal({
        taskUUID: taskData.uuid,
    });

    return (
        <AxisFinalResultCard
            title="ceRNA Axis Final Results"
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
            showProjectMatches
        />
    );
};

export default HybridReferenceAxisFinalSection;
