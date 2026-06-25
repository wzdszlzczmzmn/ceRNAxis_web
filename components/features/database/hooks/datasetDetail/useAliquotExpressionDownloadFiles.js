import { getAliquotExpressionDownloadFilesURL } from "@/lib/api/database/datasetDetail"
import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"

export const useAliquotExpressionDownloadFiles = (dataset) => {
    const url = getAliquotExpressionDownloadFilesURL({ dataset });

    const { data, error, isLoading, mutate } = useSWR(url, fetcher);

    return {
        dataset,
        aliquotExpressionFileFormat: data?.aliquot_expression_file_format,
        availableAliquotExpressionFiles:
            data?.available_aliquot_expression_files ?? [],
        availableIsoformFiles:
            data?.available_isoform_files ?? [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
};
