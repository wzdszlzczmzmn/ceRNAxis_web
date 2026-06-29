"use client";

import { useState } from "react";

import ExpCorrelationAnalysisView
    from "@/components/features/common/ExpCorrelation/ExpCorrelationAnalysisView";
import { useDatasetAnnotationExpCorrelationOptions }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationExpCorrelationOptions";
import { useDatasetAnnotationExpCorrelationPlotData }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationExpCorrelationPlotData";

const EMPTY_DESCRIPTION_BY_SOURCE = {
    TCGA: "No TCGA annotation expression correlation data",
    TIMEDB: "No TIMEDB annotation expression correlation data",
};

const DatasetAnnotationExpCorrelationSection = ({
    source,
    dataset,
    title = "Expression Correlation Plot",
    height = 620,
}) => {
    const [queryConfig, setQueryConfig] = useState({
        type: null,
        gene1: null,
        gene2: null,
    });

    const {
        optionsData,
        validTypes,
        availableTypes,
        results,
        isLoading: isOptionsLoading,
        isError: isOptionsError,
    } = useDatasetAnnotationExpCorrelationOptions({
        source,
        datasetName: dataset,
    });

    const {
        plotData,
        titlePrimary,
        titleSecondary,
        isLoading: isPlotLoading,
        isError: isPlotError,
    } = useDatasetAnnotationExpCorrelationPlotData({
        source,
        datasetName: dataset,
        type: queryConfig.type,
        gene1: queryConfig.gene1,
        gene2: queryConfig.gene2,
    });

    return (
        <ExpCorrelationAnalysisView
            title={title}
            height={height}
            optionsData={optionsData}
            validTypes={validTypes}
            availableTypes={availableTypes}
            results={results}
            plotData={plotData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            isOptionsLoading={isOptionsLoading}
            isOptionsError={isOptionsError}
            isPlotLoading={isPlotLoading}
            isPlotError={isPlotError}
            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}
            missingDescription={!dataset ? "Missing dataset" : null}
            unavailableDescription={
                dataset && !source
                    ? "Missing annotation source."
                    : null
            }
            emptyDescription={
                EMPTY_DESCRIPTION_BY_SOURCE[source] ??
                "No expression correlation data"
            }
            showTcgaBasedTag={source === "TIMEDB"}
            tcgaBasedTooltip="Expression values for this correlation plot are based on TCGA reference expression data."
        />
    );
};

export default DatasetAnnotationExpCorrelationSection;
