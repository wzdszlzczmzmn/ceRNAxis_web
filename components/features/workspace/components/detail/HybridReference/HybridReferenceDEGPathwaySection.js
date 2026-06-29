"use client";

import WorkflowDEGPathwaySection
    from "@/components/features/workspace/components/detail/common/DEGPathway/WorkflowDEGPathwaySection";

const HybridReferenceDEGPathwaySection = ({
    task,
    height = 680,
}) => {
    return (
        <WorkflowDEGPathwaySection
            task={task}
            title="DEG Pathway Enrichment Plot"
            height={height}
        />
    );
};

export default HybridReferenceDEGPathwaySection;
