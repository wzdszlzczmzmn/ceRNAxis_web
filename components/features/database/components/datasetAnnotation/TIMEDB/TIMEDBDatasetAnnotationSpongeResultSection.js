"use client";

import SpongeResultCard
    from "@/components/features/common/SpongeResult/SpongeResultCard";
import {
    useTIMEDBDatasetAnnotationSpongeResult
} from "@/components/features/database/hooks/datasetAnnotation/TIMEDB/useTIMEDBDatasetAnnotationSpongeResult"


const TIMEDBDatasetAnnotationSpongeResultSection = ({
    dataset,
    groupBy,
    groupType,
}) => {
    const {
        count,
        columns,
        summary,
        results,
        isLoading,
        isError,
    } = useTIMEDBDatasetAnnotationSpongeResult({
        datasetName: dataset,
        groupBy,
        groupType,
    });

    const missingDescription = !dataset
        ? "Missing dataset"
        : !groupBy
            ? "Missing group by"
            : !groupType
                ? "Missing group type"
                : null;

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
                missingDescription
            }
            emptyDescription="No Sponge result"
            showProjectMatches={false}
        />
    );
};


export default TIMEDBDatasetAnnotationSpongeResultSection;
