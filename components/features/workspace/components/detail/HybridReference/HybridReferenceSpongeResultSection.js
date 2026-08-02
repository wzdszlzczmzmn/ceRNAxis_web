"use client";

import WorkflowSpongeResultSection
    from "@/components/features/workspace/components/detail/common/SpongeResult/WorkflowSpongeResultSection";


const HybridReferenceSpongeResultSection = ({
    task,
}) => {
    return (
        <WorkflowSpongeResultSection
            task={task}
            title="Sponge Results"
        />
    );
};


export default HybridReferenceSpongeResultSection;
