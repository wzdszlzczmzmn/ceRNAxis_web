"use client";

import WorkflowCMapResultSection
    from "@/components/features/workspace/components/detail/common/CMap/WorkflowCMapResultSection";

const HybridReferenceCMapResultSection = ({
    task,
}) => {
    return (
        <WorkflowCMapResultSection
            task={task}
            title="CMap Results"
        />
    );
};

export default HybridReferenceCMapResultSection;
