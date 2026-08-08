import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getSCSTDatasetAnnotationDEGVolcanoURL,
} from "@/lib/api/database/datasetAnnotation";
import {
    formatVolcanoTitleSecondary,
    normalizeVolcanoData,
} from "@/components/features/common/Volcano/volcanoUtils";


export const useSCSTDatasetAnnotationDEGVolcano = ({
    dataset,
    dataType,
    groupBy,
    groupValue,

    rnaType,
    degScope = "all",
    degMethod = "limma",
    usePadj = false,
}) => {
    const shouldFetch = Boolean(
        dataset
        && ["sc", "st"].includes(dataType)
        && groupBy
        && groupValue
        && rnaType
        && degScope
        && degMethod
    );

    const url = shouldFetch
        ? getSCSTDatasetAnnotationDEGVolcanoURL({
            dataset,
            dataType,
            groupBy,
            groupValue,
            rnaType,
            degScope,
            degMethod,
            usePadj,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher,
    );

    const volcanoData = (
        normalizeVolcanoData(
            data
        )
    );

    return {
        volcanoData,

        titlePrimary: (
            volcanoData?.dataset_name
            ?? dataset
            ?? null
        ),

        titleSecondary: (
            formatVolcanoTitleSecondary({
                volcanoData,
                rnaType,
                degScope,
            })
        ),

        availableDegRnaTypes: (
            volcanoData
                ?.available_deg_rna_types
            ?? []
        ),

        availableDegScopes: (
            volcanoData
                ?.available_deg_scopes
            ?? []
        ),

        meta: {
            source:
                volcanoData?.source
                ?? null,

            datasetName:
                volcanoData?.dataset_name
                ?? dataset
                ?? null,

            dataType:
                volcanoData?.data_type
                ?? dataType
                ?? null,

            groupBy:
                volcanoData?.group_by
                ?? groupBy
                ?? null,

            groupValue:
                volcanoData?.group_value
                ?? groupValue
                ?? null,

            degMethod:
                volcanoData?.deg_method
                ?? degMethod
                ?? null,

            usePadj:
                volcanoData?.use_padj
                ?? usePadj,

            pvalueSource:
                volcanoData?.pvalue_source
                ?? null,

            degFile:
                volcanoData?.deg_file
                ?? null,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};
