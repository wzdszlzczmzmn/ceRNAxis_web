import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/system";
import { Alert } from "antd";

import DatasetMetadataDescription
    from "@/components/features/database/components/common/DatasetMetadataDescription";
import TIMEDBAnnotationNetworkResultWrapper
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationNetworkResultWrapper";
import TIMEDBAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationAxisFinalSection";
import TIMEDBAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationCMapResultSection";
import TIMEDBAnnotationVolcanoAnalysisSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationVolcanoAnalysisSection";
import TIMEDBAnnotationLog2FCCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationLog2FCCorrelationSection";
import TIMEDBAnnotationSurvivalSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationSurvivalSection";
import TIMEDBAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationDEGPathwaySection";
import TIMEDBAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationExpCorrelationSection";
import TIMEDBAnnotationGroupBySelector
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationGroupBySelector";
import {
    useTIMEDBDatasetGroupByOptions
} from "@/components/features/database/hooks/datasetAnnotation/useTIMEDBDatasetGroupByOptions";

const TIMEDBDatasetAnnotationDetail = ({
    dataset,
    metadata,
    annotationAvailability,
}) => {
    const {
        options: groupByOptions,
        defaultGroupBy,
        isLoading: isGroupByLoading,
        isError: isGroupByError,
        error: groupByError,
    } = useTIMEDBDatasetGroupByOptions({
        datasetName: dataset,
    });

    const [groupBy, setGroupBy] = useState(null);

    const availableGroupByValues = useMemo(() => {
        return groupByOptions.map((item) => item.value);
    }, [groupByOptions]);

    useEffect(() => {
        if (!defaultGroupBy) {
            setGroupBy(null);
            return;
        }

        setGroupBy((previousGroupBy) => {
            const previousStillAvailable =
                previousGroupBy && availableGroupByValues.includes(previousGroupBy);

            if (previousStillAvailable) {
                return previousGroupBy;
            }

            return defaultGroupBy;
        });
    }, [defaultGroupBy, availableGroupByValues]);

    const currentGroupByOption = useMemo(() => {
        if (!groupBy) {
            return null;
        }

        return groupByOptions.find((item) => item.value === groupBy) ?? null;
    }, [groupBy, groupByOptions]);

    const groupType = currentGroupByOption?.groupType ?? null;

    const visualizations = currentGroupByOption?.visualizations ?? {};

    return (
        <Stack spacing={4} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata} />

            <TIMEDBAnnotationGroupBySelector
                value={groupBy}
                onChange={setGroupBy}
                options={groupByOptions}
                loading={isGroupByLoading}
                disabled={isGroupByError}
            />

            {isGroupByError && (
                <Alert
                    type="error"
                    showIcon
                    message="Failed to load TIMEDB annotation group types."
                    description={
                        groupByError?.message
                        ?? "Please check the group-by availability API."
                    }
                />
            )}

            {!isGroupByLoading && !isGroupByError && groupByOptions.length === 0 && (
                <Alert
                    type="warning"
                    showIcon
                    message="No available TIMEDB annotation result."
                    description="No group type contains available visualization files, so this dataset annotation is treated as unsuccessful."
                />
            )}

            {visualizations.annotation_network && (
                <TIMEDBAnnotationNetworkResultWrapper
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.axis_final && (
                <TIMEDBAnnotationAxisFinalSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.cmap && (
                <TIMEDBAnnotationCMapResultSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.volcano && (
                <TIMEDBAnnotationVolcanoAnalysisSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    annotationAvailability={annotationAvailability}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.log2fc_correlation && (
                <TIMEDBAnnotationLog2FCCorrelationSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    annotationAvailability={annotationAvailability}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.exp_correlation && (
                <TIMEDBAnnotationExpCorrelationSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.survival && (
                <TIMEDBAnnotationSurvivalSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {visualizations.deg_pathway && (
                <TIMEDBAnnotationDEGPathwaySection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}
        </Stack>
    );
};

export default TIMEDBDatasetAnnotationDetail;
