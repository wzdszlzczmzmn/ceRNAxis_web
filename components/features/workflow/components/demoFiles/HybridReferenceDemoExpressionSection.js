"use client";

import { Stack } from "@mui/system";

import HybridReferenceDemoExpressionDataTable
    from "@/components/features/workflow/components/demoFiles/HybridReferenceDemoExpressionDataTable";

const DEFAULT_RNA_TYPES = [
    "mRNA",
];

const HybridReferenceDemoExpressionSection = ({
    rnaTypes = DEFAULT_RNA_TYPES,
}) => {
    if (!Array.isArray(rnaTypes) || rnaTypes.length === 0) {
        return null;
    }

    return (
        <Stack spacing={5}>
            {rnaTypes.map(rnaType => (
                <HybridReferenceDemoExpressionDataTable
                    key={rnaType}
                    rnaType={rnaType}
                />
            ))}
        </Stack>
    );
};

export default HybridReferenceDemoExpressionSection;
