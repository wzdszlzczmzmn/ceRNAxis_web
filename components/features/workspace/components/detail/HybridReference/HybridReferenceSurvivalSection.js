"use client";

import WorkflowSurvivalKMSection
    from "@/components/features/workspace/components/detail/common/SurvivalKM/WorkflowSurvivalKMSection";

const HybridReferenceSurvivalSection = ({
    task,
    height = 620,
}) => {
    return (
        <WorkflowSurvivalKMSection
            task={task}
            title="Survival Analysis"
            height={height}
        />
    );
};

export default HybridReferenceSurvivalSection;
