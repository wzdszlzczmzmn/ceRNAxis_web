"use client";

import WorkflowExpCorrelationSection
    from "@/components/features/workspace/components/detail/common/ExpCorrelation/WorkflowExpCorrelationSection";

const PairedCohortExpCorrelationSection = ({
    task,
    height = 620,
}) => {
    return (
        <WorkflowExpCorrelationSection
            task={task}
            title="Expression Correlation Plot"
            height={height}
        />
    );
};

export default PairedCohortExpCorrelationSection;
