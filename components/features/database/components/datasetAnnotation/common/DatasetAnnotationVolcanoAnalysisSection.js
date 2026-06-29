"use client";

import { useMemo } from "react";

import VolcanoAnalysisView
    from "@/components/features/common/Volcano/VolcanoAnalysisView";
import { useVolcanoQueryConfig }
    from "@/components/features/common/Volcano/useVolcanoQueryConfig";
import { useDatasetAnnotationDegVolcano }
    from "@/components/features/database/hooks/datasetAnnotation/useDatasetAnnotationDegVolcano";

const DEFAULT_AVAILABLE_DEG_RNA_TYPES_BY_SOURCE = {
    TCGA: ["mRNA", "miRNA", "lncRNA", "circRNA"],
    TIMEDB: ["mRNA"],
};

const DEFAULT_AVAILABLE_DEG_SCOPES_BY_SOURCE = {
    TCGA: ["all"],
    TIMEDB: ["all", "intersect"],
};

const DatasetAnnotationVolcanoAnalysisSection = ({
    source,
    dataset,
    annotationAvailability,
    title = "Expression Volcano Plot",
    height = 620,
    showDegScopeSelect = null,
}) => {
    const availableDegRnaTypes = useMemo(() => {
        const values = annotationAvailability?.available_deg_rna_types;

        if (Array.isArray(values)) {
            return values;
        }

        return DEFAULT_AVAILABLE_DEG_RNA_TYPES_BY_SOURCE[source] ?? [];
    }, [annotationAvailability, source]);

    const availableDegScopes = useMemo(() => {
        const values = annotationAvailability?.available_deg_scopes;

        if (Array.isArray(values)) {
            return values;
        }

        return DEFAULT_AVAILABLE_DEG_SCOPES_BY_SOURCE[source] ?? ["all"];
    }, [annotationAvailability, source]);

    const degMethod = annotationAvailability?.deg_method ?? "limma";
    const usePadj = annotationAvailability?.use_padj ?? true;
    const cutoffs = annotationAvailability?.cutoffs ?? {};

    const {
        queryConfig,
        setQueryConfig,
    } = useVolcanoQueryConfig({
        availableDegRnaTypes,
        availableDegScopes,
    });

    const {
        volcanoData,
        titlePrimary,
        titleSecondary,
        isLoading,
        isError,
    } = useDatasetAnnotationDegVolcano({
        source,
        datasetName: dataset,
        rnaType: queryConfig.rnaType,
        degScope: queryConfig.degScope,
        degMethod,
        usePadj,
    });

    return (
        <VolcanoAnalysisView
            title={title}
            height={height}
            queryConfig={queryConfig}
            setQueryConfig={setQueryConfig}
            volcanoData={volcanoData}
            titlePrimary={titlePrimary}
            titleSecondary={titleSecondary}
            isLoading={isLoading}
            isError={isError}
            availableDegRnaTypes={availableDegRnaTypes}
            availableDegScopes={availableDegScopes}
            cutoffsByRnaType={cutoffs}
            usePadj={usePadj}
            showDegScopeSelect={showDegScopeSelect}
            missingDescription={!dataset ? "Missing dataset" : null}
            unavailableDescription={
                dataset && !source
                    ? "Missing annotation source."
                    : null
            }
        />
    );
};

export default DatasetAnnotationVolcanoAnalysisSection;
