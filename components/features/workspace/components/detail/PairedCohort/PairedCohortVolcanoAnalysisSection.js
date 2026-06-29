"use client";

import WorkflowVolcanoAnalysisSection
    from "@/components/features/workspace/components/detail/common/Volcano/WorkflowVolcanoAnalysisSection";

const PairedCohortVolcanoAnalysisSection = ({
    task,
    height = 620,
}) => {
    return (
        <WorkflowVolcanoAnalysisSection
            task={task}
            title="Expression Volcano Plot"
            height={height}
            showDegScopeSelect={false}
        />
    );
};

export default PairedCohortVolcanoAnalysisSection;
