"use client";

import WorkflowAxisFinalSection
    from "@/components/features/workspace/components/detail/common/AxisFinal/WorkflowAxisFinalSection";

const PairedCohortAxisFinalSection = ({
    task,
}) => {
    return (
        <WorkflowAxisFinalSection
            task={task}
            title="ceRNA Axis Final Results"
        />
    );
};

export default PairedCohortAxisFinalSection;
