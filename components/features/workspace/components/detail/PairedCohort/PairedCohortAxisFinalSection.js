"use client";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import { usePairedCohortAxisFinal } from "@/components/features/workspace/hooks/AxisFinal/usePairedCohortAxisFinal"


const PairedCohortAxisFinalSection = ({
    task,
}) => {
    const taskData = task?.data ?? {};

    const {
        count,
        columns,
        results,
        isLoading,
        isError,
    } = usePairedCohortAxisFinal({
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

export default PairedCohortAxisFinalSection;
