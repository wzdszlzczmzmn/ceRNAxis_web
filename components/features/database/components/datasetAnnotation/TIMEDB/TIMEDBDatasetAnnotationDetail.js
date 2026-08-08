import { useEffect, useMemo, useRef, useState } from "react";
import { Stack } from "@mui/system";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
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
import TIMEDBDatasetAnnotationSpongeResultSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBDatasetAnnotationSpongeResultSection";
import TIMEDBAnnotationGroupBySelector
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationGroupBySelector";
import { useTIMEDBDatasetAnnotationAvailable }
    from "@/components/features/database/hooks/datasetAnnotation/TIMEDB/useTIMEDBDatasetAnnotationAvailable";
import TIMEDBAnnotationCMScoreSection
    from "@/components/features/database/components/datasetAnnotation/TIMEDB/TIMEDBAnnotationCMScoreSection"

const STATUS_CONTAINER_SX = {
    height: "80vh",
    marginTop: "40px",
};

const normalizeGroupByValue = value => {
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
    initialGroupBy = null,
}) => {
    const initializedDatasetRef = useRef(null);

    const {
        available,
        groupByOptions,
        defaultGroupBy,
        isLoading,
        isError,
    } = useTIMEDBDatasetAnnotationAvailable({
        datasetName: dataset,
    });

    const [groupBy, setGroupBy] = useState(null);

    useEffect(() => {
        if (isLoading) {
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

            if (!isNewDataset && previousMatchedGroupBy) {
                return previousMatchedGroupBy;
            }

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
        isLoading,
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

    if (isLoading) {
        return <LoadingView containerSx={STATUS_CONTAINER_SX} />;
    }

    if (isError) {
        return <ErrorView containerSx={STATUS_CONTAINER_SX} />;
    }

    if (!available) {
        return (
            <EmptyView
                containerSx={STATUS_CONTAINER_SX}
                description="No TIMEDB annotation visualization is available for this dataset."
            />
        );
    }

    if (!currentGroupByOption) {
        return <LoadingView containerSx={STATUS_CONTAINER_SX} />;
    }

    const groupType = currentGroupByOption.groupType;
    const visualizations = currentGroupByOption.visualizations;

    const annotationNetwork =
        visualizations.annotation_network ?? {};
    const axisFinal =
        visualizations.axis_final ?? {};
    const cmap =
        visualizations.cmap ?? {};
    const volcano =
        visualizations.volcano ?? {};
    const log2fcCorrelation =
        visualizations.log2fc_correlation ?? {};
    const expCorrelation =
        visualizations.exp_correlation ?? {};
    const survival =
        visualizations.survival ?? {};
    const degPathway =
        visualizations.deg_pathway ?? {};
    const sponge =
        visualizations.sponge ?? {};
    const CMdrug = visualizations.CMdrug ?? {};

    return (
        <Stack spacing={4} sx={{ pt: "12px", px: "32px" }}>
            <DatasetMetadataDescription metadata={metadata} />

            <TIMEDBAnnotationGroupBySelector
                value={groupBy}
                onChange={setGroupBy}
                options={groupByOptions}
                loading={false}
                disabled={false}
            />

            {annotationNetwork.available && (
                <TIMEDBAnnotationNetworkResultWrapper
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {axisFinal.available && (
                <TIMEDBAnnotationAxisFinalSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {sponge.available && (
                <TIMEDBDatasetAnnotationSpongeResultSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                />
            )}

            {cmap.available && (
                <TIMEDBAnnotationCMapResultSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {volcano.available && (
                <TIMEDBAnnotationVolcanoAnalysisSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    annotationAvailability={volcano}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {log2fcCorrelation.available && (
                <TIMEDBAnnotationLog2FCCorrelationSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    annotationAvailability={log2fcCorrelation}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {expCorrelation.available && (
                <TIMEDBAnnotationExpCorrelationSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {survival.available && (
                <TIMEDBAnnotationSurvivalSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {degPathway.available && (
                <TIMEDBAnnotationDEGPathwaySection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                    groupByAvailability={currentGroupByOption}
                />
            )}

            {CMdrug.available && (
                <TIMEDBAnnotationCMScoreSection
                    dataset={dataset}
                    groupBy={groupBy}
                    groupType={groupType}
                />
            )}
        </Stack>
    );
};

export default TIMEDBDatasetAnnotationDetail;
