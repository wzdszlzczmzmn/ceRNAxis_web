import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/system";
import { Alert } from "antd";
import { useRouter } from "next/router";

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

const getSingleQueryValue = (value) => {
    if (Array.isArray(value)) {
        return value[0] ?? null;
    }

    return value ?? null;
};

const normalizeGroupByValue = (value) => {
    return String(value ?? "").trim().toLowerCase();
};

const findAvailableGroupByValue = ({
    requestedValue,
    options,
}) => {
    const normalizedRequestedValue = normalizeGroupByValue(
        requestedValue
    );

    if (!normalizedRequestedValue) {
        return null;
    }

    const matchedOption = options.find(
        option =>
            normalizeGroupByValue(option?.value) ===
            normalizedRequestedValue
    );

    return matchedOption?.value ?? null;
};

const TIMEDBDatasetAnnotationDetail = ({
    dataset,
    metadata,
    annotationAvailability,
}) => {
    const router = useRouter();

    const urlGroupBy = router.isReady
        ? getSingleQueryValue(router.query.groupBy)
        : null;

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

    useEffect(() => {
        if (!router.isReady || isGroupByLoading) {
            return;
        }

        if (groupByOptions.length === 0) {
            setGroupBy(null);
            return;
        }

        const urlMatchedGroupBy = findAvailableGroupByValue({
            requestedValue: urlGroupBy,
            options: groupByOptions,
        });

        const defaultMatchedGroupBy = findAvailableGroupByValue({
            requestedValue: defaultGroupBy,
            options: groupByOptions,
        });

        setGroupBy(previousGroupBy => {
            if (urlMatchedGroupBy) {
                return urlMatchedGroupBy;
            }

            const previousMatchedGroupBy = findAvailableGroupByValue({
                requestedValue: previousGroupBy,
                options: groupByOptions,
            });

            if (previousMatchedGroupBy) {
                return previousMatchedGroupBy;
            }

            if (defaultMatchedGroupBy) {
                return defaultMatchedGroupBy;
            }

            return groupByOptions[0]?.value ?? null;
        });
    }, [
        router.isReady,
        urlGroupBy,
        defaultGroupBy,
        groupByOptions,
        isGroupByLoading,
    ]);

    const currentGroupByOption = useMemo(() => {
        if (!groupBy) {
            return null;
        }

        return groupByOptions.find(
            item => item.value === groupBy
        ) ?? null;
    }, [
        groupBy,
        groupByOptions,
    ]);

    const groupType =
        currentGroupByOption?.groupType ?? null;

    const visualizations =
        currentGroupByOption?.visualizations ?? {};

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
