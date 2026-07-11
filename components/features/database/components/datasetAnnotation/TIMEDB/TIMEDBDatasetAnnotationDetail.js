import { useEffect, useMemo, useRef, useState } from "react";
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
    initialGroupBy = null,
}) => {
    const initializedDatasetRef = useRef(null);

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
        if (isGroupByLoading) {
            return;
        }

        if (groupByOptions.length === 0) {
            setGroupBy(null);
            initializedDatasetRef.current = dataset;
            return;
        }

        const isNewDataset = (
            initializedDatasetRef.current !== dataset
        );

        const initialMatchedGroupBy = findAvailableGroupByValue({
            requestedValue: initialGroupBy,
            options: groupByOptions,
        });

        const defaultMatchedGroupBy = findAvailableGroupByValue({
            requestedValue: defaultGroupBy,
            options: groupByOptions,
        });

        setGroupBy(previousGroupBy => {
            const previousMatchedGroupBy = findAvailableGroupByValue({
                requestedValue: previousGroupBy,
                options: groupByOptions,
            });

            /*
             * For the same dataset, preserve a valid manual selection.
             */
            if (!isNewDataset && previousMatchedGroupBy) {
                return previousMatchedGroupBy;
            }

            /*
             * URL groupBy only applies during initialisation
             * or when switching to a different dataset.
             */
            if (initialMatchedGroupBy) {
                return initialMatchedGroupBy;
            }

            if (defaultMatchedGroupBy) {
                return defaultMatchedGroupBy;
            }

            return groupByOptions[0]?.value ?? null;
        });

        initializedDatasetRef.current = dataset;
    }, [
        dataset,
        initialGroupBy,
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
