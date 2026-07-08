"use client";

import { useEffect, useState } from "react";

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
    groupBy = null,
    groupType = null,
    title = "Expression Correlation Plot",
    height = 620,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const [queryConfig, setQueryConfig] = useState({
        type: null,
        gene1: null,
        gene2: null,
    });

    useEffect(() => {
        setQueryConfig({
            type: null,
            gene1: null,
            gene2: null,
        });
    }, [dataset, groupBy, groupType]);

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
        groupBy,
        groupType,
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
        groupBy,
        groupType,
    });

    const missingDescription = !dataset
        ? "Missing dataset"
        : isTIMEDB && (!groupBy || !groupType)
            ? "Missing annotation group type."
            : null;

    const unavailableDescription = dataset && !source
        ? "Missing annotation source."
        : isTIMEDB && (!groupBy || !groupType)
            ? "TIMEDB expression correlation plot requires a valid group type."
            : null;

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
            missingDescription={missingDescription}
            unavailableDescription={unavailableDescription}
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
