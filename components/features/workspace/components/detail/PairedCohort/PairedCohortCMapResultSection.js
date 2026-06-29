"use client";

import WorkflowCMapResultSection
    from "@/components/features/workspace/components/detail/common/CMap/WorkflowCMapResultSection";

const PairedCohortCMapResultSection = ({
    task,
}) => {
    return (
        <WorkflowCMapResultSection
            task={task}
            title="CMap Results"
        />
    );
};

export default PairedCohortCMapResultSection;
