"use client";

import WorkflowSpongeResultSection
    from "@/components/features/workspace/components/detail/common/SpongeResult/WorkflowSpongeResultSection";


const PairedCohortSpongeResultSection = ({
    task,
}) => {
    return (
        <WorkflowSpongeResultSection
            task={task}
            title="Sponge Results"
        />
    );
};


export default PairedCohortSpongeResultSection;
