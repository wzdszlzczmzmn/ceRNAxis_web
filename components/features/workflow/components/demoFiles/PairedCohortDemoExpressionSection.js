"use client";

import { Stack } from "@mui/system";
import PairedCohortDemoExpressionDataTable
    from "@/components/features/workflow/components/demoFiles/PairedCohortDemoExpressionDataTable";

const DEFAULT_RNA_TYPES = [
    "mRNA",
    "miRNA",
    "lncRNA",
];

const PairedCohortDemoExpressionSection = ({
    rnaTypes = DEFAULT_RNA_TYPES,
}) => {
    if (!Array.isArray(rnaTypes) || rnaTypes.length === 0) {
        return null;
    }

    return (
        <Stack spacing={5}>
            {rnaTypes.map(rnaType => (
                <PairedCohortDemoExpressionDataTable
                    key={rnaType}
                    rnaType={rnaType}
                />
            ))}
        </Stack>
    );
};

export default PairedCohortDemoExpressionSection;
