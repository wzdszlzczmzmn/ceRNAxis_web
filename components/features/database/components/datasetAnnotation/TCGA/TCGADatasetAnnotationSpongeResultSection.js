"use client";

import SpongeResultCard
    from "@/components/features/common/SpongeResult/SpongeResultCard";
import {
    useTCGADatasetAnnotationSpongeResult
} from "@/components/features/database/hooks/datasetAnnotation/TCGA/useTCGADatasetAnnotationSpongeResult"


const TCGADatasetAnnotationSpongeResultSection = ({
    dataset,
}) => {
    const {
        count,
        columns,
        summary,
        results,
        isLoading,
        isError,
    } = useTCGADatasetAnnotationSpongeResult({
        datasetName: dataset,
    });

    return (
        <SpongeResultCard
            title="Sponge Results"
            count={count}
            columns={columns}
            summary={summary}
            results={results}
            isLoading={isLoading}
            isError={isError}
            missingDescription={
                !dataset
                    ? "Missing dataset"
                    : null
            }
            emptyDescription="No Sponge result"
            showProjectMatches={false}
        />
    );
};


export default TCGADatasetAnnotationSpongeResultSection;
