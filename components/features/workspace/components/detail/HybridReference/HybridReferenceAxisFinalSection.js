"use client";

import WorkflowAxisFinalSection
    from "@/components/features/workspace/components/detail/common/AxisFinal/WorkflowAxisFinalSection";

const HybridReferenceAxisFinalSection = ({
    task,
}) => {
    return (
        <WorkflowAxisFinalSection
            task={task}
            title="ceRNA Axis Final Results"
        />
    );
};

export default HybridReferenceAxisFinalSection;
