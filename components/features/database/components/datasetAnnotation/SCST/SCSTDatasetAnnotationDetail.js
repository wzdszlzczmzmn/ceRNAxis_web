import { Stack } from "@mui/system";
import { Alert } from "antd";

import DatasetMetadataDescription
    from "@/components/features/database/components/common/DatasetMetadataDescription";
import SCSTAnnotationGroupBySelector
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationGroupBySelector";
import SCSTAnnotationNetworkResultSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationNetworkResultSection";
import SCSTAnnotationAxisFinalSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationAxisFinalSection";
import SCSTAnnotationCMapResultSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationCMapResultSection";
import SCSTAnnotationVolcanoAnalysisSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationVolcanoAnalysisSection";
import {
    useSCSTDatasetAnnotationAvailable,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationAvailable";
import {
    useSCSTDatasetAnnotationGroupBySelection,
} from "@/components/features/database/hooks/datasetAnnotation/SCST/useSCSTDatasetAnnotationGroupBySelection";
import SCSTAnnotationLog2FCCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationLog2FCCorrelationSection"
import SCSTAnnotationExpCorrelationSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationExpCorrelationSection"
import SCSTAnnotationSurvivalSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationSurvivalSection"
import SCSTAnnotationDEGPathwaySection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationDEGPathwaySection"
import SCSTAnnotationCMScoreSection
    from "@/components/features/database/components/datasetAnnotation/SCST/SCSTAnnotationCMScoreSection"


const normalizeProgramme = value => {
    return String(
        value ?? ""
    )
        .trim()
        .toUpperCase();
};


const getSCSTDataType = metadata => {
    const programme = normalizeProgramme(
        metadata?.programme
    );

    if (programme === "TISCH2") {
        return "sc";
    }

    if (programme === "SCTML") {
        return "st";
    }

    return null;
};


const SCSTDatasetAnnotationDetail = ({
    dataset,
    metadata,
    initialGroupBy = null,
}) => {
    const dataType = getSCSTDataType(
        metadata
    );

    const {
        available,
        defaultGroupBy,
        availableGroupByOptions,
        isLoading,
        isError,
        error,
    } = useSCSTDatasetAnnotationAvailable({
        datasetName: dataset,
        dataType,
    });

    const {
        groupBy,
        setGroupBy,
        currentGroupByOption,
    } = (
        useSCSTDatasetAnnotationGroupBySelection({
            datasetName: dataset,
            groupByOptions:
            availableGroupByOptions,
            defaultGroupBy,
            initialGroupBy,
            isLoading,
        })
    );

    const networkGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.annotation_network
        ?? []
    );

    const networkDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.annotation_network
        ?? null
    );

    const axisFinalGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.axis_final
        ?? []
    );

    const axisFinalDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.axis_final
        ?? null
    );

    const cmapGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.cmap
        ?? []
    );

    const cmapDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.cmap
        ?? null
    );

    const volcanoGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.volcano
        ?? []
    );

    const volcanoDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.volcano
        ?? null
    );

    const log2fcCorrelationGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.log2fc_correlation
        ?? []
    );

    const log2fcCorrelationDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.log2fc_correlation
        ?? null
    );

    const expCorrelationGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.exp_correlation
        ?? []
    );

    const expCorrelationDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.exp_correlation
        ?? null
    );

    const survivalGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.survival
        ?? []
    );

    const survivalDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.survival
        ?? null
    );

    const degPathwayGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.deg_pathway
        ?? []
    );

    const degPathwayDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.deg_pathway
        ?? null
    );

    const cmScoreGroupValueOptions = (
        currentGroupByOption
            ?.visualizationGroupValueOptions
            ?.CMdrug
        ?? []
    );

    const cmScoreDefaultGroupValue = (
        currentGroupByOption
            ?.visualizationDefaultGroupValues
            ?.CMdrug
        ?? null
    );

    const availableVisualizationCount = (
        currentGroupByOption
            ?.availableVisualizationCount
        ?? 0
    );

    return (
        <Stack
            spacing={4}
            sx={{
                pt: "12px",
                px: "32px",
            }}
            aria-busy={isLoading}
            data-scst-data-type={
                dataType ?? undefined
            }
            data-group-by={
                groupBy ?? undefined
            }
            data-available-visualization-count={
                availableVisualizationCount
            }
        >
            <DatasetMetadataDescription
                metadata={metadata}
            />

            <SCSTAnnotationGroupBySelector
                value={groupBy}
                onChange={setGroupBy}
                options={
                    availableGroupByOptions
                }
                loading={isLoading}
                disabled={
                    isError
                    || !dataType
                }
            />

            {isError && (
                <Alert
                    type="error"
                    showIcon
                    message={
                        "Failed to load SC/ST annotation availability."
                    }
                    description={
                        error?.message
                        ?? (
                            "Please check the SC/ST "
                            + "annotation availability API."
                        )
                    }
                />
            )}

            {!isLoading
                && !isError
                && !available
                && (
                    <Alert
                        type="warning"
                        showIcon
                        message={
                            "No available SC/ST annotation result."
                        }
                        description={
                            "No Group By contains an available "
                            + "visualization for this dataset."
                        }
                    />
                )}

            {networkGroupValueOptions.length > 0 && (
                <SCSTAnnotationNetworkResultSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        networkGroupValueOptions
                    }
                    defaultGroupValue={
                        networkDefaultGroupValue
                    }
                />
            )}

            {axisFinalGroupValueOptions.length > 0 && (
                <SCSTAnnotationAxisFinalSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        axisFinalGroupValueOptions
                    }
                    defaultGroupValue={
                        axisFinalDefaultGroupValue
                    }
                />
            )}

            {cmapGroupValueOptions.length > 0 && (
                <SCSTAnnotationCMapResultSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        cmapGroupValueOptions
                    }
                    defaultGroupValue={
                        cmapDefaultGroupValue
                    }
                />
            )}

            {volcanoGroupValueOptions.length > 0 && (
                <SCSTAnnotationVolcanoAnalysisSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        volcanoGroupValueOptions
                    }
                    defaultGroupValue={
                        volcanoDefaultGroupValue
                    }
                />
            )}

            {log2fcCorrelationGroupValueOptions.length > 0 && (
                <SCSTAnnotationLog2FCCorrelationSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        log2fcCorrelationGroupValueOptions
                    }
                    defaultGroupValue={
                        log2fcCorrelationDefaultGroupValue
                    }
                />
            )}

            {expCorrelationGroupValueOptions.length > 0 && (
                <SCSTAnnotationExpCorrelationSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        expCorrelationGroupValueOptions
                    }
                    defaultGroupValue={
                        expCorrelationDefaultGroupValue
                    }
                />
            )}

            {survivalGroupValueOptions.length > 0 && (
                <SCSTAnnotationSurvivalSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        survivalGroupValueOptions
                    }
                    defaultGroupValue={
                        survivalDefaultGroupValue
                    }
                />
            )}

            {degPathwayGroupValueOptions.length > 0 && (
                <SCSTAnnotationDEGPathwaySection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        degPathwayGroupValueOptions
                    }
                    defaultGroupValue={
                        degPathwayDefaultGroupValue
                    }
                />
            )}

            {cmScoreGroupValueOptions.length > 0 && (
                <SCSTAnnotationCMScoreSection
                    dataset={dataset}
                    dataType={dataType}
                    groupBy={groupBy}
                    groupValueOptions={
                        cmScoreGroupValueOptions
                    }
                    defaultGroupValue={
                        cmScoreDefaultGroupValue
                    }
                />
            )}
        </Stack>
    );
};


export default SCSTDatasetAnnotationDetail;
