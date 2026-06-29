"use client";

import WorkflowLog2FCCorrelationSection
    from "@/components/features/workspace/components/detail/common/Log2FCCorrelation/WorkflowLog2FCCorrelationSection";

const HybridReferenceLog2FCCorrelationSection = ({
    task,
    height = 620,
}) => {
    return (
        <WorkflowLog2FCCorrelationSection
            task={task}
            title="Log2FC Correlation Plot"
            height={height}
        />
    );
};

export default HybridReferenceLog2FCCorrelationSection;
