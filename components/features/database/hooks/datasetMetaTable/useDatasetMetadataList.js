import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import {
    getDatasetMetadataURL,
    isValidGeneBioType,
} from "@/lib/api/database/datasetMetaTable"

const useDatasetMetadataList = (geneBioType) => {
    const isValid = isValidGeneBioType(geneBioType)
    const url = isValid ? getDatasetMetadataURL(geneBioType) : null

    const { data, error, isLoading, mutate } = useSWR(
        url,
        fetcher
    )

    return {
        isValidGeneBioType: isValid,
        geneBioType: data?.gene_bio_type ?? geneBioType,
        count: data?.count ?? 0,
        datasets: data?.results ?? [],
        isLoading: isValid ? isLoading : false,
        isError: error,
        mutate,
    }
}

export default useDatasetMetadataList
